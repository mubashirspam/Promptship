import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { betterFetch } from '@better-fetch/fetch';

type Session = {
  user: {
    id: string;
    email: string;
    name?: string;
    role?: string;
  };
  session: {
    token: string;
    expiresAt: Date;
  };
};

// Public routes that don't require authentication
const PUBLIC_ROUTES = ['/', '/pricing', '/blog', '/docs'];
const AUTH_ROUTES = ['/login', '/signup', '/verify'];

// Protected routes for regular users
const USER_ROUTES = ['/dashboard', '/prompts', '/generate', '/history', '/settings', '/templates', '/learn', '/upgrade'];

export async function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || '';
  const { pathname } = request.nextUrl;
  const protocol = hostname.includes('localhost') ? 'http' : 'https';

  // Extract subdomain
  const parts = hostname.split('.');
  const subdomain = parts.length > 1 ? parts[0] : null;

  // Skip middleware for static assets and API routes
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/api/') ||
    pathname.startsWith('/favicon') ||
    pathname.match(/\.(svg|png|jpg|jpeg|gif|webp|ico)$/)
  ) {
    return NextResponse.next();
  }

  // Get session from Better Auth
  let session: Session | null = null;
  try {
    const { data } = await betterFetch<Session>('/api/auth/get-session', {
      baseURL: `${protocol}://${hostname}`,
      headers: {
        cookie: request.headers.get('cookie') || '',
      },
    });
    session = data;
  } catch {
    // No session or error fetching session
    session = null;
  }

  const isAuthenticated = !!session?.user;
  const userRole = session?.user?.role || 'user';
  const isAdmin = userRole === 'admin';

  // ─── ADMIN SUBDOMAIN (admin.mydomain.com) ───────────────────────────────────
  if (subdomain === 'admin') {
    // Redirect auth routes to app subdomain
    if (AUTH_ROUTES.some(route => pathname === route || pathname.startsWith(`${route}/`))) {
      const rootDomain = parts.slice(1).join('.');
      const appUrl = new URL(pathname, `${protocol}://app.${rootDomain}`);
      appUrl.search = request.nextUrl.search;
      return NextResponse.redirect(appUrl);
    }

    // Require authentication for admin subdomain
    if (!isAuthenticated) {
      const rootDomain = parts.slice(1).join('.');
      const loginUrl = new URL('/login', `${protocol}://app.${rootDomain}`);
      loginUrl.searchParams.set('callbackUrl', `${protocol}://${hostname}${pathname}`);
      return NextResponse.redirect(loginUrl);
    }

    // Require admin role
    if (!isAdmin) {
      const rootDomain = parts.slice(1).join('.');
      const dashboardUrl = new URL('/dashboard', `${protocol}://app.${rootDomain}`);
      return NextResponse.redirect(dashboardUrl);
    }

    // Rewrite admin subdomain routes to /admin/* path
    if (!pathname.startsWith('/admin')) {
      const url = request.nextUrl.clone();
      url.pathname = `/admin${pathname === '/' ? '' : pathname}`;
      return NextResponse.rewrite(url);
    }

    return NextResponse.next();
  }

  // ─── APP SUBDOMAIN or ROOT (app.mydomain.com or localhost) ──────────────────
  
  // Block direct /admin access on app subdomain
  if (pathname.startsWith('/admin')) {
    if (isAdmin && subdomain !== 'admin') {
      // Redirect admins to admin subdomain
      const rootDomain = subdomain === 'app' ? parts.slice(1).join('.') : hostname;
      const adminUrl = new URL('/admin', `${protocol}://admin.${rootDomain}`);
      return NextResponse.redirect(adminUrl);
    }
    // Non-admins get redirected to dashboard
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Public routes - allow access
  if (PUBLIC_ROUTES.some(route => pathname === route || pathname.startsWith(`${route}/`))) {
    // If authenticated user visits auth routes, redirect based on role
    if (isAuthenticated && AUTH_ROUTES.some(route => pathname === route || pathname.startsWith(`${route}/`))) {
      if (isAdmin) {
        const rootDomain = subdomain === 'app' ? parts.slice(1).join('.') : hostname;
        const adminUrl = new URL('/admin', `${protocol}://admin.${rootDomain}`);
        return NextResponse.redirect(adminUrl);
      }
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.next();
  }

  // Auth routes - redirect if already authenticated
  if (AUTH_ROUTES.some(route => pathname === route || pathname.startsWith(`${route}/`))) {
    if (isAuthenticated) {
      if (isAdmin) {
        const rootDomain = subdomain === 'app' ? parts.slice(1).join('.') : hostname;
        const adminUrl = new URL('/admin', `${protocol}://admin.${rootDomain}`);
        return NextResponse.redirect(adminUrl);
      }
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.next();
  }

  // Protected user routes - require authentication
  if (USER_ROUTES.some(route => pathname === route || pathname.startsWith(`${route}/`))) {
    if (!isAuthenticated) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // If admin tries to access user routes on app subdomain, allow it
    // (admins can use both interfaces)
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
