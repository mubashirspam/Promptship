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
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { Tier } from '@/lib/utils/constants';

// ─── App portal (app.promtify.dev) ───────────────────────────

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  tier: Tier | 'all';
  badge?: string;
}

export const appNavigation: NavItem[] = [
  {
    title: 'Home',
    href: '/dashboard',
    icon: Home,
    tier: 'all',
  },
  {
    title: 'Prompts',
    href: '/prompts',
    icon: FileText,
    tier: 'all',
    badge: '100+',
  },
  {
    title: 'Generate',
    href: '/generate',
    icon: Sparkles,
    tier: 'pro',
  },
  {
    title: 'Learn',
    href: '/learn',
    icon: GraduationCap,
    tier: 'pro',
  },
  {
    title: 'Templates',
    href: '/templates',
    icon: Layout,
    tier: 'starter',
    badge: 'NEW',
  },
  {
    title: 'History',
    href: '/history',
    icon: History,
    tier: 'all',
  },
];

export const upgradeItem: NavItem = {
  title: 'Premium',
  href: '/upgrade',
  icon: Gem,
  tier: 'all',
  badge: 'Upgrade',
};

export const settingsItem: NavItem = {
  title: 'Settings',
  href: '/settings',
  icon: Settings,
  tier: 'all',
};

// ─── Admin portal (admin.promtify.dev) ───────────────────────
// Relative paths on the admin subdomain.
// The proxy rewrites / → /admin, /prompts → /admin/prompts, etc.
export const adminNavigation = [
  {
    title: 'Dashboard',
    href: '/',
    icon: LayoutDashboard,
  },
  {
    title: 'Prompts',
    href: '/prompts',
    icon: FileText,
  },
  {
    title: 'Users',
    href: '/users',
    icon: Users,
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
  { title: 'Features', href: '/#features' },
  { title: 'Pricing', href: '/pricing' },
  { title: 'Blog', href: '/blog' },
  { title: 'Docs', href: '/docs' },
];
