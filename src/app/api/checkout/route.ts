import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { getProductById } from '@/lib/products';
import { createProductCheckout } from '@/lib/payments/stripe';
import { createOrder } from '@/lib/payments/razorpay';
import { siteConfig } from '@/config/site';

/**
 * POST /api/checkout { productId, currency: 'USD' | 'INR' }
 *
 * USD → Stripe Checkout (returns redirect url).
 * INR → Razorpay order (returns order details for the client-side widget).
 * Fulfillment (payment row + entitlements) happens ONLY in the webhooks.
 */
export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Sign in to purchase' } },
        { status: 401 }
      );
    }

    const body = await request.json().catch(() => null);
    const productId = body?.productId as string | undefined;
    const currency = (body?.currency as string | undefined)?.toUpperCase() ?? 'USD';

    const product = productId ? await getProductById(productId) : null;
    if (!product) {
      return NextResponse.json(
        { success: false, error: { code: 'UNKNOWN_PRODUCT', message: 'Unknown product' } },
        { status: 400 }
      );
    }
    if (product.active === false) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_AVAILABLE', message: 'This product is not available yet' } },
        { status: 400 }
      );
    }

    if (currency === 'INR') {
      if (product.mode === 'subscription') {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'NOT_SUPPORTED',
              message: 'INR subscriptions are not available yet — use USD or a one-time purchase',
            },
          },
          { status: 400 }
        );
      }
      const order = await createOrder({
        amountPaise: product.priceInrPaise,
        notes: { userId: session.user.id, productId: product.id },
      });
      return NextResponse.json({
        success: true,
        data: {
          provider: 'razorpay',
          orderId: order.id,
          amount: product.priceInrPaise,
          currency: 'INR',
          keyId: process.env.RAZORPAY_KEY_ID,
        },
      });
    }

    const checkout = await createProductCheckout({
      product,
      userId: session.user.id,
      customerEmail: session.user.email ?? undefined,
      successUrl: `${siteConfig.appUrl}/upgrade?status=success`,
      cancelUrl: `${siteConfig.appUrl}/upgrade?status=cancelled`,
    });

    return NextResponse.json({
      success: true,
      data: { provider: 'stripe', url: checkout.url },
    });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'CHECKOUT_FAILED', message: 'Failed to start checkout' } },
      { status: 500 }
    );
  }
}
