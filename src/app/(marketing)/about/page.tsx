import type { Metadata } from 'next';
import Link from 'next/link';
import { Figma, Sparkles, Code2 } from 'lucide-react';
import { PageShell } from '@/components/marketing/page-shell';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: 'About — Promtify',
  description:
    'Why we built Promtify: premium Figma Kits, AI Prompts and Code Starters you pay for once and own forever.',
};

const kinds = [
  {
    icon: Figma,
    title: 'Figma Kits',
    text: 'Full website and mobile-app design kits, plus single components — organized, auto-layout, ready to duplicate and make yours.',
  },
  {
    icon: Sparkles,
    title: 'AI Prompts',
    text: 'Battle-tested markdown prompts that turn Claude, Cursor or v0 into a senior UI engineer. Copy, paste, ship.',
  },
  {
    icon: Code2,
    title: 'Code Starters',
    text: 'Complete source you can download and run — React, Next.js, Flutter, React Native, Kotlin, Swift and more.',
  },
];

export default function AboutPage() {
  return (
    <PageShell
      title="Ship beautiful products without starting from zero."
      subtitle="Promtify is a premium template marketplace built by developers who were tired of rebuilding the same screens — and tired of subscriptions."
    >
      <div className="space-y-12">
        <div className="space-y-4 text-muted-foreground leading-relaxed">
          <p>
            Every product team rebuilds the same things: heroes, dashboards,
            auth flows, onboarding, checkout. We spent years doing it too —
            once in Figma, once in prompts, once in code. Promtify exists so
            you only ever do it once more:{' '}
            <span className="text-foreground font-medium">
              pick a template, unlock it, ship it.
            </span>
          </p>
          <p>
            We sell access the way we wish everyone did:{' '}
            <span className="text-foreground font-medium">
              one payment, lifetime access
            </span>
            . No renewals, no seats, no &ldquo;your plan has expired.&rdquo;
            When new templates land every week, they drop straight into the
            plan you already own.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {kinds.map((k) => (
            <Card key={k.title}>
              <CardContent className="space-y-2 pt-6">
                <k.icon className="size-6 text-primary" />
                <h3 className="font-semibold">{k.title}</h3>
                <p className="text-sm text-muted-foreground">{k.text}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="space-y-4 text-muted-foreground leading-relaxed">
          <h2 className="text-2xl font-semibold text-foreground">
            Where we&rsquo;re headed
          </h2>
          <p>
            Templates are chapter one. Video courses are already here as a
            simple add-on, an AI generator that turns any template into
            custom code is next, and after that we&rsquo;re opening a
            marketplace so designers and developers can sell their own kits
            on Promtify.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button asChild size="lg">
            <a href={`${siteConfig.appUrl}/signup`}>Start browsing free</a>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/pricing">See lifetime pricing</Link>
          </Button>
        </div>
      </div>
    </PageShell>
  );
}
