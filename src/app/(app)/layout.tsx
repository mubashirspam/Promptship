'use client';

import { AppSidebar } from '@/components/layout/app-sidebar';
import { AppHeader } from '@/components/layout/app-header';
import { MobileNav } from '@/components/layout/mobile-nav';
import { useUIStore } from '@/stores/ui-store';
import { cn } from '@/lib/utils';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { sidebarOpen } = useUIStore();

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
