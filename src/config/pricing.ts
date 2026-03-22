export const pricingPlans = {
  starter: {
    name: 'Starter',
    description: 'Perfect for trying out PromptShip',
    priceINR: 499,
    priceUSD: 9,
    isOneTime: true,
    features: [
      '50 premium prompts',
      'All frameworks (React, Flutter, HTML)',
      'Lifetime updates',
      'Community Discord access',
    ],
    limits: {
      promptCopies: 50,
      generations: 0,
    },
  },
  pro: {
    name: 'Pro',
    description: 'For serious developers',
    priceINR: {
      monthly: 999,
      yearly: 4999,
    },
    priceUSD: {
      monthly: 15,
      yearly: 99,
    },
    isOneTime: false,
    popular: true,
    features: [
      'Unlimited prompts',
      '100 AI generations/month',
      'Full course access',
      'Priority support',
      'New prompts weekly',
    ],
    limits: {
      promptCopies: Infinity,
      generations: 100,
    },
  },
  team: {
    name: 'Team',
    description: 'For agencies and teams',
    priceINR: {
      monthly: 2999,
    },
    priceUSD: {
      monthly: 49,
    },
    isOneTime: false,
    features: [
      'Everything in Pro',
      '5 team seats',
      '500 AI generations/month',
      'API access',
      'Custom branding',
      'Dedicated support',
    ],
    limits: {
      promptCopies: Infinity,
      generations: 500,
      seats: 5,
    },
  },
};

export type PlanKey = keyof typeof pricingPlans;
