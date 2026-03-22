'use client';

import { cn } from '@/lib/utils';
import { Sparkles, FileText, GraduationCap, type LucideIcon } from 'lucide-react';
import Link from 'next/link';

interface QuickAction {
  title: string;
  subtitle: string;
  href: string;
  icon: LucideIcon;
  iconClassName: string;
}

const actions: QuickAction[] = [
  {
    title: 'Generate',
    subtitle: 'Create UI code',
    href: '/generate',
    icon: Sparkles,
    iconClassName: 'text-purple-400',
  },
  {
    title: 'Browse Prompts',
    subtitle: '100+ templates',
    href: '/prompts',
    icon: FileText,
    iconClassName: 'text-cyan-400',
  },
  {
    title: 'Continue Learning',
    subtitle: '45% complete',
    href: '/learn',
    icon: GraduationCap,
    iconClassName: 'text-orange-400',
  },
];

interface QuickActionsProps {
  className?: string;
}

export function QuickActions({ className }: QuickActionsProps) {
  return (
    <div className={cn('grid grid-cols-1 gap-4 sm:grid-cols-3', className)}>
      {actions.map((action) => {
        const Icon = action.icon;
        return (
          <Link key={action.title} href={action.href} className="group">
            <div className="flex flex-col items-center rounded-xl border border-border bg-card p-5 text-center transition-colors hover:border-primary">
              <div className="mb-3 flex size-10 items-center justify-center rounded-lg bg-muted">
                <Icon className={cn('size-5', action.iconClassName)} />
              </div>
              <h3 className="text-sm font-semibold text-foreground">
                {action.title}
              </h3>
              <p className="mt-1 text-xs text-muted-foreground">
                {action.subtitle}
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
