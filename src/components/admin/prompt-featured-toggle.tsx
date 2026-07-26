'use client';

import { useState } from 'react';
import { Star, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { badgeVariants } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface PromptFeaturedToggleProps {
  id: string;
  initialIsFeatured: boolean;
}

/**
 * Featured controls which templates the homepage showcase surfaces first
 * (see /api/marketing/templates) — this is the on/off switch for that.
 */
export function PromptFeaturedToggle({ id, initialIsFeatured }: PromptFeaturedToggleProps) {
  const [isFeatured, setIsFeatured] = useState(initialIsFeatured);
  const [loading, setLoading] = useState(false);

  async function toggle() {
    if (loading) return;
    const next = !isFeatured;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/prompts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isFeatured: next }),
      });
      const json = await res.json();
      if (json.success) {
        setIsFeatured(next);
        toast.success(next ? 'Featured on homepage' : 'Removed from featured');
      } else {
        toast.error(json.error?.message ?? 'Failed to update');
      }
    } catch {
      toast.error('Failed to update');
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={loading}
      title={isFeatured ? 'Click to unfeature' : 'Click to feature on homepage'}
      aria-pressed={isFeatured}
      className={cn(
        badgeVariants({ variant: isFeatured ? 'default' : 'secondary' }),
        'cursor-pointer hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60',
        isFeatured && 'bg-yellow-500 text-white hover:bg-yellow-500'
      )}
    >
      {loading ? (
        <Loader2 className="size-3 mr-1 animate-spin" />
      ) : (
        <Star className={cn('size-3 mr-1', isFeatured && 'fill-white')} />
      )}
      {isFeatured ? 'Featured' : 'Feature'}
    </button>
  );
}
