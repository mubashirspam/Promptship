import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth/session';
import { siteConfig } from '@/config/site';
import { AppShell } from '@/components/layout/app-shell';

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  // Admins belong on the admin subdomain — proxy already blocks most paths,
  // but handle the case where an admin lands on app subdomain directly.
  const role = (session.user as { role?: string }).role;
  if (role === 'admin') {
    redirect(siteConfig.adminUrl);
  }

  return <AppShell>{children}</AppShell>;
}
