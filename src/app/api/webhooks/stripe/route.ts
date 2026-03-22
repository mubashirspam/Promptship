import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { constructWebhookEvent } from '@/lib/payments/stripe';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing stripe-signature header' },
        { status: 400 }
      );
    }

    const event = await constructWebhookEvent(body, signature);

    switch (event.type) {
      case 'checkout.session.completed':
        // TODO: Activate subscription, update user tier
        break;
      case 'customer.subscription.updated':
        // TODO: Update subscription status
        break;
      case 'customer.subscription.deleted':
        // TODO: Downgrade user to free tier
        break;
      case 'invoice.payment_succeeded':
        // TODO: Record payment, reset credits
        break;
      case 'invoice.payment_failed':
        // TODO: Update subscription status to past_due
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Stripe webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
