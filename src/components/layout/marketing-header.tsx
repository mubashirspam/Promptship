'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { Logo } from '@/components/shared/logo';
import { Button } from '@/components/ui/button';
import { marketingNavigation } from '@/config/navigation';
import { siteConfig } from '@/config/site';

export function MarketingHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo />

        {/* Desktop navigation */}
        <nav className="hidden items-center gap-6 md:flex">
          {marketingNavigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.title}
            </Link>
          ))}
        </nav>

        {/* Desktop actions — link to app subdomain */}
        <div className="hidden items-center gap-2 md:flex">
          <Button variant="ghost" size="sm" asChild>
            <a href={`${siteConfig.appUrl}/login`}>Sign In</a>
          </Button>
          <Button size="sm" asChild>
            <a href={`${siteConfig.appUrl}/signup`}>Get Started</a>
          </Button>
        </div>

        {/* Mobile hamburger */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          <span className="sr-only">Toggle menu</span>
        </Button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t bg-background md:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4">
            {marketingNavigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                {item.title}
              </Link>
            ))}
            <div className="mt-3 flex flex-col gap-2 border-t pt-3">
              <Button variant="outline" size="sm" asChild>
                <a href={`${siteConfig.appUrl}/login`}>Sign In</a>
              </Button>
              <Button size="sm" asChild>
                <a href={`${siteConfig.appUrl}/signup`}>Get Started</a>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
