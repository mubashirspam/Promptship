export const APP_NAME = 'Promtify';
export const APP_DESCRIPTION = 'Ship beautiful UIs with AI - curated prompts, one-click generation, and education.';
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://promtify.dev';

export const FRAMEWORKS = [
  'react',
  'nextjs',
  'vue',
  'html',
  'flutter',
  'react-native',
  'kotlin',
  'java',
  'swift',
] as const;
export type Framework = (typeof FRAMEWORKS)[number];

export const FRAMEWORK_META: Record<
  Framework,
  { label: string; color: string; platform: 'web' | 'mobile' | 'universal' }
> = {
  react: { label: 'React', color: '#61DAFB', platform: 'web' },
  nextjs: { label: 'Next.js', color: '#888888', platform: 'web' },
  vue: { label: 'Vue', color: '#4FC08D', platform: 'web' },
  html: { label: 'HTML/CSS', color: '#E34F26', platform: 'web' },
  flutter: { label: 'Flutter', color: '#02569B', platform: 'universal' },
  'react-native': { label: 'React Native', color: '#61DAFB', platform: 'mobile' },
  kotlin: { label: 'Kotlin', color: '#7F52FF', platform: 'mobile' },
  java: { label: 'Java (Android)', color: '#E76F00', platform: 'mobile' },
  swift: { label: 'Swift (iOS)', color: '#F05138', platform: 'mobile' },
};

export const PLATFORMS = ['web', 'mobile', 'universal'] as const;
export type Platform = (typeof PLATFORMS)[number];

export const PLATFORM_LABELS: Record<Platform, string> = {
  web: 'Web',
  mobile: 'Mobile App',
  universal: 'Web + Mobile',
};

/**
 * User plans are computed from entitlements (not stored on the user).
 *   free    → no purchases
 *   basic   → Figma templates bundle
 *   pro     → Figma + AI prompt bundle
 *   premium → everything (code + Figma + AI prompts) / all-access
 */
export const PLANS = ['free', 'basic', 'pro', 'premium'] as const;
export type Plan = (typeof PLANS)[number];

export const PLAN_LABELS: Record<Plan, string> = {
  free: 'Free Plan',
  basic: 'Basic Plan',
  pro: 'Pro Plan',
  premium: 'Premium Plan',
};

export const PLAN_COLORS: Record<Plan, string> = {
  free: 'text-muted-foreground',
  basic: 'text-cyan-500',
  pro: 'text-purple-500',
  premium: 'text-amber-500',
};

/** Lucide icon name per plan — resolved in client components. */
export const PLAN_ICONS: Record<Plan, string> = {
  free: 'Sparkle',
  basic: 'Sparkles',
  pro: 'Zap',
  premium: 'Crown',
};

export const PLAN_LIMITS: Record<Plan, { promptCopies: number }> = {
  free: { promptCopies: 5 },
  basic: { promptCopies: 50 },
  pro: { promptCopies: Infinity },
  premium: { promptCopies: Infinity },
};

export const PLAN_CREDITS: Record<Plan, number> = {
  free: 5,
  basic: 50,
  pro: 100,
  premium: 500,
};

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

