import {
  Home,
  FileText,
  Sparkles,
  GraduationCap,
  Layout,
  History,
  Gem,
  Settings,
  LayoutDashboard,
  Users,
  BarChart3,
  BookOpen,
  CreditCard,
  Package,
  Store,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

// ─── App portal (app.promtify.dev) ───────────────────────────

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
  /** true = surfaced in the sidebar but routes to a coming-soon screen */
  comingSoon?: boolean;
}

export const appNavigation: NavItem[] = [
  {
    title: 'Home',
    href: '/dashboard',
    icon: Home,
  },
  // Prompts and Templates were two views of the same catalog — Templates is
  // now the single entry point, with the kind tabs (Figma / AI Prompts / Code)
  // covering what the Prompts section used to show.
  {
    title: 'Templates',
    href: '/templates',
    icon: Layout,
    badge: 'NEW',
  },
  {
    title: 'Courses',
    href: '/learn',
    icon: GraduationCap,
    comingSoon: true,
  },
  {
    title: 'Generate',
    href: '/generate',
    icon: Sparkles,
    comingSoon: true,
  },
  {
    title: 'Marketplace',
    href: '/marketplace',
    icon: Store,
    comingSoon: true,
  },
  {
    title: 'History',
    href: '/history',
    icon: History,
  },
];

export const upgradeItem: NavItem = {
  title: 'Premium',
  href: '/upgrade',
  icon: Gem,
  badge: 'Upgrade',
};

export const settingsItem: NavItem = {
  title: 'Settings',
  href: '/settings',
  icon: Settings,
};

// ─── Admin portal (admin.promtify.dev) ───────────────────────
// Relative paths on the admin subdomain.
// The proxy rewrites / → /admin, /templates → /admin/templates, etc.
export const adminNavigation = [
  {
    title: 'Dashboard',
    href: '/',
    icon: LayoutDashboard,
  },
  {
    title: 'Templates',
    href: '/templates',
    icon: FileText,
  },
  {
    title: 'Categories',
    href: '/categories',
    icon: Package,
  },
  {
    title: 'Users',
    href: '/users',
    icon: Users,
  },
  {
    title: 'Plans & Pricing',
    href: '/plans',
    icon: CreditCard,
  },
  {
    title: 'Blog',
    href: '/blog',
    icon: BookOpen,
  },
  {
    title: 'Courses',
    href: '/courses',
    icon: Package,
  },
  {
    title: 'Orders',
    href: '/orders',
    icon: CreditCard,
  },
  {
    title: 'Analytics',
    href: '/analytics',
    icon: BarChart3,
  },
  {
    title: 'Settings',
    href: '/settings',
    icon: Settings,
  },
];

// ─── Marketing (promtify.dev) ────────────────────────────────
export const marketingNavigation = [
  { title: 'Templates', href: '/templates' },
  { title: 'Features', href: '/#features' },
  { title: 'Pricing', href: '/pricing' },
  { title: 'Blog', href: '/blog' },
];
