'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { AppHeader } from '@/components/layout/app-header';
import { MobileNav } from '@/components/layout/mobile-nav';
import { useUIStore } from '@/stores/ui-store';
import { useAuth } from '@/hooks/use-auth';
import { getLoginUrl } from '@/lib/auth/redirect';
import { cn } from '@/lib/utils';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { sidebarOpen } = useUIStore();
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      const loginUrl = getLoginUrl(pathname);
      router.push(loginUrl);
    }
  }, [isAuthenticated, isLoading, router, pathname]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop sidebar (fixed positioned) */}
      <AppSidebar />

      {/* Mobile slide nav */}
      <MobileNav className="lg:hidden" />

      {/* Main content – left margin matches fixed sidebar width */}
      <div
        className={cn(
          'flex flex-col transition-all duration-300',
          sidebarOpen ? 'lg:ml-[260px]' : 'lg:ml-16'
        )}
      >
        <AppHeader />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
