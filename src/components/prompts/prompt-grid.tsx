'use client';

import { Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { PromptCard, type Prompt } from './prompt-card';

interface PromptGridProps {
  prompts: Prompt[];
  isLoading?: boolean;
  onSelect?: (prompt: Prompt) => void;
  onGenerate?: (prompt: Prompt) => void;
  onFavorite?: (prompt: Prompt) => void;
  favoritedIds?: Set<string>;
  className?: string;
}

function PromptCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl ring-1 ring-foreground/10">
      <div className="aspect-[16/10] w-full animate-pulse bg-muted" />
      <div className="flex flex-col gap-2 p-4">
        <div className="h-5 w-3/4 animate-pulse rounded bg-muted" />
        <div className="flex gap-1.5">
          <div className="h-5 w-16 animate-pulse rounded-full bg-muted" />
          <div className="size-2.5 animate-pulse rounded-full bg-muted" />
          <div className="size-2.5 animate-pulse rounded-full bg-muted" />
        </div>
        <div className="h-4 w-full animate-pulse rounded bg-muted" />
        <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
      </div>
      <div className="flex gap-2 border-t p-4">
        <div className="h-7 flex-1 animate-pulse rounded-lg bg-muted" />
        <div className="size-7 animate-pulse rounded-lg bg-muted" />
      </div>
    </div>
  );
}

export function PromptGrid({
  prompts,
  isLoading = false,
  onSelect,
  onGenerate,
  onFavorite,
  favoritedIds = new Set(),
  className,
}: PromptGridProps) {
  if (isLoading) {
    return (
      <div
        className={cn(
          'grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3',
          className
        )}
      >
        {Array.from({ length: 3 }).map((_, i) => (
          <PromptCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (prompts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-muted">
          <Sparkles className="size-6 text-muted-foreground" />
        </div>
        <p className="text-lg font-medium">No prompts found</p>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
          Try adjusting your search or filters to find what you&apos;re looking
          for.
        </p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3',
        className
      )}
    >
      {prompts.map((prompt) => (
        <PromptCard
          key={prompt.id}
          prompt={prompt}
          onSelect={onSelect}
          onGenerate={onGenerate}
          onFavorite={onFavorite}
          isFavorited={favoritedIds.has(prompt.id)}
        />
      ))}
    </div>
  );
}
