import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth/session';
import { AdminSidebar } from '@/components/layout/admin-sidebar';
import { siteConfig } from '@/config/site';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect(`${siteConfig.appUrl}/login?callbackUrl=/admin`);
  }

  // Only allow admin role
  if ((session.user as { role?: string }).role !== 'admin') {
    redirect(`${siteConfig.appUrl}/dashboard`);
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto p-6">{children}</main>
    </div>
  );
}
