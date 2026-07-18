import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { requireAdmin } from '@/lib/auth/require-admin';
import { db } from '@/lib/db';
import { users, entitlements } from '@/lib/db/schema';
import {
  grantEntitlement,
  revokeEntitlement,
  resolveCategoryId,
  type EntitlementScope,
} from '@/lib/access';
import { getProductById } from '@/lib/products';
import { applyProductGrants } from '@/lib/payments/fulfill';

const SCOPES: EntitlementScope[] = ['all', 'category', 'template', 'course', 'feature'];

async function findUser(email: string) {
  const [user] = await db()
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, email))
    .limit(1);
  return user ?? null;
}

/** GET /api/admin/entitlements?email=… — list a user's entitlements */
export async function GET(request: Request) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  const email = new URL(request.url).searchParams.get('email');
  if (!email) {
    return NextResponse.json(
      { success: false, error: { code: 'BAD_REQUEST', message: 'email query param required' } },
      { status: 400 }
    );
  }
  const user = await findUser(email);
  if (!user) {
    return NextResponse.json(
      { success: false, error: { code: 'NOT_FOUND', message: 'User not found' } },
      { status: 404 }
    );
  }
  const rows = await db()
    .select()
    .from(entitlements)
    .where(eq(entitlements.userId, user.id));
  return NextResponse.json({ success: true, data: rows });
}

/**
 * POST /api/admin/entitlements
 * { email, productId }                                — grant a whole plan/product
 * { email, scope, scopeId?, categorySlug?, expiresAt? } — grant a single scope
 */
export async function POST(request: Request) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  try {
    const body = await request.json();
    const { email, productId, scope, scopeId, categorySlug, expiresAt } = body ?? {};

    if (!email || (!productId && !SCOPES.includes(scope))) {
      return NextResponse.json(
        { success: false, error: { code: 'BAD_REQUEST', message: 'email and productId or valid scope required' } },
        { status: 400 }
      );
    }
    const user = await findUser(email);
    if (!user) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'User not found' } },
        { status: 404 }
      );
    }

    // Plan grant: apply every entitlement the product would grant on purchase
    if (productId) {
      const product = await getProductById(productId);
      if (!product) {
        return NextResponse.json(
          { success: false, error: { code: 'NOT_FOUND', message: `Product "${productId}" not found` } },
          { status: 404 }
        );
      }
      await applyProductGrants(user.id, product, 'admin_grant');
      return NextResponse.json({
        success: true,
        data: { granted: product.grants.length, product: product.id },
      });
    }

    let resolvedScopeId: string | null = scopeId ?? null;
    if (scope === 'category' && categorySlug) {
      resolvedScopeId = await resolveCategoryId(categorySlug);
      if (!resolvedScopeId) {
        return NextResponse.json(
          { success: false, error: { code: 'NOT_FOUND', message: `Category "${categorySlug}" not found` } },
          { status: 404 }
        );
      }
    }
    if (scope !== 'all' && !resolvedScopeId) {
      return NextResponse.json(
        { success: false, error: { code: 'BAD_REQUEST', message: 'scopeId (or categorySlug) required for this scope' } },
        { status: 400 }
      );
    }

    const id = await grantEntitlement({
      userId: user.id,
      scope,
      scopeId: scope === 'all' ? null : resolvedScopeId,
      source: 'admin_grant',
      expiresAt: expiresAt ? new Date(expiresAt) : null,
    });

    return NextResponse.json({ success: true, data: { id } });
  } catch (error) {
    console.error('Grant entitlement error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'GRANT_FAILED', message: 'Failed to grant entitlement' } },
      { status: 500 }
    );
  }
}

/** DELETE /api/admin/entitlements { email, scope, scopeId? } — revoke */
export async function DELETE(request: Request) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  try {
    const body = await request.json();
    const { email, scope, scopeId } = body ?? {};
    if (!email || !SCOPES.includes(scope)) {
      return NextResponse.json(
        { success: false, error: { code: 'BAD_REQUEST', message: 'email and valid scope required' } },
        { status: 400 }
      );
    }
    const user = await findUser(email);
    if (!user) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'User not found' } },
        { status: 404 }
      );
    }

    const revoked = await revokeEntitlement(user.id, scope, scopeId ?? null);
    return NextResponse.json({ success: true, data: { revoked } });
  } catch (error) {
    console.error('Revoke entitlement error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'REVOKE_FAILED', message: 'Failed to revoke entitlement' } },
      { status: 500 }
    );
  }
}
