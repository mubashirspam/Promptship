'use client';

import { cn } from '@/lib/utils';
import Link from 'next/link';

interface PromptItem {
  id: string;
  title: string;
  framework: string;
  gradientFrom: string;
  gradientTo: string;
}

const mockPrompts: PromptItem[] = [
  {
    id: 'p1',
    title: 'SaaS Landing Hero',
    framework: 'Next.js + Tailwind',
    gradientFrom: 'from-purple-500',
    gradientTo: 'to-indigo-500',
  },
  {
    id: 'p2',
    title: 'Auth Flow Modal',
    framework: 'React + shadcn/ui',
    gradientFrom: 'from-cyan-500',
    gradientTo: 'to-blue-500',
  },
  {
    id: 'p3',
    title: 'Data Table Layout',
    framework: 'Next.js + Tanstack',
    gradientFrom: 'from-orange-500',
    gradientTo: 'to-rose-500',
  },
];

interface NewPromptsWidgetProps {
  prompts?: PromptItem[];
  className?: string;
}

export function NewPromptsWidget({
  prompts = mockPrompts,
  className,
}: NewPromptsWidgetProps) {
  return (
    <div className={cn('space-y-3', className)}>
      <h3 className="text-sm font-semibold text-foreground">New This Week</h3>

      <div className="space-y-2">
        {prompts.map((prompt) => (
          <Link
            key={prompt.id}
            href="/prompts"
            className="group flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-muted"
          >
            {/* Small gradient thumbnail */}
            <div
              className={cn(
                'flex size-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br',
                prompt.gradientFrom,
                prompt.gradientTo
              )}
            >
              <span className="text-xs font-bold text-white">
                {prompt.title.charAt(0)}
              </span>
            </div>

            {/* Prompt info */}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground">
                {prompt.title}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {prompt.framework}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
