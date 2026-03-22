import Razorpay from 'razorpay';
import crypto from 'crypto';

export function getRazorpayClient() {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new Error('Razorpay credentials are not configured');
  }
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
}

export async function createSubscription({
  planId,
  customerId,
}: {
  planId: string;
  customerId?: string;
}) {
  const razorpay = getRazorpayClient();
  return razorpay.subscriptions.create({
    plan_id: planId,
    total_count: 12,
    ...(customerId && { customer_notify: 1 }),
  } as Parameters<typeof razorpay.subscriptions.create>[0]);
}

export function verifyWebhookSignature(
  body: string,
  signature: string
): boolean {
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET!)
    .update(body)
    .digest('hex');

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}
