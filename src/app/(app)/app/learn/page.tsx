'use client';

import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  BookOpen,
  Clock,
  Lock,
  ArrowRight,
  GraduationCap,
} from 'lucide-react';
import Link from 'next/link';

interface Module {
  id: string;
  number: number;
  title: string;
  description: string;
  lessons: number;
  duration: number;
  progress: number;
  requiresPro: boolean;
}

const MODULES: Module[] = [
  {
    id: 'foundations',
    number: 1,
    title: 'Foundations',
    description:
      'Learn the fundamentals of AI-assisted UI development. Understand how prompts work, explore the generator interface, and build your first component.',
    lessons: 5,
    duration: 72,
    progress: 0,
    requiresPro: false,
  },
  {
    id: 'ui-generation-mastery',
    number: 2,
    title: 'UI Generation Mastery',
    description:
      'Master advanced prompt techniques for complex UI components. Learn to generate forms, dashboards, data tables, and interactive layouts.',
    lessons: 10,
    duration: 195,
    progress: 0,
    requiresPro: false,
  },
  {
    id: 'architecture-state',
    number: 3,
    title: 'Architecture & State',
    description:
      'Deep dive into generating components with proper state management, data flow patterns, and scalable architecture using AI assistance.',
    lessons: 8,
    duration: 158,
    progress: 0,
    requiresPro: true,
  },
  {
    id: 'flutter-deep-dive',
    number: 4,
    title: 'Flutter Deep Dive',
    description:
      'Explore Flutter-specific generation techniques, widget composition patterns, responsive layouts, and platform-adaptive UI with Promtify.',
    lessons: 8,
    duration: 160,
    progress: 0,
    requiresPro: true,
  },
  {
    id: 'advanced-techniques',
    number: 5,
    title: 'Advanced Techniques',
    description:
      'Push the boundaries with multi-step generation, custom design systems, animation workflows, and production deployment strategies.',
    lessons: 9,
    duration: 180,
    progress: 0,
    requiresPro: true,
  },
];

function formatDuration(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins} min`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
}

const totalLessons = MODULES.reduce((acc, m) => acc + m.lessons, 0);

export default function LearnPage() {
  const { user } = useAuth();
  const tier = ((user as Record<string, unknown>)?.tier as string) ?? 'free';
  const hasProAccess = tier === 'pro' || tier === 'team';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">Learning Hub</h1>
          <p className="text-muted-foreground">
            {MODULES.length} Modules &bull; {totalLessons} Lessons
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
          <GraduationCap className="size-4" />
          <span>Master AI-powered UI development</span>
        </div>
      </div>

      {/* Module List */}
      <div className="flex flex-col gap-4">
        {MODULES.map((mod) => {
          const isLocked = mod.requiresPro && !hasProAccess;
          const progressPercent =
            mod.progress > 0 ? Math.round((mod.progress / mod.lessons) * 100) : 0;

          return (
            <Card key={mod.id} className={cn('relative overflow-hidden', isLocked && 'opacity-80')}>
              <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6 py-5">
                {/* Module Number */}
                <div
                  className={cn(
                    'flex size-12 shrink-0 items-center justify-center rounded-xl text-lg font-bold',
                    isLocked
                      ? 'bg-muted text-muted-foreground'
                      : 'bg-gradient-to-br from-purple-600 to-violet-600 text-white'
                  )}
                >
                  {isLocked ? <Lock className="size-5" /> : mod.number}
                </div>

                {/* Module Info */}
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold text-base">
                      Module {mod.number}: {mod.title}
                    </h3>
                    {isLocked && (
                      <Badge variant="secondary" className="text-xs">
                        Pro
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {mod.description}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <BookOpen className="size-3" />
                      {mod.lessons} lessons
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="size-3" />
                      {formatDuration(mod.duration)}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  {mod.progress > 0 && !isLocked && (
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">{progressPercent}%</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-purple-600 to-violet-600 transition-all"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Action */}
                <div className="shrink-0">
                  {isLocked ? (
                    <Button variant="outline" asChild>
                      <Link href="/upgrade">
                        <Lock className="size-3.5" />
                        Upgrade to Pro
                      </Link>
                    </Button>
                  ) : (
                    <Button asChild>
                      <Link href={`/learn/${mod.id}/lesson-1`}>
                        {mod.progress > 0 ? 'Continue' : 'Start'}
                        <ArrowRight className="size-3.5" />
                      </Link>
                    </Button>
                  )}
                </div>
              </CardContent>

              {/* Locked Overlay */}
              {isLocked && (
                <div className="absolute inset-0 bg-background/30 pointer-events-none" />
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
