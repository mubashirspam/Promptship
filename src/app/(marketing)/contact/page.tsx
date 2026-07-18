import type { Metadata } from 'next';
import { Mail, MessageCircle, Handshake } from 'lucide-react';
import { PageShell } from '@/components/marketing/page-shell';
import { Card, CardContent } from '@/components/ui/card';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: 'Contact — Promtify',
  description: 'Get in touch with the Promtify team — support, billing, partnerships.',
};

const channels = [
  {
    icon: Mail,
    title: 'Support',
    text: 'Purchase issues, access problems or billing questions — we answer within 24 hours.',
    action: { label: 'support@promtify.dev', href: 'mailto:support@promtify.dev' },
  },
  {
    icon: Handshake,
    title: 'Partnerships & sellers',
    text: 'Want to sell your templates on the upcoming marketplace, or partner with us?',
    action: { label: 'hello@promtify.dev', href: 'mailto:hello@promtify.dev' },
  },
  {
    icon: MessageCircle,
    title: 'Community',
    text: 'Quick questions, feedback and template requests — the fastest way to reach us.',
    action: { label: 'Join our Discord', href: siteConfig.links.discord },
  },
];

export default function ContactPage() {
  return (
    <PageShell
      title="Talk to us."
      subtitle="Real humans, usually within a day. Pick whichever channel fits."
      narrow
    >
      <div className="grid gap-4">
        {channels.map((c) => (
          <Card key={c.title}>
            <CardContent className="flex flex-col gap-3 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-4">
                <div className="rounded-lg bg-primary/10 p-2.5 text-primary">
                  <c.icon className="size-5" />
                </div>
                <div>
                  <h3 className="font-semibold">{c.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{c.text}</p>
                </div>
              </div>
              <a
                href={c.action.href}
                target={c.action.href.startsWith('http') ? '_blank' : undefined}
                rel="noopener noreferrer"
                className="shrink-0 text-sm font-medium text-primary underline-offset-4 hover:underline"
              >
                {c.action.label} →
              </a>
            </CardContent>
          </Card>
        ))}
      </div>

      <p className="mt-10 text-sm text-muted-foreground">
        You can also find us on{' '}
        <a href={siteConfig.links.x} className="underline underline-offset-4" target="_blank" rel="noopener noreferrer">
          X
        </a>
        ,{' '}
        <a href={siteConfig.links.bluesky} className="underline underline-offset-4" target="_blank" rel="noopener noreferrer">
          Bluesky
        </a>{' '}
        and{' '}
        <a href={siteConfig.links.linkedin} className="underline underline-offset-4" target="_blank" rel="noopener noreferrer">
          LinkedIn
        </a>
        .
      </p>
    </PageShell>
  );
}
