'use client';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import type { Framework } from '@/lib/utils/constants';

const frameworks: { value: Framework; label: string }[] = [
  { value: 'react', label: 'React' },
  { value: 'flutter', label: 'Flutter' },
  { value: 'html', label: 'HTML' },
  { value: 'vue', label: 'Vue' },
];

interface FrameworkSelectorProps {
  value: Framework;
  onChange: (framework: Framework) => void;
}

export function FrameworkSelector({ value, onChange }: FrameworkSelectorProps) {
  return (
    <div>
      <Label>Framework</Label>
      <div className="flex gap-2 mt-1.5">
        {frameworks.map((fw) => (
          <Button
            key={fw.value}
            variant={value === fw.value ? 'default' : 'outline'}
            size="sm"
            onClick={() => onChange(fw.value)}
            className={cn('flex-1')}
          >
            {fw.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
