'use client';

import { useAuth } from './use-auth';

export function useCredits() {
  const { user } = useAuth();

  return {
    credits: (user as Record<string, unknown>)?.credits as number ?? 0,
    tier: (user as Record<string, unknown>)?.tier as string ?? 'free',
    hasCredits: ((user as Record<string, unknown>)?.credits as number ?? 0) > 0,
  };
}
