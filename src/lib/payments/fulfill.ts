import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { payments } from '@/lib/db/schema';
import type { Product } from '@/config/products';
import { getProductById } from '@/lib/products';
import {
  grantEntitlement,
  resolveCategoryId,
  type EntitlementScope,
} from '@/lib/access';

/**
 * The one job of both payment webhooks: translate a verified paid event into
 * a payment row + entitlement rows. Idempotent on providerPaymentId, and
 * grants themselves are idempotent (renewals extend expiry).
 */
export interface FulfillInput {
  provider: 'stripe' | 'razorpay';
  providerPaymentId: string;
  userId: string;
  productId: string;
  /** minor units (cents / paise) */
  amount: number;
  currency: string;
  /** subscription period end — grants expire then; renewals extend */
  periodEnd?: Date | null;
}

/**
 * Apply a product's grants to a user — shared by the payment webhooks and
 * manual admin plan grants. Each grant is idempotent.
 */
export async function applyProductGrants(
  userId: string,
  product: Product,
  source: 'purchase' | 'subscription' | 'admin_grant' | 'promo' | 'marketplace',
  opts: { paymentId?: string | null; periodEnd?: Date | null } = {}
) {
  for (const grant of product.grants) {
    let scopeId: string | null = grant.scopeRef ?? null;

    if (grant.scope === 'category' && grant.scopeRef) {
      scopeId = await resolveCategoryId(grant.scopeRef);
      if (!scopeId) {
        console.error(
          `applyProductGrants: category slug "${grant.scopeRef}" not found — skipping grant`
        );
        continue;
      }
    }

    const expiresAt =
      product.mode === 'subscription'
        ? (opts.periodEnd ?? null)
        : grant.durationDays
          ? new Date(Date.now() + grant.durationDays * 24 * 60 * 60 * 1000)
          : null;

    await grantEntitlement({
      userId,
      scope: grant.scope as EntitlementScope,
      scopeId,
      source,
      paymentId: opts.paymentId ?? null,
      expiresAt,
    });
  }
}

export async function fulfillPurchase(input: FulfillInput) {
  const product = await getProductById(input.productId);
  if (!product) {
    console.error(`fulfillPurchase: unknown product "${input.productId}"`);
    return { ok: false as const, reason: 'unknown_product' };
  }

  // Idempotency: same provider payment processed once
  const existing = await db()
    .select({ id: payments.id })
    .from(payments)
    .where(eq(payments.providerPaymentId, input.providerPaymentId))
    .limit(1);
  if (existing.length > 0) {
    return { ok: true as const, duplicate: true };
  }

  const [payment] = await db()
    .insert(payments)
    .values({
      userId: input.userId,
      provider: input.provider,
      providerPaymentId: input.providerPaymentId,
      amount: input.amount,
      currency: input.currency.toUpperCase(),
      status: 'succeeded',
    })
    .returning();

  await applyProductGrants(
    input.userId,
    product,
    product.mode === 'subscription' ? 'subscription' : 'purchase',
    { paymentId: payment.id, periodEnd: input.periodEnd }
  );

  return { ok: true as const, paymentId: payment.id };
}
