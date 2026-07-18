import { cn } from '@/lib/utils';

/** Shared shell for marketing content pages (about, legal, changelog…). */
export function PageShell({
  title,
  subtitle,
  children,
  narrow = false,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  narrow?: boolean;
}) {
  return (
    <div className={cn('mx-auto px-4 py-16 sm:py-24', narrow ? 'max-w-3xl' : 'max-w-4xl')}>
      <div className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">{title}</h1>
        {subtitle && (
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">{subtitle}</p>
        )}
      </div>
      {children}
    </div>
  );
}
