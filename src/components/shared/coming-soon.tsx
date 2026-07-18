import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
import { ArrowLeft, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ComingSoonProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  /** Optional bullet list of what's coming */
  highlights?: string[];
}

/**
 * Shared "coming soon" screen for sections that are surfaced in the sidebar
 * but not yet launched (Generate, Courses, Marketplace).
 */
export function ComingSoon({
  icon: Icon = Clock,
  title,
  description,
  highlights,
}: ComingSoonProps) {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="w-full max-w-lg text-center">
        <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600 to-violet-600 text-white shadow-lg">
          <Icon className="size-8" />
        </div>

        <span className="inline-flex items-center gap-1.5 rounded-full border bg-muted/50 px-3 py-1 text-xs font-semibold text-muted-foreground">
          <Clock className="size-3" />
          Coming Soon
        </span>

        <h1 className="mt-4 text-3xl font-bold tracking-tight">{title}</h1>
        <p className="mt-3 text-muted-foreground">{description}</p>

        {highlights && highlights.length > 0 && (
          <ul className="mx-auto mt-6 flex max-w-sm flex-col gap-2 text-left">
            {highlights.map((h) => (
              <li
                key={h}
                className="flex items-start gap-2 text-sm text-muted-foreground"
              >
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-purple-500" />
                {h}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-8 flex items-center justify-center gap-3">
          <Button asChild>
            <Link href="/prompts">
              <ArrowLeft className="size-4" />
              Browse Prompts
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/dashboard">Go to Dashboard</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
