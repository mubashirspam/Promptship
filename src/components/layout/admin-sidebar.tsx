'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowLeft, ChevronLeft, ChevronRight, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/shared/logo';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { adminNavigation } from '@/config/navigation';
import { siteConfig } from '@/config/site';
import { useUIStore } from '@/stores/ui-store';
import { authClient } from '@/lib/auth/client';

export function AdminSidebar() {
  const rawPathname = usePathname();
  const { sidebarOpen, toggleSidebar } = useUIStore();

  async function handleLogout() {
    await authClient.signOut();
    // Cross-subdomain redirect: router.push() won't cross origins
    window.location.href = `${siteConfig.appUrl}/login`;
  }

  // Strip /admin prefix so nav hrefs (/, /prompts, /users) match correctly
  const pathname = rawPathname.replace(/^\/admin/, '') || '/';

  return (
    <aside
      className={cn(
        'flex h-screen flex-col border-r bg-background transition-all duration-300',
        sidebarOpen ? 'w-64' : 'w-16'
      )}
    >
      {/* Logo & collapse */}
      <div className="flex h-14 items-center justify-between px-3">
        <Logo showText={sidebarOpen} />
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={toggleSidebar}
          className="hidden lg:flex"
        >
          {sidebarOpen ? (
            <ChevronLeft className="size-4" />
          ) : (
            <ChevronRight className="size-4" />
          )}
          <span className="sr-only">Toggle sidebar</span>
        </Button>
      </div>

      {sidebarOpen && (
        <div className="px-3 pb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Admin Panel
          </span>
        </div>
      )}

      <Separator />

      {/* Navigation links */}
      <nav className="flex-1 overflow-y-auto px-2 py-3">
        <ul className="flex flex-col gap-1">
          {adminNavigation.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                    !sidebarOpen && 'justify-center px-2'
                  )}
                >
                  <item.icon className="size-4 shrink-0" />
                  {sidebarOpen && <span>{item.title}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <Separator />

      {/* Back to app — cross-subdomain, use <a> */}
      <div className="p-2">
        <a
          href={`${siteConfig.appUrl}/dashboard`}
          className={cn(
            'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground',
            !sidebarOpen && 'justify-center px-2'
          )}
        >
          <ArrowLeft className="size-4 shrink-0" />
          {sidebarOpen && <span>Back to App</span>}
        </a>

        <button
          onClick={handleLogout}
          className={cn(
            'mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive',
            !sidebarOpen && 'justify-center px-2'
          )}
        >
          <LogOut className="size-4 shrink-0" />
          {sidebarOpen && <span>Log Out</span>}
        </button>
      </div>
    </aside>
  );
}
