'use client';

import { Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCredits } from '@/hooks/use-credits';
import { Badge } from '@/components/ui/badge';

export function CreditBadge({ className }: { className?: string }) {
  const { credits } = useCredits();

  return (
    <Badge variant="secondary" className={cn('gap-1', className)}>
      <Zap className="size-3" />
      {credits} credits
    </Badge>
  );
}
