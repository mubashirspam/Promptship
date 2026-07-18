'use client';

import { Figma, Sparkles, Code2 } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { AssetKind } from './prompt-card';

interface KindTab {
  value: AssetKind;
  label: string;
  icon: LucideIcon;
}

const KIND_TABS: KindTab[] = [
  { value: 'figma', label: 'Figma Kits', icon: Figma },
  { value: 'ai_prompt', label: 'AI Prompts', icon: Sparkles },
  { value: 'code', label: 'Code Starters', icon: Code2 },
];

interface KindTabsProps {
  activeKind: AssetKind;
  onKindChange: (kind: AssetKind) => void;
  className?: string;
}

export function KindTabs({ activeKind, onKindChange, className }: KindTabsProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center gap-1 rounded-xl border bg-muted/40 p-1',
        className
      )}
    >
      {KIND_TABS.map((tab) => {
        const active = tab.value === activeKind;
        return (
          <button
            key={tab.value}
            type="button"
            onClick={() => onKindChange(tab.value)}
            className={cn(
              'flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors',
              active
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <tab.icon className="size-4" />
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

export { KIND_TABS };
