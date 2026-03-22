import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyWebhookSignature } from '@/lib/payments/razorpay';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('x-razorpay-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing signature header' },
        { status: 400 }
      );
    }

    const isValid = verifyWebhookSignature(body, signature);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    const event = JSON.parse(body);

    switch (event.event) {
      case 'subscription.activated':
        // TODO: Activate subscription, update user tier
        break;
      case 'subscription.charged':
        // TODO: Record payment, reset credits
        break;
      case 'subscription.cancelled':
        // TODO: Downgrade user to free tier
        break;
      case 'payment.failed':
        // TODO: Update subscription status
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Razorpay webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
