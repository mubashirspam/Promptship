import { neon } from '@neondatabase/serverless';
import { drizzle, type NeonHttpDatabase } from 'drizzle-orm/neon-http';
import { eq, inArray } from 'drizzle-orm';
import * as schema from '@/lib/db/schema';
import { prompts, categories } from '@/lib/db/schema';
import { resolveDatabaseUrl } from '@/lib/db';

type PromptRow = typeof prompts.$inferSelect;
type CategoryRow = typeof categories.$inferSelect;

let prodDb: NeonHttpDatabase<typeof schema> | null = null;
function getProductionDb(): NeonHttpDatabase<typeof schema> {
  if (!prodDb) {
    const url = process.env.DATABASE_URL_PRODUCTION;
    if (!url) throw new Error('DATABASE_URL_PRODUCTION is not set');
    prodDb = drizzle(neon(url), { schema });
  }
  return prodDb;
}

/**
 * Is this admin-panel deployment allowed to push to production? False when
 * DATABASE_URL_PRODUCTION isn't configured here, or when the currently
 * resolved DB (via resolveDatabaseUrl) already IS production — i.e. this is
 * the production deployment itself, which has nothing to promote to.
 */
export function canPromoteToProduction(): boolean {
  const prodUrl = process.env.DATABASE_URL_PRODUCTION;
  if (!prodUrl) return false;
  return resolveDatabaseUrl() !== prodUrl;
}

/**
 * Copy one template row (+ its category, mirrored by slug) into production.
 * Upserts by slug — safe to call repeatedly ("push again" after edits).
 * R2 asset URLs/keys are shared between environments, so nothing is re-uploaded.
 */
export async function promoteTemplateToProduction(
  row: PromptRow,
  sourceCategory: CategoryRow | null
): Promise<{ created: boolean }> {
  if (!canPromoteToProduction()) {
    throw new Error('Production promotion is not available from this environment');
  }
  const production = getProductionDb();

  let categoryId: string | null = null;
  if (sourceCategory) {
    const existing = await production.query.categories.findFirst({
      where: eq(categories.slug, sourceCategory.slug),
    });
    if (existing) {
      categoryId = existing.id;
    } else {
      const [created] = await production
        .insert(categories)
        .values({
          name: sourceCategory.name,
          slug: sourceCategory.slug,
          description: sourceCategory.description,
          icon: sourceCategory.icon,
          displayOrder: sourceCategory.displayOrder,
        })
        .returning();
      categoryId = created.id;
    }
  }

  const { id: _id, createdAt: _createdAt, updatedAt: _updatedAt, ...rest } = row;
  const values = { ...rest, categoryId };

  const existing = await production.query.prompts.findFirst({
    where: eq(prompts.slug, row.slug),
  });

  if (existing) {
    await production
      .update(prompts)
      .set({ ...values, updatedAt: new Date() })
      .where(eq(prompts.id, existing.id));
    return { created: false };
  }

  await production.insert(prompts).values(values);
  return { created: true };
}

/**
 * For a batch of slugs, report each one's production status so the admin
 * list can show "Not in prod" / "In prod" / "Update available" per row.
 * Returns an empty map (nothing "in prod") if promotion isn't configured here.
 */
export async function getProductionStatusBySlug(
  slugs: string[]
): Promise<Map<string, { updatedAt: Date }>> {
  const map = new Map<string, { updatedAt: Date }>();
  if (!canPromoteToProduction() || slugs.length === 0) return map;

  const production = getProductionDb();
  const rows = await production.query.prompts.findMany({
    columns: { slug: true, updatedAt: true },
    where: inArray(prompts.slug, slugs),
  });
  for (const r of rows) map.set(r.slug, { updatedAt: r.updatedAt });
  return map;
}
