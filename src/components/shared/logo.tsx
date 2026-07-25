import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  showText?: boolean;
  /** Override the wordmark styling (defaults to the gradient wordmark). */
  textClassName?: string;
}

export function Logo({
  className,
  showText = true,
  textClassName = 'gradient-text text-lg font-bold',
}: LogoProps) {
  return (
    <Link href="/" className={cn('flex items-center gap-2', className)}>
      <Image src="/logo.png" alt="Promtify" width={28} height={28} />
      {showText && <span className={textClassName}>Promtify</span>}
    </Link>
  );
}
