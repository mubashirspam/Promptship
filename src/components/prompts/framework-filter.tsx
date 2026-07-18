'use client';

import { cn } from '@/lib/utils';
import { Filter } from 'lucide-react';
import { FRAMEWORKS, FRAMEWORK_META } from '@/lib/utils/constants';
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
        {FRAMEWORKS.map((fw) => (
          <SelectItem key={fw} value={fw}>
            <span className="flex items-center gap-2">
              <span
                className="size-2 rounded-full"
                style={{ backgroundColor: FRAMEWORK_META[fw].color }}
              />
              {FRAMEWORK_META[fw].label}
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
