'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Play,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Clock,
  BookOpen,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import Link from 'next/link';

interface ModuleData {
  id: string;
  number: number;
  title: string;
  lessons: LessonData[];
}

interface LessonData {
  id: string;
  number: number;
  title: string;
  duration: number;
  completed: boolean;
}

const COURSE_DATA: ModuleData[] = [
  {
    id: 'foundations',
    number: 1,
    title: 'Foundations',
    lessons: [
      { id: 'lesson-1', number: 1, title: 'Introduction to PromptShip', duration: 12, completed: false },
      { id: 'lesson-2', number: 2, title: 'Understanding AI Prompts', duration: 15, completed: false },
      { id: 'lesson-3', number: 3, title: 'Your First Generation', duration: 18, completed: false },
      { id: 'lesson-4', number: 4, title: 'Frameworks Overview', duration: 14, completed: false },
      { id: 'lesson-5', number: 5, title: 'Best Practices', duration: 13, completed: false },
    ],
  },
  {
    id: 'ui-generation-mastery',
    number: 2,
    title: 'UI Generation Mastery',
    lessons: [
      { id: 'lesson-1', number: 1, title: 'Form Components', duration: 20, completed: false },
      { id: 'lesson-2', number: 2, title: 'Navigation Patterns', duration: 18, completed: false },
      { id: 'lesson-3', number: 3, title: 'Data Tables', duration: 22, completed: false },
      { id: 'lesson-4', number: 4, title: 'Dashboard Layouts', duration: 25, completed: false },
      { id: 'lesson-5', number: 5, title: 'Card Components', duration: 16, completed: false },
      { id: 'lesson-6', number: 6, title: 'Modal & Dialog', duration: 19, completed: false },
      { id: 'lesson-7', number: 7, title: 'Responsive Design', duration: 21, completed: false },
      { id: 'lesson-8', number: 8, title: 'Theming & Colors', duration: 18, completed: false },
      { id: 'lesson-9', number: 9, title: 'Typography', duration: 17, completed: false },
      { id: 'lesson-10', number: 10, title: 'Icons & Assets', duration: 19, completed: false },
    ],
  },
  {
    id: 'architecture-state',
    number: 3,
    title: 'Architecture & State',
    lessons: [
      { id: 'lesson-1', number: 1, title: 'State Management Basics', duration: 20, completed: false },
      { id: 'lesson-2', number: 2, title: 'Props & Data Flow', duration: 18, completed: false },
      { id: 'lesson-3', number: 3, title: 'API Integration', duration: 22, completed: false },
      { id: 'lesson-4', number: 4, title: 'Error Handling', duration: 19, completed: false },
      { id: 'lesson-5', number: 5, title: 'Loading States', duration: 17, completed: false },
      { id: 'lesson-6', number: 6, title: 'Component Composition', duration: 21, completed: false },
      { id: 'lesson-7', number: 7, title: 'Performance Patterns', duration: 20, completed: false },
      { id: 'lesson-8', number: 8, title: 'Testing Generated Code', duration: 21, completed: false },
    ],
  },
  {
    id: 'flutter-deep-dive',
    number: 4,
    title: 'Flutter Deep Dive',
    lessons: [
      { id: 'lesson-1', number: 1, title: 'Flutter Setup', duration: 18, completed: false },
      { id: 'lesson-2', number: 2, title: 'Widget Composition', duration: 22, completed: false },
      { id: 'lesson-3', number: 3, title: 'Layouts & Constraints', duration: 20, completed: false },
      { id: 'lesson-4', number: 4, title: 'Navigation & Routing', duration: 21, completed: false },
      { id: 'lesson-5', number: 5, title: 'State with Provider', duration: 19, completed: false },
      { id: 'lesson-6', number: 6, title: 'Animations', duration: 22, completed: false },
      { id: 'lesson-7', number: 7, title: 'Platform Adaptive UI', duration: 20, completed: false },
      { id: 'lesson-8', number: 8, title: 'Deploying Flutter Apps', duration: 18, completed: false },
    ],
  },
  {
    id: 'advanced-techniques',
    number: 5,
    title: 'Advanced Techniques',
    lessons: [
      { id: 'lesson-1', number: 1, title: 'Multi-step Generation', duration: 22, completed: false },
      { id: 'lesson-2', number: 2, title: 'Custom Design Systems', duration: 20, completed: false },
      { id: 'lesson-3', number: 3, title: 'Animation Workflows', duration: 21, completed: false },
      { id: 'lesson-4', number: 4, title: 'Complex Interactions', duration: 19, completed: false },
      { id: 'lesson-5', number: 5, title: 'Accessibility', duration: 18, completed: false },
      { id: 'lesson-6', number: 6, title: 'Internationalization', duration: 20, completed: false },
      { id: 'lesson-7', number: 7, title: 'Production Optimization', duration: 22, completed: false },
      { id: 'lesson-8', number: 8, title: 'CI/CD Integration', duration: 19, completed: false },
      { id: 'lesson-9', number: 9, title: 'Capstone Project', duration: 19, completed: false },
    ],
  },
];

function findLesson(moduleId: string, lessonId: string) {
  const mod = COURSE_DATA.find((m) => m.id === moduleId);
  if (!mod) return null;
  const lesson = mod.lessons.find((l) => l.id === lessonId);
  if (!lesson) return null;
  return { module: mod, lesson };
}

