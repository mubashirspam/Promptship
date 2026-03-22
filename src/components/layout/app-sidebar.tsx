'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronLeft, ChevronRight, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  hasTierAccess,
  TIER_LABELS,
  TIER_COLORS,
  TIER_CREDITS,
  type Tier,
} from '@/lib/utils/constants';
import { Logo } from '@/components/shared/logo';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { appNavigation, upgradeItem, settingsItem } from '@/config/navigation';
import { useUIStore } from '@/stores/ui-store';
import { useAuth } from '@/hooks/use-auth';
import { useCredits } from '@/hooks/use-credits';

export function AppSidebar() {
  const pathname = usePathname();
  const { sidebarOpen, toggleSidebar } = useUIStore();
  const { user } = useAuth();
  const { credits } = useCredits();

  const tier = ((user as any)?.tier ?? 'free') as Tier;
  const userName = (user as any)?.name as string | null;
  const userImage = (user as any)?.image as string | null;
  const maxCredits = TIER_CREDITS[tier];
  const creditPercent = maxCredits > 0 ? Math.min((credits / maxCredits) * 100, 100) : 0;

  function isActive(href: string) {
    return pathname === href || (href !== '/dashboard' && pathname.startsWith(href + '/'));
  }

  return (
    <aside
      className={cn(
        'hidden lg:flex fixed inset-y-0 left-0 z-30 flex-col border-r bg-background transition-all duration-300',
        sidebarOpen ? 'w-[260px]' : 'w-16'
      )}
    >
      <div className="flex h-14 items-center justify-between px-3">
        <Logo showText={sidebarOpen} />
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={toggleSidebar}
        >
          {sidebarOpen ? <ChevronLeft className="size-4" /> : <ChevronRight className="size-4" />}
          <span className="sr-only">Toggle sidebar</span>
        </Button>
      </div>

      <Separator />

      {sidebarOpen && (
        <div className="px-3 py-3">
          <div className="flex items-center gap-3 rounded-lg bg-muted/50 px-3 py-2.5">
            <Avatar size="sm">
              <AvatarImage src={userImage ?? undefined} />
              <AvatarFallback>
                {userName?.charAt(0)?.toUpperCase() ?? 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium leading-tight">
                {userName ?? 'User'}
              </p>
              <div className="mt-0.5 flex items-center gap-1.5">
                <span className="size-1.5 shrink-0 rounded-full bg-emerald-500" />
                <span
                  className={cn(
                    'truncate text-xs font-medium',
                    TIER_COLORS[tier]
                  )}
                >
                  {TIER_LABELS[tier]}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {!sidebarOpen && (
        <div className="flex justify-center py-3">
          <Avatar size="sm">
            <AvatarImage src={userImage ?? undefined} />
            <AvatarFallback>
              {userName?.charAt(0)?.toUpperCase() ?? 'U'}
            </AvatarFallback>
          </Avatar>
        </div>
      )}

      <Separator />

      <nav className="flex-1 overflow-y-auto px-2 py-3">
        <ul className="flex flex-col gap-1">
          {appNavigation.map((item) => {
            const accessible = hasTierAccess(tier, item.tier);
            const active = isActive(item.href);
            const href = accessible ? item.href : '/upgrade';

            return (
              <li key={item.href}>
                <Link
                  href={href}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    active && accessible
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                    !accessible && 'opacity-50',
                    !sidebarOpen && 'justify-center px-2'
                  )}
                >
                  {accessible ? (
                    <item.icon className="size-4 shrink-0" />
                  ) : (
                    <Lock className="size-4 shrink-0" />
                  )}
                  {sidebarOpen && (
                    <>
                      <span className="flex-1 truncate">{item.title}</span>
                      {item.badge && accessible && (
                        <span
                          className={cn(
                            'rounded-md px-1.5 py-0.5 text-[10px] font-semibold leading-none',
                            item.badge === 'NEW'
                              ? 'bg-emerald-500/10 text-emerald-500'
                              : 'bg-muted text-muted-foreground'
                          )}
                        >
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="mt-auto px-2 pb-2">
        {tier === 'free' && (
          <>
            <Link
              href={upgradeItem.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                'text-purple-500 hover:bg-purple-500/10',
                isActive(upgradeItem.href) && 'bg-purple-500/10',
                !sidebarOpen && 'justify-center px-2'
              )}
            >
              <upgradeItem.icon className="size-4 shrink-0" />
              {sidebarOpen && (
                <>
                  <span className="flex-1 truncate">{upgradeItem.title}</span>
                  <span className="rounded-md bg-purple-500/10 px-1.5 py-0.5 text-[10px] font-semibold leading-none text-purple-500">
                    {upgradeItem.badge}
                  </span>
                </>
              )}
            </Link>
            <Separator className="my-2" />
          </>
        )}

        {sidebarOpen && (
          <div className="mb-2 rounded-lg bg-muted/50 px-3 py-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-muted-foreground">Credits</span>
              <span className="font-semibold tabular-nums">
                {credits} / {maxCredits}
              </span>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
              <div
                className={cn(
                  'h-full rounded-full transition-all duration-500',
                  creditPercent > 80
                    ? 'bg-emerald-500'
                    : creditPercent > 40
                      ? 'bg-primary'
                      : 'bg-amber-500'
                )}
                style={{ width: `${creditPercent}%` }}
              />
            </div>
          </div>
        )}

        <Link
          href={settingsItem.href}
          className={cn(
            'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
            isActive(settingsItem.href)
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:bg-muted hover:text-foreground',
            !sidebarOpen && 'justify-center px-2'
          )}
        >
          <settingsItem.icon className="size-4 shrink-0" />
          {sidebarOpen && <span>{settingsItem.title}</span>}
        </Link>
      </div>
    </aside>
  );
}
