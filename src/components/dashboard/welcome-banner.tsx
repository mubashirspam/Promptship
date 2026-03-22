'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface WelcomeBannerProps {
  userName?: string | null;
  className?: string;
}

export function WelcomeBanner({ userName, className }: WelcomeBannerProps) {
  const displayName = userName ?? 'User';

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 p-6 text-white md:p-8',
        className
      )}
    >
      <div className="relative z-10 flex items-center justify-between gap-6">
        <div className="flex-1 space-y-2">
          <p className="text-sm font-medium text-white/80">Welcome back 👋</p>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            {displayName}
          </h1>
          <p className="text-sm text-white/70">
            Ready to ship something beautiful today?
          </p>
          <div className="pt-2">
            <Button
              asChild
              className="bg-white text-gray-900 hover:bg-white/90 border-none"
              size="lg"
            >
              <Link href="/generate">
                Start Generating
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Decorative abstract shape */}
        <div className="hidden md:block" aria-hidden="true">
          <div className="relative size-40">
            <div className="absolute inset-0 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute left-4 top-4 size-24 rounded-2xl bg-white/15 rotate-12" />
            <div className="absolute bottom-2 right-2 size-16 rounded-full bg-white/10" />
            <div className="absolute left-8 bottom-6 size-12 rounded-lg bg-white/20 -rotate-6" />
          </div>
        </div>
      </div>

      {/* Background decorative elements */}
      <div className="pointer-events-none absolute -right-12 -top-12 size-48 rounded-full bg-white/5" aria-hidden="true" />
      <div className="pointer-events-none absolute -bottom-8 -left-8 size-32 rounded-full bg-white/5" aria-hidden="true" />
    </div>
  );
}
