import { and, eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { entitlements, categories } from '@/lib/db/schema';

/**
 * The single access gate for the whole app.
 *
 * One entitlement row = one grant of access. Every way of selling or giving
 * access (single purchase, category bundle, all-access pass, subscription,
 * promo, admin comp, marketplace sale) reduces to rows in `entitlements`;
 * every access decision goes through the functions in this file.
 */

export type EntitlementScope = 'all' | 'category' | 'template' | 'course' | 'feature';

export interface EntitlementRow {
  scope: EntitlementScope;
  scopeId: string | null;
  expiresAt: Date | null;
  revokedAt: Date | null;
}

export interface EntitlementQuery {
  scope: EntitlementScope;
  scopeId?: string | null;
}

/** Pure matcher — the whole access decision, testable without a database. */
export function matchesEntitlement(
  rows: EntitlementRow[],
  queries: EntitlementQuery[],
  now: Date = new Date()
): boolean {
  return rows.some((row) => {
    if (row.revokedAt) return false;
    if (row.expiresAt && row.expiresAt <= now) return false;
    return queries.some(
      (q) =>
        row.scope === q.scope &&
        (q.scope === 'all' || row.scopeId === (q.scopeId ?? null))
    );
  });
}

/** All non-revoked entitlement rows for a user (expiry filtered in matcher). */
export async function getEntitlements(userId: string): Promise<EntitlementRow[]> {
  const rows = await db()
    .select({
      scope: entitlements.scope,
      scopeId: entitlements.scopeId,
      expiresAt: entitlements.expiresAt,
      revokedAt: entitlements.revokedAt,
    })
    .from(entitlements)
    .where(eq(entitlements.userId, userId));
  return rows as EntitlementRow[];
}

export async function hasEntitlement(
  userId: string,
  queries: EntitlementQuery[]
): Promise<boolean> {
  return matchesEntitlement(await getEntitlements(userId), queries);
}

export interface TemplateAccessInput {
  id: string;
  categoryId: string | null;
  isFree: boolean;
  /** code | figma | ai_prompt — plans (basic/pro/premium) grant by kind */
  assetKind?: string | null;
}

/**
 * Queries that unlock a template: all-access, the template itself, its
 * content category, or a plan covering its asset kind
 * (feature `templates:figma` etc. — what Basic/Pro/Premium grant).
 */
export function templateQueries(template: TemplateAccessInput): EntitlementQuery[] {
  const queries: EntitlementQuery[] = [
    { scope: 'all' },
    { scope: 'template', scopeId: template.id },
  ];
  if (template.categoryId) {
    queries.push({ scope: 'category', scopeId: template.categoryId });
  }
  if (template.assetKind) {
    queries.push({ scope: 'feature', scopeId: `templates:${template.assetKind}` });
  }
  return queries;
}

/** Sync check: given entitlement rows, can this template be viewed? */
export function hasTemplateAccess(
  template: TemplateAccessInput,
  rows: EntitlementRow[]
): boolean {
  if (template.isFree) return true;
  return matchesEntitlement(rows, templateQueries(template));
}

/** Free templates are open to everyone; paid ones need a covering entitlement. */
export async function canAccessTemplate(
  userId: string | null,
  template: TemplateAccessInput
): Promise<boolean> {
  if (template.isFree) return true;
  if (!userId) return false;
  return hasTemplateAccess(template, await getEntitlements(userId));
}

/** Queries that unlock a course module (all-access, blanket courses pass, or the module itself). */
export function courseQueries(moduleId: string): EntitlementQuery[] {
  return [
    { scope: 'all' },
    { scope: 'feature', scopeId: 'courses' },
    { scope: 'course', scopeId: moduleId },
  ];
}

export async function canAccessCourse(userId: string | null, moduleId: string) {
  if (!userId) return false;
  return hasEntitlement(userId, courseQueries(moduleId));
}

export async function canUseFeature(userId: string | null, feature: string) {
  if (!userId) return false;
  return hasEntitlement(userId, [
    { scope: 'all' },
    { scope: 'feature', scopeId: feature },
  ]);
}

export interface GrantInput {
  userId: string;
  scope: EntitlementScope;
  scopeId?: string | null;
  source: 'purchase' | 'subscription' | 'admin_grant' | 'promo' | 'marketplace';
  paymentId?: string | null;
  expiresAt?: Date | null;
}

/**
 * Idempotent grant: an existing active row for the same (user, scope, scopeId)
 * is extended rather than duplicated — renewals just push expiresAt forward.
 */
export async function grantEntitlement(input: GrantInput) {
  const scopeId = input.scopeId ?? null;
  const existing = await db()
    .select()
    .from(entitlements)
    .where(
      and(
        eq(entitlements.userId, input.userId),
        eq(entitlements.scope, input.scope),
        scopeId === null
          ? undefined
          : eq(entitlements.scopeId, scopeId)
      )
    );

  const active = existing.find(
    (row) =>
      !row.revokedAt && (row.scopeId ?? null) === scopeId
  );

  if (active) {
    // Lifetime (null) always wins; otherwise keep the later expiry
    const next =
      input.expiresAt === null || active.expiresAt === null
        ? null
        : input.expiresAt && input.expiresAt > active.expiresAt
          ? input.expiresAt
          : active.expiresAt;
    await db()
      .update(entitlements)
      .set({ expiresAt: next, paymentId: input.paymentId ?? active.paymentId })
      .where(eq(entitlements.id, active.id));
    return active.id;
  }

  const [row] = await db()
    .insert(entitlements)
    .values({
      userId: input.userId,
      scope: input.scope,
      scopeId,
      source: input.source,
      paymentId: input.paymentId ?? null,
      expiresAt: input.expiresAt ?? null,
    })
    .returning();
  return row.id;
}

export async function revokeEntitlement(
  userId: string,
  scope: EntitlementScope,
  scopeId?: string | null
) {
  const rows = await db()
    .select()
    .from(entitlements)
    .where(
      and(eq(entitlements.userId, userId), eq(entitlements.scope, scope))
    );
  const target = rows.find(
    (r) => !r.revokedAt && (r.scopeId ?? null) === (scopeId ?? null)
  );
  if (!target) return false;
  await db()
    .update(entitlements)
    .set({ revokedAt: new Date() })
    .where(eq(entitlements.id, target.id));
  return true;
}

/** Resolve a category slug to its id (products config speaks slugs). */
export async function resolveCategoryId(slug: string): Promise<string | null> {
  const [row] = await db()
    .select({ id: categories.id })
    .from(categories)
    .where(eq(categories.slug, slug));
  return row?.id ?? null;
}

export { derivePlan, getUserPlan, planCopyLimit } from './plan';
