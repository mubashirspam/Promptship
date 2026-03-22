export const APP_NAME = 'PromptShip';
export const APP_DESCRIPTION = 'Ship beautiful UIs with AI - curated prompts, one-click generation, and education.';
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://promptship.dev';

export const FRAMEWORKS = ['react', 'flutter', 'html', 'vue'] as const;
export type Framework = (typeof FRAMEWORKS)[number];

export const TIERS = ['free', 'starter', 'pro', 'team'] as const;
export type Tier = (typeof TIERS)[number];

export const TIER_LIMITS = {
  free: {
    promptCopies: 5,
    generations: 0,
    courseAccess: false,
  },
  starter: {
    promptCopies: 50,
    generations: 0,
    courseAccess: false,
  },
  pro: {
    promptCopies: Infinity,
    generations: 100,
    courseAccess: true,
  },
  team: {
    promptCopies: Infinity,
    generations: 500,
    courseAccess: true,
  },
} as const;

export const STYLES = [
  'minimal',
  'glassmorphism',
  'gradient',
  'bold',
  'neumorphism',
] as const;
export type Style = (typeof STYLES)[number];

export const ANIMATION_LEVELS = ['none', 'subtle', 'dynamic'] as const;
export type AnimationLevel = (typeof ANIMATION_LEVELS)[number];

/** Check if a user tier meets the required minimum tier. */
export function hasTierAccess(userTier: Tier, requiredTier: Tier | 'all'): boolean {
  if (requiredTier === 'all') return true;
  const order = TIERS.indexOf(userTier);
  const required = TIERS.indexOf(requiredTier);
  return order >= required;
}

export const TIER_CREDITS: Record<Tier, number> = {
  free: 5,
  starter: 50,
  pro: 100,
  team: 500,
};

export const TIER_LABELS: Record<Tier, string> = {
  free: 'Free Plan',
  starter: 'Starter Plan',
  pro: 'Pro Plan',
  team: 'Team Plan',
};

export const TIER_COLORS: Record<Tier, string> = {
  free: 'text-muted-foreground',
  starter: 'text-cyan-500',
  pro: 'text-purple-500',
  team: 'text-pink-500',
};
