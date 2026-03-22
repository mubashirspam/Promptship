'use client';

import { cn } from '@/lib/utils';
import { ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';

interface Generation {
  id: string;
  title: string;
  createdAt: string;
  gradientFrom: string;
  gradientTo: string;
}

const mockGenerations: Generation[] = [
  {
    id: '1',
    title: 'Hero Section with CTA',
    createdAt: '2 hours ago',
    gradientFrom: 'from-purple-500',
    gradientTo: 'to-blue-500',
  },
  {
    id: '2',
    title: 'Pricing Table Component',
    createdAt: '5 hours ago',
    gradientFrom: 'from-cyan-500',
    gradientTo: 'to-teal-500',
  },
  {
    id: '3',
    title: 'Dashboard Sidebar Nav',
    createdAt: 'Yesterday',
    gradientFrom: 'from-orange-500',
    gradientTo: 'to-pink-500',
  },
];

interface RecentGenerationsProps {
  generations?: Generation[];
  className?: string;
}

export function RecentGenerations({
  generations = mockGenerations,
  className,
}: RecentGenerationsProps) {
  return (
    <div className={cn('space-y-4', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-foreground">
          Recent Generations
        </h2>
        <Link
          href="/history"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          View All
          <ArrowRight className="size-3.5" />
        </Link>
      </div>

      {/* Content */}
      {generations.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/50 p-10 text-center">
          <Sparkles className="mb-3 size-8 text-muted-foreground/50" />
          <p className="text-sm text-muted-foreground">
            No generations yet. Start creating!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {generations.map((gen) => (
            <Link key={gen.id} href="/history" className="group">
              <div className="overflow-hidden rounded-xl border border-border bg-card transition-colors hover:border-primary">
                {/* Gradient preview area */}
                <div
                  className={cn(
                    'flex h-28 items-center justify-center bg-gradient-to-br',
                    gen.gradientFrom,
                    gen.gradientTo
                  )}
                >
                  <div className="rounded-lg bg-white/10 p-3 backdrop-blur-sm">
                    <Sparkles className="size-5 text-white/80" />
                  </div>
                </div>
                {/* Card details */}
                <div className="p-3">
                  <h3 className="text-sm font-medium text-foreground truncate">
                    {gen.title}
                  </h3>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {gen.createdAt}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
