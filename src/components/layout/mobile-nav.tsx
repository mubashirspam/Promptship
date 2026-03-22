'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, LogOut, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/shared/logo';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { appNavigation, settingsItem } from '@/config/navigation';
import {
  hasTierAccess,
  TIER_LABELS,
  TIER_CREDITS,
  type Tier,
} from '@/lib/utils/constants';
import { useAuth } from '@/hooks/use-auth';
import { useCredits } from '@/hooks/use-credits';
import { authClient } from '@/lib/auth/client';

interface MobileNavProps {
  className?: string;
}

export function MobileNav({ className }: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { user } = useAuth();
  const { credits } = useCredits();

  const userName =
    ((user as Record<string, unknown>)?.name as string) ?? 'User';
  const userEmail =
    ((user as Record<string, unknown>)?.email as string) ?? '';
  const userImage = (user as Record<string, unknown>)?.image as
    | string
    | undefined;
  const userTier =
    ((user as Record<string, unknown>)?.tier as Tier) ?? 'free';
  const totalCredits = TIER_CREDITS[userTier];

  const isActive = (href: string) =>
    pathname === href ||
    (href !== '/dashboard' && pathname.startsWith(href + '/'));

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            'fixed left-3 top-3 z-50',
            className
          )}
        >
          <Menu className="size-5" />
          <span className="sr-only">Open menu</span>
        </Button>
      </SheetTrigger>

      <SheetContent side="left" className="w-[280px] p-0">
        <SheetHeader className="p-4 pb-0">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <Logo />
        </SheetHeader>

        {/* User card */}
        <div className="mx-3 mt-4 rounded-xl bg-muted/50 p-3">
          <div className="flex items-center gap-3">
            <Avatar className="size-10">
              <AvatarImage src={userImage} />
              <AvatarFallback>
                {userName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{userName}</p>
              <p className="text-xs text-green-500">
                {TIER_LABELS[userTier]}
              </p>
            </div>
          </div>
        </div>

        <Separator className="my-3" />

        {/* Navigation */}
        <nav className="flex-1 px-2">
          <ul className="flex flex-col gap-0.5">
            {appNavigation.map((item) => {
              const active = isActive(item.href);
              const hasAccess = hasTierAccess(userTier, item.tier);
              const href = hasAccess ? item.href : '/upgrade';

              return (
                <li key={item.href}>
                  <Link
                    href={href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors',
                      active
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                      !hasAccess && 'opacity-50'
                    )}
                  >
                    <item.icon className="size-5" />
                    <span>{item.title}</span>
                    {item.badge && hasAccess && (
                      <span className="ml-auto rounded-full bg-primary/20 px-2 py-0.5 text-xs text-primary">
                        {item.badge}
                      </span>
                    )}
                    {!hasAccess && <Lock className="ml-auto size-4" />}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Credits */}
        <div className="mx-3 mt-4 rounded-xl bg-muted/50 p-4">
          <div className="mb-2 flex items-baseline justify-between text-xs text-muted-foreground">
            <span>Credits</span>
            <span>
              {credits} / {totalCredits}
            </span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all"
              style={{
                width: `${Math.min((credits / totalCredits) * 100, 100)}%`,
              }}
            />
          </div>
        </div>

        <Separator className="my-3" />

        {/* Settings & Logout */}
        <div className="px-2 pb-4">
          <Link
            href={settingsItem.href}
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-muted-foreground hover:bg-accent"
          >
            <settingsItem.icon className="size-5" />
            {settingsItem.title}
          </Link>
          <button
            onClick={async () => {
              await authClient.signOut();
              setOpen(false);
              window.location.href = '/login';
            }}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-muted-foreground hover:bg-accent"
          >
            <LogOut className="size-5" />
            Log out
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
