import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  showText?: boolean;
}

export function Logo({ className, showText = true }: LogoProps) {
  return (
    <Link href="/" className={cn('flex items-center gap-2', className)}>
      <Image src="/logo.svg" alt="Promtify" width={28} height={28} />
      {showText && (
        <span className="gradient-text text-lg font-bold">Promtify</span>
      )}
    </Link>
  );
}
