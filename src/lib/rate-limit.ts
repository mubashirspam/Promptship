import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

/**
 * Upstash sliding-window rate limiter. Disabled gracefully when the Upstash
 * env vars are missing or still placeholders (local dev) — routes stay
 * functional, production gets real limits once the vars are set.
 */

function upstashConfigured() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  return Boolean(url?.startsWith('https://') && token && !token.startsWith('your_'));
}

const limiters = new Map<string, Ratelimit>();

function getLimiter(name: string, limit: number, windowSec: number) {
  const key = `${name}:${limit}:${windowSec}`;
  let limiter = limiters.get(key);
  if (!limiter) {
    limiter = new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(limit, `${windowSec} s`),
      prefix: `ratelimit:${name}`,
    });
    limiters.set(key, limiter);
  }
  return limiter;
}

export interface RateLimitResult {
  success: boolean;
  remaining: number;
}

export async function checkRateLimit(
  name: string,
  identifier: string,
  { limit, windowSec }: { limit: number; windowSec: number }
): Promise<RateLimitResult> {
  if (!upstashConfigured()) {
    return { success: true, remaining: limit };
  }
  try {
    const res = await getLimiter(name, limit, windowSec).limit(identifier);
    return { success: res.success, remaining: res.remaining };
  } catch (error) {
    // Redis outage must not take the product down — fail open, log loudly
    console.error('Rate limit check failed (failing open):', error);
    return { success: true, remaining: 0 };
  }
}
