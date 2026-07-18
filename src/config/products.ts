/**
 * Sellable SKUs. A product is only packaging: it maps a price to the
 * entitlement rows granted on purchase (lib/payments/fulfill.ts does the
 * granting via the payment webhooks). Changing prices/bundles here never
 * touches access logic.
 *
 * PLAN STRUCTURE (all lifetime one-time purchases):
 *   Basic    → Figma templates only
 *   Pro      → Figma + AI prompt templates
 *   Premium  → everything: code + Figma + AI prompt templates
 *   Courses  → separate add-on
 *   AI generation & marketplace → next launch phase (inactive)
 *
 * PRICES besides the $7 courses add-on are PLACEHOLDERS — confirm before
 * launch. Template-kind grants use feature keys `templates:<asset_kind>`.
 */

export interface ProductGrant {
  scope: 'all' | 'category' | 'template' | 'course' | 'feature';
  /** feature key / category slug / template id / module id */
  scopeRef?: string;
  /** undefined = lifetime; subscriptions instead expire at period end */
  durationDays?: number;
}

export interface Product {
  id: string;
  name: string;
  mode: 'payment' | 'subscription';
  interval?: 'month' | 'year';
  /** USD cents (Stripe) */
  priceUsdCents: number;
  /** INR paise (Razorpay) */
  priceInrPaise: number;
  grants: ProductGrant[];
  /** false = defined but not purchasable yet (future launch phase) */
  active?: boolean;
}

// Plan grants expire 12 months after purchase (assets already obtained stay
// with the buyer — see Terms). Re-purchasing extends the expiry.
const PLAN_DURATION_DAYS = 365;
const FIGMA = { scope: 'feature', scopeRef: 'templates:figma', durationDays: PLAN_DURATION_DAYS } as const;
const AI_PROMPTS = { scope: 'feature', scopeRef: 'templates:ai_prompt', durationDays: PLAN_DURATION_DAYS } as const;
const CODE = { scope: 'feature', scopeRef: 'templates:code', durationDays: PLAN_DURATION_DAYS } as const;

export const products: Record<string, Product> = {
  basic: {
    id: 'basic',
    name: 'Basic — Figma templates, lifetime',
    mode: 'payment',
    priceUsdCents: 1900, // PLACEHOLDER
    priceInrPaise: 149900, // PLACEHOLDER
    grants: [FIGMA],
  },
  pro: {
    id: 'pro',
    name: 'Pro — Figma + AI prompt templates, lifetime',
    mode: 'payment',
    priceUsdCents: 2900, // PLACEHOLDER
    priceInrPaise: 249900, // PLACEHOLDER
    grants: [FIGMA, AI_PROMPTS],
  },
  premium: {
    id: 'premium',
    name: 'Premium — code + Figma + AI prompt templates, lifetime',
    mode: 'payment',
    priceUsdCents: 4900, // PLACEHOLDER
    priceInrPaise: 399900, // PLACEHOLDER
    grants: [FIGMA, AI_PROMPTS, CODE],
  },
  'courses-addon': {
    id: 'courses-addon',
    name: 'Video courses add-on',
    mode: 'payment',
    priceUsdCents: 700, // $7
    priceInrPaise: 59900, // PLACEHOLDER
    grants: [{ scope: 'feature', scopeRef: 'courses' }],
  },
  // ─── Next launch phase — defined but not purchasable ───
  'ai-generate-monthly': {
    id: 'ai-generate-monthly',
    name: 'AI Generator add-on — monthly',
    mode: 'subscription',
    interval: 'month',
    priceUsdCents: 900,
    priceInrPaise: 49900,
    grants: [{ scope: 'feature', scopeRef: 'ai_generate' }],
    active: false,
  },
};

/** Single-template purchase price: $3 / ₹299. */
export const SINGLE_TEMPLATE_PRICE = {
  priceUsdCents: 300,
  priceInrPaise: 29900,
};

/** Single course-module purchase price. */
export const SINGLE_COURSE_PRICE = {
  priceUsdCents: 700,
  priceInrPaise: 59900,
};

const TEMPLATE_PRODUCT_PREFIX = 'template:';
const COURSE_PRODUCT_PREFIX = 'course:';

/**
 * Resolve a product id — static SKU or dynamic `template:<promptId>` /
 * `course:<moduleId>` for single-item purchases.
 */
export function getProduct(id: string): Product | null {
  if (id.startsWith(TEMPLATE_PRODUCT_PREFIX)) {
    const templateId = id.slice(TEMPLATE_PRODUCT_PREFIX.length);
    if (!templateId) return null;
    return {
      id,
      name: 'Template purchase',
      mode: 'payment',
      ...SINGLE_TEMPLATE_PRICE,
      grants: [{ scope: 'template', scopeRef: templateId }],
    };
  }
  if (id.startsWith(COURSE_PRODUCT_PREFIX)) {
    const moduleId = id.slice(COURSE_PRODUCT_PREFIX.length);
    if (!moduleId) return null;
    return {
      id,
      name: 'Course purchase',
      mode: 'payment',
      ...SINGLE_COURSE_PRICE,
      grants: [{ scope: 'course', scopeRef: moduleId }],
    };
  }
  return products[id] ?? null;
}

export function templateProductId(templateId: string) {
  return `${TEMPLATE_PRODUCT_PREFIX}${templateId}`;
}
