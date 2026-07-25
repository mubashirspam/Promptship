import Link from 'next/link';
import { Logo } from '@/components/shared/logo';
import { Separator } from '@/components/ui/separator';
import { siteConfig } from '@/config/site';

const footerLinks = {
  Product: [
    { title: 'Features', href: '/#features' },
    { title: 'Pricing', href: '/pricing' },
    { title: 'Changelog', href: '/changelog' },
  ],
  Company: [
    { title: 'About', href: '/about' },
    { title: 'Blog', href: '/blog' },
    { title: 'Contact', href: '/contact' },
  ],
  Legal: [
    { title: 'Privacy', href: '/privacy' },
    { title: 'Terms', href: '/terms' },
  ],
};

const socialLinks = [
  { title: 'X', href: siteConfig.links.x },
  { title: 'GitHub', href: siteConfig.links.github },
  { title: 'Discord', href: siteConfig.links.discord },
  { title: 'Bluesky', href: siteConfig.links.bluesky },
  { title: 'LinkedIn', href: siteConfig.links.linkedin },
];

// Dark footer regardless of the site's light/dark theme toggle — matches
// the permanently-dark header/hero so the page never ends on a light seam.
export function MarketingFooter() {
  return (
    <footer className="border-t border-white/10 bg-[#0a0a0a]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <Logo textClassName="text-2xl font-bold text-white" />
            <p className="mt-3 max-w-xs text-sm text-slate-400">
              Premium Figma Kits, AI Prompts and Code Starters. Pay once, own
              it forever.
            </p>
            <div className="mt-4 flex flex-wrap gap-4">
              {socialLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-slate-400 transition-colors hover:text-white"
                >
                  {link.title}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="mb-3 text-sm font-semibold text-white">
                {category}
              </h3>
              <ul className="flex flex-col gap-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-400 transition-colors hover:text-white"
                    >
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="my-8 bg-white/10" />

        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-xs text-slate-500">
            &copy; {new Date().getFullYear()} Promtify. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
