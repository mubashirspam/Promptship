import { Rocket } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  showText?: boolean;
}

export function Logo({ className, showText = true }: LogoProps) {
  return (
    <Link href="/" className={cn('flex items-center gap-2', className)}>
      <div className="flex items-center justify-center rounded-lg bg-gradient-to-br from-primary to-purple-600 p-1.5">
        <Rocket className="size-5 text-white" />
      </div>
      {showText && (
        <span className="gradient-text text-lg font-bold">PromptShip</span>
      )}
    </Link>
  );
}
