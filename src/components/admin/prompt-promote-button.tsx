'use client';

import { useState } from 'react';
import { Rocket, CheckCircle2, RefreshCw, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

type Status = 'not-promoted' | 'in-sync' | 'outdated';

interface PromptPromoteButtonProps {
  id: string;
  initialStatus: Status;
}

/**
 * One-click "push this template to production" — for testing everything in
 * staging first, then copying only the templates you're happy with. Upserts
 * by slug on the server, so it's safe to click again after further edits.
 */
export function PromptPromoteButton({ id, initialStatus }: PromptPromoteButtonProps) {
  const [status, setStatus] = useState<Status>(initialStatus);
  const [loading, setLoading] = useState(false);

  async function promote() {
    if (loading) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/prompts/${id}/promote`, { method: 'POST' });
      const json = await res.json();
      if (json.success) {
        setStatus('in-sync');
        toast.success(
          json.data.created ? 'Pushed to production' : 'Updated in production'
        );
      } else {
        toast.error(json.error?.message ?? 'Failed to push to production');
      }
    } catch {
      toast.error('Failed to push to production');
    } finally {
      setLoading(false);
    }
  }

  if (status === 'in-sync') {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={promote}
        disabled={loading}
        title="Already in production — click to re-push"
        className="text-green-600 hover:text-green-700"
      >
        {loading ? (
          <Loader2 className="size-3.5 animate-spin" />
        ) : (
          <CheckCircle2 className="size-3.5" />
        )}
        In prod
      </Button>
    );
  }

  if (status === 'outdated') {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={promote}
        disabled={loading}
        title="Staged version has changes not yet pushed"
        className="border-amber-500/50 text-amber-600 hover:bg-amber-500/10"
      >
        {loading ? (
          <Loader2 className="size-3.5 animate-spin" />
        ) : (
          <RefreshCw className="size-3.5" />
        )}
        Update prod
      </Button>
    );
  }

  return (
    <Button variant="outline" size="sm" onClick={promote} disabled={loading}>
      {loading ? (
        <Loader2 className="size-3.5 animate-spin" />
      ) : (
        <Rocket className="size-3.5" />
      )}
      Push to prod
    </Button>
  );
}
