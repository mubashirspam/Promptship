/**
 * Marketing display config for the pricing page. The `productId` on each plan
 * points at the sellable SKU in config/products.ts — prices shown here must
 * match those (products.ts is the source of truth for what's charged).
 *
 * All plans are one-time lifetime purchases. Courses are a separate add-on.
 * AI generation & marketplace launch in a later phase.
 */

export const pricingPlans = {
  basic: {
    name: 'Basic',
    description: 'Every Figma Kit. Pay once, own it forever.',
    priceINR: 999,
    priceUSD: 9,
    anchorUSD: 19,
    anchorINR: 1999,
    isOneTime: true,
    productId: 'basic',
    ctaLabel: 'Get Basic',
    features: [
      'All Figma Kits — lifetime access',
      'Full websites, app kits & components',
      'New Figma Kits added every week',
      'Commercial license included',
      'Lifetime updates — zero renewals',
      'Instant access after checkout',
    ],
  },
  pro: {
    name: 'Pro',
    description: 'Figma Kits + AI Prompts for shipping fast.',
    priceINR: 1599,
    priceUSD: 16,
    anchorUSD: 39,
    anchorINR: 3499,
    isOneTime: true,
    popular: true,
    productId: 'pro',
    ctaLabel: 'Get Pro',
    features: [
      'Everything in Basic',
      'All AI Prompts — lifetime access',
      'Copy-paste prompts for Claude, Cursor & v0',
      'Web & mobile — React, Flutter, Vue, HTML',
      'Private community Discord',
      'Markdown prompts with one-click copy',
    ],
  },
  premium: {
    name: 'Premium',
    description: 'The full library: Code Starters, Figma Kits and AI Prompts.',
    priceINR: 1999,
    priceUSD: 19,
    anchorUSD: 49,
    anchorINR: 4999,
    isOneTime: true,
    bestValue: true,
    productId: 'premium',
    ctaLabel: 'Get Premium',
    features: [
      'Everything in Pro',
      'All Code Starters — full source, download & ship',
      'All 9 frameworks — React, Next.js, Flutter, Swift…',
      'Full websites & single components',
      'First access to every new template kind',
      'Priority support',
    ],
  },
};

/** Separate add-on, shown under the plan grid. */
export const coursesAddon = {
  name: 'Video courses add-on',
  priceUSD: 7,
  priceINR: 599,
  productId: 'courses-addon',
  description: 'Full video course library — one-time add-on to any plan.',
};

export type PlanKey = keyof typeof pricingPlans;
