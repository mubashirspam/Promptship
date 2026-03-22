'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface CourseProgressCardProps {
  courseTitle?: string;
  progressPercent?: number;
  className?: string;
}

export function CourseProgressCard({
  courseTitle = 'Prompt Engineering Fundamentals',
  progressPercent = 45,
  className,
}: CourseProgressCardProps) {
  const clampedPercent = Math.min(100, Math.max(0, progressPercent));

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 p-5 text-white md:p-6',
        className
      )}
    >
      <div className="flex items-center gap-5">
        {/* Thumbnail placeholder */}
        <div className="hidden shrink-0 sm:block">
          <div className="flex size-20 items-center justify-center rounded-xl bg-white/20">
            <svg
              className="size-8 text-white/70"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342"
              />
            </svg>
          </div>
        </div>

        {/* Course details */}
        <div className="flex-1 space-y-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-white/70">
              Current Level
            </p>
            <h3 className="mt-1 text-base font-semibold leading-snug md:text-lg">
              {courseTitle}
            </h3>
          </div>

          {/* Progress bar */}
          <div className="space-y-1.5">
            <div className="h-2 w-full overflow-hidden rounded-full bg-white/25">
              <div
                className="h-full rounded-full bg-white transition-all duration-500"
                style={{ width: `${clampedPercent}%` }}
              />
            </div>
            <p className="text-xs font-medium text-white/80">
              {clampedPercent}% complete
            </p>
          </div>
        </div>

        {/* Continue button */}
        <div className="hidden shrink-0 sm:block">
          <Button
            asChild
            className="bg-white text-gray-900 hover:bg-white/90 border-none"
          >
            <Link href="/learn">
              Continue
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Mobile continue button */}
      <div className="mt-4 sm:hidden">
        <Button
          asChild
          className="w-full bg-white text-gray-900 hover:bg-white/90 border-none"
        >
          <Link href="/learn">
            Continue
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
