import { matchesEntitlement, getEntitlements, type EntitlementRow } from './index';
import { PLAN_LIMITS, type Plan } from '@/lib/utils/constants';

/**
 * Plans are never stored — they are derived from the entitlement rows a user
 * owns. Bundles grant template-kind feature entitlements; owning the right
 * combination promotes the badge.
 */
const FEATURE_FIGMA = 'templates:figma';
const FEATURE_AI_PROMPT = 'templates:ai_prompt';
const FEATURE_CODE = 'templates:code';

function hasFeature(rows: EntitlementRow[], key: string): boolean {
  return matchesEntitlement(rows, [{ scope: 'feature', scopeId: key }]);
}

/** Compute the plan badge from a user's entitlement rows. */
export function derivePlan(rows: EntitlementRow[]): Plan {
  const all = matchesEntitlement(rows, [{ scope: 'all' }]);
  const figma = all || hasFeature(rows, FEATURE_FIGMA);
  const aiPrompt = all || hasFeature(rows, FEATURE_AI_PROMPT);
  const code = all || hasFeature(rows, FEATURE_CODE);

  if (all || (figma && aiPrompt && code)) return 'premium';
  if (figma && aiPrompt) return 'pro';
  if (figma) return 'basic';
  return 'free';
}

/** Fetch entitlements and compute the plan for a user. */
export async function getUserPlan(userId: string): Promise<Plan> {
  return derivePlan(await getEntitlements(userId));
}

/** Monthly prompt-copy limit for a plan (Infinity = unlimited). */
export function planCopyLimit(plan: Plan): number {
  return PLAN_LIMITS[plan].promptCopies;
}
