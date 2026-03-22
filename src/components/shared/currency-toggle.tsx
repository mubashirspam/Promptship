'use client';

import { cn } from '@/lib/utils';
import { useUIStore } from '@/stores/ui-store';
import { Button } from '@/components/ui/button';

export function CurrencyToggle({ className }: { className?: string }) {
  const { currency, setCurrency } = useUIStore();

  const toggle = () => {
    setCurrency(currency === 'USD' ? 'INR' : 'USD');
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggle}
      className={cn('min-w-[4rem] font-mono', className)}
    >
      {currency === 'USD' ? '$ USD' : '\u20B9 INR'}
    </Button>
  );
}
