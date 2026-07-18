'use client';

import { useEffect, useState } from 'react';
import type { Plan } from '@/lib/utils/constants';
import { useAuth } from './use-auth';

interface CreditsState {
  credits: number;
  plan: Plan;
  total: number;
}

/**
 * Credits + plan come from the entitlement-backed `/api/user/credits`
 * endpoint — the plan is derived from what the user owns, never stored.
 */
export function useCredits() {
  const { user } = useAuth();
  const [state, setState] = useState<CreditsState>({
    credits: 0,
    plan: 'free',
    total: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    let active = true;
    fetch('/api/user/credits')
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (active && json?.success) setState(json.data);
      })
      .catch(() => {})
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [user]);

  return {
    credits: state.credits,
    plan: state.plan,
    total: state.total,
    hasCredits: state.credits > 0,
    loading,
  };
}
