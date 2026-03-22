'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Monitor, Tablet, Smartphone } from 'lucide-react';
import { cn } from '@/lib/utils';

type DeviceSize = 'desktop' | 'tablet' | 'mobile';

const deviceWidths: Record<DeviceSize, string> = {
  desktop: 'w-full',
  tablet: 'w-[768px]',
  mobile: 'w-[375px]',
};

export function LivePreview({ code }: { code: string | null }) {
  const [device, setDevice] = useState<DeviceSize>('desktop');

  if (!code) return null;

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button
          variant={device === 'desktop' ? 'default' : 'outline'}
          size="icon-sm"
          onClick={() => setDevice('desktop')}
        >
          <Monitor className="size-4" />
        </Button>
        <Button
          variant={device === 'tablet' ? 'default' : 'outline'}
          size="icon-sm"
          onClick={() => setDevice('tablet')}
        >
          <Tablet className="size-4" />
        </Button>
        <Button
          variant={device === 'mobile' ? 'default' : 'outline'}
          size="icon-sm"
          onClick={() => setDevice('mobile')}
        >
          <Smartphone className="size-4" />
        </Button>
      </div>
      <div className="flex justify-center">
        <div
          className={cn(
            'rounded-lg border bg-white overflow-auto transition-all',
            deviceWidths[device]
          )}
        >
          <div className="p-4 min-h-[400px]">
            <p className="text-muted-foreground text-sm text-center">
              Live preview coming soon
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
