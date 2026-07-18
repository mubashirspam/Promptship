'use client';

import { Button } from '@/components/ui/button';
import { LayoutGrid, Bell } from 'lucide-react';
import { toast } from 'sonner';

export default function TemplatesPage() {
  const handleNotify = () => {
    toast.success('You will be notified when templates are available!');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="flex size-20 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500/20 to-violet-500/20 mb-6">
        <LayoutGrid className="size-10 text-purple-500" />
      </div>
      <h1 className="text-2xl font-bold">Templates Coming Soon</h1>
      <p className="text-muted-foreground mt-2 max-w-md">
        Pre-built UI templates for quick start. Available for Starter tier and above.
      </p>
      <Button onClick={handleNotify} className="mt-6">
        <Bell className="size-4" />
        Notify Me
      </Button>
    </div>
  );
}
