import type { Metadata } from 'next';
import { PageShell } from '@/components/marketing/page-shell';

export const metadata: Metadata = {
  title: 'Terms of Service — Promtify',
  description: 'The terms that govern your use of Promtify templates and plans.',
};

export default function TermsPage() {
  return (
    <PageShell title="Terms of Service" subtitle="Last updated: July 18, 2026" narrow>
      <div className="prose prose-sm dark:prose-invert max-w-none prose-headings:font-semibold">
        <h2>The short version</h2>
        <p>
          One payment unlocks the plan&rsquo;s library for 12 months —
          everything you download or copy during that time is yours to keep
          and use forever. Build anything you like with the templates; just
          don&rsquo;t resell or redistribute the templates themselves. Digital
          goods — all sales are final.
        </p>

        <h2>1. Your account</h2>
        <p>
          You need an account to unlock templates. Keep your credentials to
          yourself — access is personal and non-transferable. We may suspend
          accounts that share paid files, scrape the catalog, or abuse the
          service.
        </p>

        <h2>2. Purchases &amp; access period</h2>
        <p>
          Plans (Basic, Pro, Premium) are <strong>one-time payments</strong> —
          never a recurring subscription. A plan unlocks its template library,
          including new templates added to it, for{' '}
          <strong>12 months from the date of purchase</strong>. Anything you
          download, copy or duplicate during your access period —
          Figma files, prompts, source code — remains{' '}
          <strong>yours to keep and use forever</strong>, including after the
          access period ends. Single-template purchases and the courses
          add-on follow the same model. Payments are processed by Stripe
          (USD) and Razorpay (INR).
        </p>

        <h2>3. License — what you may do</h2>
        <ul>
          <li>
            Use unlocked templates in <strong>unlimited personal and commercial projects</strong>,
            for yourself or your clients.
          </li>
          <li>Modify, combine and build on them however you like.</li>
          <li>Ship products built with them without attribution.</li>
        </ul>

        <h2>4. License — what you may not do</h2>
        <ul>
          <li>
            Resell, redistribute, share or publish the templates themselves
            (Figma files, prompt texts, source zips) — including in template
            packs, marketplaces, or public repositories.
          </li>
          <li>Share your account or paid file links with non-purchasers.</li>
          <li>Scrape or bulk-download the catalog.</li>
        </ul>

        <h2>5. Refunds</h2>
        <p>
          Because templates are digital goods delivered instantly,{' '}
          <strong>all sales are final and purchases are non-refundable</strong>.
          The entire catalog can be browsed and previewed free before buying,
          so you always know exactly what you&rsquo;re getting. If something
          you purchased is broken or inaccessible, email{' '}
          <a href="mailto:support@promtify.dev">support@promtify.dev</a> and
          we&rsquo;ll make it right.
        </p>

        <h2>6. Content &amp; availability</h2>
        <p>
          We add, update and occasionally retire templates. References to
          &ldquo;lifetime&rdquo; on our site refer to the assets you obtain —
          what you download during your access period is yours permanently.
          If Promtify ever shuts down, we&rsquo;ll give you at least 90
          days&rsquo; notice to download everything you&rsquo;ve unlocked.
        </p>

        <h2>7. Liability</h2>
        <p>
          Templates are provided &ldquo;as is.&rdquo; We test everything we
          ship, but you&rsquo;re responsible for how you use it in your
          projects. Our total liability is limited to the amount you paid us.
        </p>

        <h2>8. Changes to these terms</h2>
        <p>
          We&rsquo;ll email you before material changes take effect. Continuing
          to use Promtify after that means you accept the updated terms.
          Questions: <a href="mailto:support@promtify.dev">support@promtify.dev</a>.
        </p>
      </div>
    </PageShell>
  );
}
