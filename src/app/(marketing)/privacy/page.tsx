import type { Metadata } from 'next';
import { PageShell } from '@/components/marketing/page-shell';

export const metadata: Metadata = {
  title: 'Privacy Policy — Promtify',
  description: 'How Promtify collects, uses and protects your data.',
};

export default function PrivacyPage() {
  return (
    <PageShell title="Privacy Policy" subtitle="Last updated: July 18, 2026" narrow>
      <div className="prose prose-sm dark:prose-invert max-w-none prose-headings:font-semibold">
        <h2>What we collect</h2>
        <ul>
          <li>
            <strong>Account data</strong> — your name, email and profile photo,
            provided when you sign up with email/password or through Google or
            GitHub sign-in.
          </li>
          <li>
            <strong>Purchase data</strong> — which plans or templates you
            bought, the payment status, and your plan access period (plan
            purchases grant 12 months of library access; see the Terms). Card and payment details are handled
            entirely by our payment providers (Stripe and Razorpay);{' '}
            <strong>we never see or store your card numbers</strong>.
          </li>
          <li>
            <strong>Usage data</strong> — which templates you view, copy,
            favorite and download. We use this to secure paid content, improve
            the library, and show you your own history.
          </li>
          <li>
            <strong>Cookies</strong> — a session cookie to keep you signed in.
            No third-party advertising cookies, no cross-site tracking.
          </li>
        </ul>

        <h2>How we use it</h2>
        <ul>
          <li>To provide access to the templates and plans you&rsquo;ve unlocked.</li>
          <li>To process payments, prevent fraud and abuse, and enforce download limits.</li>
          <li>To send transactional email (receipts, account notices). Marketing email only ever with your consent, and every message has an unsubscribe link.</li>
          <li>To understand aggregate usage so we know which templates to build next.</li>
        </ul>

        <h2>Where your data lives</h2>
        <p>
          Account and purchase records are stored in our database (Neon,
          hosted on AWS). Template media is served from Cloudflare&rsquo;s CDN.
          Authentication is handled on our own servers; OAuth sign-in shares
          only your basic profile from Google or GitHub.
        </p>

        <h2>What we never do</h2>
        <ul>
          <li>We never sell your personal data. To anyone. Ever.</li>
          <li>We never store your card details.</li>
          <li>We never share your data with third parties beyond the processors named above.</li>
        </ul>

        <h2>Your rights</h2>
        <p>
          You can request a copy of your data, correct it, or delete your
          account and everything tied to it at any time — email{' '}
          <a href="mailto:support@promtify.dev">support@promtify.dev</a> and
          we&rsquo;ll complete it within 30 days. Deleting your account removes
          your personal data; anonymized purchase records are retained where
          required for accounting.
        </p>

        <h2>Changes</h2>
        <p>
          If this policy changes materially we&rsquo;ll notify you by email
          before the change takes effect. Questions? Write to{' '}
          <a href="mailto:support@promtify.dev">support@promtify.dev</a>.
        </p>
      </div>
    </PageShell>
  );
}
