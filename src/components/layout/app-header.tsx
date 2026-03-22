'use client';

import { Menu, Search, LogOut, Settings } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { CreditBadge } from '@/components/shared/credit-badge';
import { ThemeToggle } from '@/components/shared/theme-toggle';
import { useAuth } from '@/hooks/use-auth';
import { authClient } from '@/lib/auth/client';
import { cn } from '@/lib/utils';
import { useUIStore } from '@/stores/ui-store';

export function AppHeader({ className }: { className?: string }) {
  const router = useRouter();
  const { toggleSidebar } = useUIStore();
  const { user } = useAuth();

  const typedUser = user as Record<string, unknown> | null;
  const userName = (typedUser?.name as string) ?? 'User';
  const userEmail = (typedUser?.email as string) ?? '';
  const userImage = typedUser?.image as string | undefined;
  const userInitial = userName.charAt(0).toUpperCase();

  async function handleSignOut() {
    await authClient.signOut();
    router.push('/login');
  }

  return (
    <header
      className={cn(
        'sticky top-0 z-50 flex h-14 items-center gap-4 border-b bg-background px-4',
        className,
      )}
    >
      {/* Mobile sidebar toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={toggleSidebar}
      >
        <Menu className="size-5" />
        <span className="sr-only">Toggle sidebar</span>
      </Button>

      {/* Search */}
      <div className="relative hidden sm:block">
        <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search..."
          className="w-48 pl-8 lg:w-64"
        />
      </div>

      {/* Right-side actions */}
      <div className="ml-auto flex items-center gap-3">
        <ThemeToggle />
        <CreditBadge />

        {/* User dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar size="sm">
                {userImage && <AvatarImage src={userImage} alt={userName} />}
                <AvatarFallback>{userInitial}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-56">
            <div className="px-2 py-1.5">
              <p className="text-sm font-medium leading-none">{userName}</p>
              {userEmail && (
                <p className="mt-1 text-xs text-muted-foreground">
                  {userEmail}
                </p>
              )}
            </div>

            <DropdownMenuSeparator />

            <DropdownMenuItem asChild>
              <Link href="/settings">
                <Settings className="mr-2 size-4" />
                Settings
              </Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem onSelect={handleSignOut}>
              <LogOut className="mr-2 size-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
