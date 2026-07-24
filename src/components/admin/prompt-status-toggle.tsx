'use client';

import { useState } from 'react';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { badgeVariants } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface PromptStatusToggleProps {
  id: string;
  initialIsPublished: boolean;
}

export function PromptStatusToggle({ id, initialIsPublished }: PromptStatusToggleProps) {
  const [isPublished, setIsPublished] = useState(initialIsPublished);
  const [loading, setLoading] = useState(false);

  async function toggle() {
    if (loading) return;
    const next = !isPublished;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/prompts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublished: next }),
      });
      const json = await res.json();
      if (json.success) {
        setIsPublished(next);
        toast.success(next ? 'Prompt published' : 'Prompt set to draft');
      } else {
        toast.error(json.error?.message ?? 'Failed to update status');
      }
    } catch {
      toast.error('Failed to update status');
    } finally {
      setLoading(false);
    }
  }

  const Icon = isPublished ? Eye : EyeOff;

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={loading}
      title={isPublished ? 'Click to unpublish' : 'Click to publish'}
      aria-pressed={isPublished}
      className={cn(
        badgeVariants({ variant: isPublished ? 'default' : 'secondary' }),
        'cursor-pointer hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60',
        isPublished && 'bg-green-600 text-white'
      )}
    >
      {loading ? (
        <Loader2 className="size-3 mr-1 animate-spin" />
      ) : (
        <Icon className="size-3 mr-1" />
      )}
      {isPublished ? 'Live' : 'Draft'}
    </button>
  );
}
