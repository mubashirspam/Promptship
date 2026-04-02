'use client';

import { cn } from '@/lib/utils';
import { Play } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface WelcomeVideoProps {
  title?: string;
  subtitle?: string;
  duration?: string;
  className?: string;
}

export function WelcomeVideo({
  title = 'Welcome to Promtify',
  subtitle = 'Before You Start',
  duration = '10:47',
  className,
}: WelcomeVideoProps) {
  return (
    <div className={cn('space-y-3', className)}>
      {/* Video thumbnail */}
      <button
        type="button"
        className="group relative w-full overflow-hidden rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-label={`Play video: ${title}`}
      >
        {/* Dark gradient background */}
        <div className="aspect-video w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
          {/* Subtle decorative elements */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          <div className="absolute left-4 top-4 size-20 rounded-full bg-purple-500/10 blur-2xl" aria-hidden="true" />
          <div className="absolute bottom-4 right-8 size-16 rounded-full bg-pink-500/10 blur-xl" aria-hidden="true" />
        </div>

        {/* Play button overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-primary shadow-lg transition-transform group-hover:scale-110">
            <Play className="size-5 fill-primary-foreground text-primary-foreground ml-0.5" />
          </div>
        </div>

        {/* Duration badge */}
        <div className="absolute bottom-2 right-2">
          <Badge variant="secondary" className="bg-black/70 text-white text-[10px] border-none">
            {duration}
          </Badge>
        </div>
      </button>

      {/* Video info */}
      <div>
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </div>
    </div>
  );
}
