import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyWebhookSignature } from '@/lib/payments/razorpay';
import { fulfillPurchase } from '@/lib/payments/fulfill';

interface RazorpayPaymentEntity {
  id: string;
  amount: number;
  currency: string;
  notes?: Record<string, string>;
}

interface RazorpaySubscriptionEntity {
  id: string;
  current_end?: number;
  notes?: Record<string, string>;
}

/**
 * Razorpay webhook — mirror of the Stripe one: verified paid events →
 * payment + entitlement rows via fulfillPurchase (idempotent).
 */
export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('x-razorpay-signature');

  if (!signature) {
    return NextResponse.json({ error: 'Missing signature header' }, { status: 400 });
  }
  if (!verifyWebhookSignature(body, signature)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  try {
    const event = JSON.parse(body);

    switch (event.event) {
      case 'payment.captured':
      case 'order.paid': {
        const payment: RazorpayPaymentEntity | undefined =
          event.payload?.payment?.entity;
        const order = event.payload?.order?.entity as
          | { notes?: Record<string, string> }
          | undefined;
        if (!payment) break;

        // notes carry userId/productId (set at order creation)
        const notes = { ...(order?.notes ?? {}), ...(payment.notes ?? {}) };
        const { userId, productId } = notes;
        if (!userId || !productId) {
          console.error('Razorpay payment without userId/productId notes', payment.id);
          break;
        }

        await fulfillPurchase({
          provider: 'razorpay',
          providerPaymentId: payment.id,
          userId,
          productId,
          amount: payment.amount,
          currency: payment.currency ?? 'INR',
        });
        break;
      }

      case 'subscription.charged': {
        const sub: RazorpaySubscriptionEntity | undefined =
          event.payload?.subscription?.entity;
        const payment: RazorpayPaymentEntity | undefined =
          event.payload?.payment?.entity;
        if (!sub || !payment) break;

        const { userId, productId } = sub.notes ?? {};
        if (!userId || !productId) break;

        await fulfillPurchase({
          provider: 'razorpay',
          providerPaymentId: payment.id,
          userId,
          productId,
          amount: payment.amount,
          currency: payment.currency ?? 'INR',
          periodEnd: sub.current_end ? new Date(sub.current_end * 1000) : null,
        });
        break;
      }

      case 'subscription.cancelled':
      case 'payment.failed':
        // Entitlements lapse at expiresAt when renewals stop — nothing to do
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Razorpay webhook error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
