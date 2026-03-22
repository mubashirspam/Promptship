'use client';

import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';

interface StatItem {
  label: string;
  value: string | number;
  valueClassName: string;
  indicator?: {
    current: number;
    max: number;
  };
}

const defaultStats: StatItem[] = [
  {
    label: 'Prompts Copied',
    value: 47,
    valueClassName: 'text-primary',
  },
  {
    label: 'Generations',
    value: 23,
    valueClassName: 'text-cyan-400',
  },
  {
    label: 'Credits Left',
    value: 82,
    valueClassName: 'text-amber-400',
    indicator: { current: 82, max: 100 },
  },
  {
    label: 'Lessons Done',
    value: 12,
    valueClassName: 'text-green-400',
  },
];

interface StatsCardsProps {
  stats?: StatItem[];
  className?: string;
}

export function StatsCards({
  stats = defaultStats,
  className,
}: StatsCardsProps) {
  return (
    <div className={cn('grid grid-cols-2 gap-3', className)}>
      {stats.map((stat) => (
        <Card key={stat.label} className="border-border/50">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">{stat.label}</p>
            <p className={cn('mt-1 text-2xl font-bold', stat.valueClassName)}>
              {stat.value}
            </p>
            {stat.indicator && (
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-amber-400 transition-all duration-500"
                  style={{
                    width: `${Math.round((stat.indicator.current / stat.indicator.max) * 100)}%`,
                  }}
                />
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
