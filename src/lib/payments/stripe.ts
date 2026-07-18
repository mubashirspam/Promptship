import Stripe from 'stripe';

export function getStripeClient() {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('Stripe secret key is not configured');
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2026-02-25.clover',
    typescript: true,
  });
}

export async function createCheckoutSession({
  priceId,
  customerId,
  successUrl,
  cancelUrl,
}: {
  priceId: string;
  customerId?: string;
  successUrl: string;
  cancelUrl: string;
}) {
  const stripe = getStripeClient();
  return stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [{ price: priceId, quantity: 1 }],
    customer: customerId,
    success_url: successUrl,
    cancel_url: cancelUrl,
  });
}

/**
 * Product-based checkout with inline price_data — no pre-created Stripe
 * prices needed while plans are still in flux. metadata carries
 * userId/productId to the webhook, which grants the entitlements.
 */
export async function createProductCheckout({
  product,
  userId,
  successUrl,
  cancelUrl,
  customerEmail,
}: {
  product: {
    id: string;
    name: string;
    mode: 'payment' | 'subscription';
    interval?: 'month' | 'year';
    priceUsdCents: number;
  };
  userId: string;
  successUrl: string;
  cancelUrl: string;
  customerEmail?: string;
}) {
  const stripe = getStripeClient();
  const metadata = { userId, productId: product.id };
  return stripe.checkout.sessions.create({
    mode: product.mode,
    payment_method_types: ['card'],
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: 'usd',
          unit_amount: product.priceUsdCents,
          product_data: { name: product.name },
          ...(product.mode === 'subscription' && {
            recurring: { interval: product.interval ?? 'month' },
          }),
        },
      },
    ],
    customer_email: customerEmail,
    metadata,
    ...(product.mode === 'subscription' && {
      subscription_data: { metadata },
    }),
    success_url: successUrl,
    cancel_url: cancelUrl,
  });
}

export async function createCustomerPortalSession({
  customerId,
  returnUrl,
}: {
  customerId: string;
  returnUrl: string;
}) {
  const stripe = getStripeClient();
  return stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });
}

export async function constructWebhookEvent(
  payload: string | Buffer,
  signature: string
) {
  const stripe = getStripeClient();
  return stripe.webhooks.constructEvent(
    payload,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET!
  );
}
