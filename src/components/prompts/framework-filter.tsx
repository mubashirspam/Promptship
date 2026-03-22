'use client';

import { cn } from '@/lib/utils';
import { Filter } from 'lucide-react';
import { FRAMEWORKS, type Framework } from '@/lib/utils/constants';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface FrameworkFilterProps {
  activeFramework: string | null;
  onFrameworkChange: (fw: string | null) => void;
  className?: string;
}

const frameworkMeta: Record<Framework, { label: string; color: string }> = {
  react: { label: 'React', color: 'bg-[#61DAFB]' },
  flutter: { label: 'Flutter', color: 'bg-[#02569B]' },
  html: { label: 'HTML', color: 'bg-[#E34F26]' },
  vue: { label: 'Vue', color: 'bg-[#4FC08D]' },
};

export function FrameworkFilter({
  activeFramework,
  onFrameworkChange,
  className,
}: FrameworkFilterProps) {
  return (
    <Select
      value={activeFramework ?? 'all'}
      onValueChange={(value) =>
        onFrameworkChange(value === 'all' ? null : value)
      }
    >
      <SelectTrigger size="sm" className={cn('w-[160px]', className)}>
        <Filter className="size-3.5 text-muted-foreground" />
        <SelectValue placeholder="Framework" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Frameworks</SelectItem>
        {FRAMEWORKS.map((fw) => {
          const meta = frameworkMeta[fw];
          return (
            <SelectItem key={fw} value={fw}>
              <span className="flex items-center gap-2">
                <span
                  className={cn('size-2 rounded-full', meta.color)}
                />
                {meta.label}
              </span>
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}
