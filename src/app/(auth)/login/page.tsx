import type { Metadata } from 'next';
import { AuthForm } from '@/components/auth/auth-form';

export const metadata: Metadata = {
  title: 'Sign In - Promtify',
  robots: { index: false, follow: false },
};

/**
 * The email/password form (used by admins) is only revealed when the URL
 * carries the correct secret key: /login?k=<ADMIN_LOGIN_KEY>. The key is
 * checked server-side and never sent to the browser, so a plain visit to
 * /login shows only social sign-in — the admin entry point isn't advertised.
 */
export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ k?: string }>;
}) {
  const { k } = await searchParams;
  const key = process.env.ADMIN_LOGIN_KEY;
  const allowEmailLogin = Boolean(key && k && k === key);

  return <AuthForm allowEmailLogin={allowEmailLogin} />;
}
