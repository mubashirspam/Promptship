import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import type Stripe from 'stripe';
import { constructWebhookEvent, getStripeClient } from '@/lib/payments/stripe';
import { fulfillPurchase } from '@/lib/payments/fulfill';

/**
 * Stripe webhook — one job: translate verified paid events into
 * payment + entitlement rows via fulfillPurchase (idempotent).
 */
export async function POST(request: NextRequest) {
  let event: Stripe.Event;
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');
    if (!signature) {
      return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 });
    }
    event = await constructWebhookEvent(body, signature);
  } catch (error) {
    console.error('Stripe webhook signature error:', error);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        const productId = session.metadata?.productId;
        if (!userId || !productId) {
          console.error('checkout.session.completed without userId/productId metadata', session.id);
          break;
        }

        let periodEnd: Date | null = null;
        if (session.mode === 'subscription' && session.subscription) {
          const subId =
            typeof session.subscription === 'string'
              ? session.subscription
              : session.subscription.id;
          periodEnd = await getSubscriptionPeriodEnd(subId);
        }

        await fulfillPurchase({
          provider: 'stripe',
          providerPaymentId:
            (typeof session.payment_intent === 'string'
              ? session.payment_intent
              : session.payment_intent?.id) ?? session.id,
          userId,
          productId,
          amount: session.amount_total ?? 0,
          currency: session.currency ?? 'usd',
          periodEnd,
        });
        break;
      }

      case 'invoice.payment_succeeded': {
        // Subscription renewals: metadata lives on the subscription
        const invoice = event.data.object as Stripe.Invoice;
        const subId = getInvoiceSubscriptionId(invoice);
        if (!subId) break;

        const stripe = getStripeClient();
        const sub = await stripe.subscriptions.retrieve(subId);
        const userId = sub.metadata?.userId;
        const productId = sub.metadata?.productId;
        if (!userId || !productId) break;

        await fulfillPurchase({
          provider: 'stripe',
          providerPaymentId: invoice.id ?? `invoice-${subId}-${invoice.created}`,
          userId,
          productId,
          amount: invoice.amount_paid ?? 0,
          currency: invoice.currency ?? 'usd',
          periodEnd: await getSubscriptionPeriodEnd(subId),
        });
        break;
      }

      case 'customer.subscription.deleted':
      case 'invoice.payment_failed':
        // No revocation needed: subscription entitlements simply lapse at
        // their stored expiresAt when renewals stop extending it.
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Stripe webhook error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}

async function getSubscriptionPeriodEnd(subId: string): Promise<Date | null> {
  try {
    const stripe = getStripeClient();
    const sub = await stripe.subscriptions.retrieve(subId);
    // current_period_end moved between API versions — check both shapes
    const raw =
      (sub as unknown as { current_period_end?: number }).current_period_end ??
      (sub.items?.data?.[0] as unknown as { current_period_end?: number })
        ?.current_period_end;
    return raw ? new Date(raw * 1000) : null;
  } catch (error) {
    console.error('Failed to read subscription period end:', error);
    return null;
  }
}

function getInvoiceSubscriptionId(invoice: Stripe.Invoice): string | null {
  // Field location differs across Stripe API versions
  const legacy = (invoice as unknown as { subscription?: string | { id: string } })
    .subscription;
  if (legacy) return typeof legacy === 'string' ? legacy : legacy.id;
  const parent = (
    invoice as unknown as {
      parent?: { subscription_details?: { subscription?: string | { id: string } } };
    }
  ).parent?.subscription_details?.subscription;
  if (parent) return typeof parent === 'string' ? parent : parent.id;
  return null;
}
