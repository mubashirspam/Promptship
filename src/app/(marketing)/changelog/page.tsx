import type { Metadata } from 'next';
import { PageShell } from '@/components/marketing/page-shell';
import { Badge } from '@/components/ui/badge';

export const metadata: Metadata = {
  title: 'Changelog — Promtify',
  description: 'Everything new in Promtify — templates, features and fixes.',
};

type Tag = 'New' | 'Improved' | 'Fixed';

const tagStyles: Record<Tag, string> = {
  New: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  Improved: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  Fixed: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
};

const entries: {
  date: string;
  title: string;
  items: { tag: Tag; text: string }[];
}[] = [
  {
    date: 'July 18, 2026',
    title: 'Lifetime plans & the new template store',
    items: [
      { tag: 'New', text: 'One-time lifetime plans: Basic (Figma Kits), Pro (+ AI Prompts), Premium (+ Code Starters). No subscriptions, ever.' },
      { tag: 'New', text: 'Video courses available as a simple $7 lifetime add-on.' },
      { tag: 'New', text: 'Every template is now tagged by kind (Figma Kit / AI Prompt / Code Starter), platform (web / mobile) and scope (full template / component).' },
      { tag: 'New', text: 'Categories with subcategories — browse Components → Buttons, Mobile → Flutter, and more.' },
      { tag: 'Improved', text: 'Template previews now stream from a global CDN — faster cards, autoplaying video previews.' },
      { tag: 'Improved', text: 'Prompts render as formatted markdown with one-click copy.' },
    ],
  },
  {
    date: 'July 17, 2026',
    title: 'Secure downloads & purchases',
    items: [
      { tag: 'New', text: 'Buy any single template on its own — Figma link, prompt or source zip delivered instantly after checkout.' },
      { tag: 'New', text: 'USD (Stripe) and INR (Razorpay) checkout.' },
      { tag: 'Improved', text: 'Paid content is now fully server-protected — previews are public, the goods unlock only after purchase.' },
      { tag: 'Fixed', text: 'Google & GitHub sign-in reliability across environments.' },
    ],
  },
  {
    date: 'July 16, 2026',
    title: 'Foundation',
    items: [
      { tag: 'New', text: 'Public beta: browse the full library free, with free templates usable by everyone.' },
      { tag: 'New', text: 'Sign in with Google, GitHub or email.' },
    ],
  },
];

export default function ChangelogPage() {
  return (
    <PageShell
      title="Changelog"
      subtitle="New templates land weekly; product updates land here."
      narrow
    >
      <div className="relative space-y-12 before:absolute before:top-2 before:bottom-2 before:left-[7px] before:w-px before:bg-border">
        {entries.map((entry) => (
          <div key={entry.date} className="relative pl-8">
            <span className="absolute top-1.5 left-0 size-[15px] rounded-full border-2 border-primary bg-background" />
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {entry.date}
            </p>
            <h2 className="mt-1 text-xl font-semibold">{entry.title}</h2>
            <ul className="mt-4 space-y-2.5">
              {entry.items.map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm">
                  <Badge className={`border-0 shrink-0 ${tagStyles[item.tag]}`}>
                    {item.tag}
                  </Badge>
                  <span className="text-muted-foreground">{item.text}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </PageShell>
  );
}