function getAdjacentLessons(moduleId: string, lessonId: string) {
  const mod = COURSE_DATA.find((m) => m.id === moduleId);
  if (!mod) return { prev: null, next: null };
  const idx = mod.lessons.findIndex((l) => l.id === lessonId);

  const prev = idx > 0 ? { moduleId, lessonId: mod.lessons[idx - 1].id } : null;
  const next =
    idx < mod.lessons.length - 1 ? { moduleId, lessonId: mod.lessons[idx + 1].id } : null;

  return { prev, next };
}

interface LessonContentProps {
  moduleId: string;
  lessonId: string;
}

export function LessonContent({ moduleId, lessonId }: LessonContentProps) {
  const [expandedModules, setExpandedModules] = useState<string[]>([moduleId]);

  const found = findLesson(moduleId, lessonId);
  const { prev, next } = getAdjacentLessons(moduleId, lessonId);

  const toggleModule = (id: string) => {
    setExpandedModules((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  };

  if (!found) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h2 className="text-xl font-semibold">Lesson not found</h2>
        <p className="text-sm text-muted-foreground mt-2">
          The requested lesson could not be found.
        </p>
        <Button asChild className="mt-4">
          <Link href="/learn">Back to Learning Hub</Link>
        </Button>
      </div>
    );
  }

  const { module: currentModule, lesson: currentLesson } = found;

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/learn" className="hover:text-foreground transition-colors">
          Learning Hub
        </Link>
        <span>/</span>
        <span>{currentModule.title}</span>
        <span>/</span>
        <span className="text-foreground font-medium">{currentLesson.title}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
        {/* Left: Main Content */}
        <div className="space-y-6">
          {/* Video Player Placeholder */}
          <div className="aspect-video rounded-xl bg-gradient-to-br from-zinc-900 to-zinc-800 flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(124,58,237,0.15),transparent_70%)]" />
            <button
              type="button"
              className="relative flex size-16 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-colors"
            >
              <Play className="size-7 text-white ml-1" />
            </button>
          </div>

          {/* Lesson Info */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary">
                Module {currentModule.number}
              </Badge>
              <Badge variant="outline">
                Lesson {currentLesson.number}
              </Badge>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="size-3" />
                {currentLesson.duration} min
              </span>
            </div>
            <h1 className="text-2xl font-bold">{currentLesson.title}</h1>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            {prev ? (
              <Button variant="outline" asChild>
                <Link href={`/learn/${prev.moduleId}/${prev.lessonId}`}>
                  <ChevronLeft className="size-4" />
                  Previous
                </Link>
              </Button>
            ) : (
              <div />
            )}
            {next ? (
              <Button asChild>
                <Link href={`/learn/${next.moduleId}/${next.lessonId}`}>
                  Next Lesson
                  <ChevronRight className="size-4" />
                </Link>
              </Button>
            ) : (
              <Button variant="outline" asChild>
                <Link href="/learn">
                  Back to Modules
                </Link>
              </Button>
            )}
          </div>

          <Separator />

          {/* Description */}
          <div className="space-y-3">
            <h2 className="text-lg font-semibold">About this lesson</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              In this lesson, you will learn the key concepts and techniques related to{' '}
              {currentLesson.title.toLowerCase()}. We will walk through practical examples,
              explore best practices, and build real components using the PromptShip AI generator.
              By the end of this lesson, you will be able to confidently apply these skills in your own projects.
            </p>
          </div>
        </div>

        {/* Right: Course Navigation Sidebar */}
        <div>
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="text-sm">Course Navigation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 p-0 px-4 pb-4">
              {COURSE_DATA.map((mod) => {
                const isExpanded = expandedModules.includes(mod.id);

                return (
                  <div key={mod.id} className="border-b border-border last:border-0">
                    <button
                      type="button"
                      onClick={() => toggleModule(mod.id)}
                      className="flex w-full items-center justify-between py-2.5 text-left text-sm font-medium hover:text-foreground transition-colors"
                    >
                      <span className={cn(
                        'flex items-center gap-2',
                        mod.id === moduleId ? 'text-foreground' : 'text-muted-foreground'
                      )}>
                        <BookOpen className="size-3.5 shrink-0" />
                        <span className="line-clamp-1">
                          {mod.number}. {mod.title}
                        </span>
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="size-3.5 text-muted-foreground shrink-0" />
                      ) : (
                        <ChevronDown className="size-3.5 text-muted-foreground shrink-0" />
                      )}
                    </button>

                    {isExpanded && (
                      <div className="pb-2 pl-6 space-y-0.5">
                        {mod.lessons.map((lesson) => {
                          const isCurrent =
                            mod.id === moduleId && lesson.id === lessonId;

                          return (
                            <Link
                              key={lesson.id}
                              href={`/learn/${mod.id}/${lesson.id}`}
                              className={cn(
                                'flex items-center gap-2 rounded-md px-2 py-1.5 text-xs transition-colors',
                                isCurrent
                                  ? 'bg-primary/10 text-primary font-medium'
                                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                              )}
                            >
                              {lesson.completed ? (
                                <CheckCircle className="size-3.5 text-green-500 shrink-0" />
                              ) : (
                                <span
                                  className={cn(
                                    'flex size-3.5 shrink-0 items-center justify-center rounded-full border text-[9px]',
                                    isCurrent
                                      ? 'border-primary text-primary'
                                      : 'border-muted-foreground/40 text-muted-foreground/60'
                                  )}
                                >
                                  {lesson.number}
                                </span>
                              )}
                              <span className="line-clamp-1">{lesson.title}</span>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
