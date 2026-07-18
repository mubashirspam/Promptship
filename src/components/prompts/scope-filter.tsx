'use client';

import { cn } from '@/lib/utils';
import { LayoutTemplate } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ScopeFilterProps {
  /** null = all · 'full' = full sites · 'component' = components */
  activeScope: string | null;
  onScopeChange: (scope: string | null) => void;
  className?: string;
}

export function ScopeFilter({ activeScope, onScopeChange, className }: ScopeFilterProps) {
  return (
    <Select
      value={activeScope ?? 'all'}
      onValueChange={(value) => onScopeChange(value === 'all' ? null : value)}
    >
      <SelectTrigger size="sm" className={cn('w-[160px]', className)}>
        <LayoutTemplate className="size-3.5 text-muted-foreground" />
        <SelectValue placeholder="Type" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Types</SelectItem>
        <SelectItem value="full">Full Templates</SelectItem>
        <SelectItem value="component">Components</SelectItem>
      </SelectContent>
    </Select>
  );
}

interface PlatformFilterProps {
  /** null = all · 'web' | 'mobile' */
  activePlatform: string | null;
  onPlatformChange: (platform: string | null) => void;
  className?: string;
}

export function PlatformFilter({
  activePlatform,
  onPlatformChange,
  className,
}: PlatformFilterProps) {
  return (
    <Select
      value={activePlatform ?? 'all'}
      onValueChange={(value) => onPlatformChange(value === 'all' ? null : value)}
    >
      <SelectTrigger size="sm" className={cn('w-[140px]', className)}>
        <SelectValue placeholder="Platform" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Platforms</SelectItem>
        <SelectItem value="web">🖥️ Web</SelectItem>
        <SelectItem value="mobile">📱 Mobile App</SelectItem>
      </SelectContent>
    </Select>
  );
}
