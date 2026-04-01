# Payments Module Context

## Purpose
Dual payment provider integration (Stripe + Razorpay) for subscriptions and one-time purchases.

## Dependencies
- `stripe` - Stripe SDK
- `razorpay` - Razorpay SDK
- `@/lib/db/schema` - Subscriptions, payments tables
- `@/lib/validations/payments` - Payment validation schemas

## Key Constraints

### Provider Selection
```typescript
// Determine provider based on user location or preference
function getPaymentProvider(countryCode: string): 'stripe' | 'razorpay' {
  return countryCode === 'IN' ? 'razorpay' : 'stripe';
}
```

### Webhook Security
```typescript
// ALWAYS verify webhook signatures
import { stripe } from '@/lib/payments/stripe';

const signature = headers.get('stripe-signature');
const event = stripe.webhooks.constructEvent(
  body,
  signature,
  process.env.STRIPE_WEBHOOK_SECRET!
);
```

### Idempotency
```typescript
// ALWAYS use idempotency keys for payment operations
await stripe.paymentIntents.create({
  amount: 1000,
  currency: 'usd',
}, {
  idempotencyKey: `payment_${userId}_${timestamp}`,
});
```

## Webhook Handlers

### Location
- `app/api/webhooks/stripe/route.ts`
- `app/api/webhooks/razorpay/route.ts`

### Pattern
```typescript
export async function POST(req: Request) {
  try {
    // 1. Verify signature
    const event = verifyWebhook(req);
    
    // 2. Handle event type
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentSuccess(event.data);
        break;
      case 'customer.subscription.updated':
        await handleSubscriptionUpdate(event.data);
        break;
    }
    
    // 3. Return 200 (acknowledge receipt)
    return new Response('OK', { status: 200 });
  } catch (error) {
    // 4. Log error, return 400
    console.error('Webhook error:', error);
    return new Response('Webhook error', { status: 400 });
  }
}
```

## Database Updates

### Subscription Events
```typescript
// ALWAYS update both subscription and user tier
await db.transaction(async (tx) => {
  await tx.update(subscriptions)
    .set({ status: 'active' })
    .where(eq(subscriptions.id, subscriptionId));
    
  await tx.update(users)
    .set({ tier: 'pro' })
    .where(eq(users.id, userId));
});
```

### Audit Trail
```typescript
// ALWAYS log payment events
await db.insert(paymentLogs).values({
  userId,
  provider: 'stripe',
  event: 'payment.succeeded',
  amount: 2999,
  metadata: event.data,
});
```

## Error Handling

### Payment Failures
- Retry logic for transient failures
- Clear error messages for user
- Email notification on failure

### Webhook Failures
- Return 200 even if processing fails (to prevent retries)
- Log failures for manual review
- Implement dead letter queue for critical events

## Security

1. **API Keys**
   - NEVER expose secret keys to client
   - USE publishable keys only in frontend
   - ROTATE keys periodically

2. **Amount Validation**
   - ALWAYS validate amounts server-side
   - NEVER trust client-provided amounts
   - USE smallest currency unit (cents, paise)

3. **User Verification**
   - ALWAYS verify user owns the payment
   - CHECK session before creating payment intent
   - VALIDATE user tier matches subscription

## Testing

### Test Mode
```typescript
// Use test keys in development
const stripeKey = process.env.NODE_ENV === 'production'
  ? process.env.STRIPE_SECRET_KEY
  : process.env.STRIPE_TEST_SECRET_KEY;
```

### Webhook Testing
- Use Stripe CLI for local webhook testing
- Test all event types before production
- Verify idempotency works correctly
