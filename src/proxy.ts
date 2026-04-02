import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Subdomain routing strategy:
 *   promtify.dev          → (marketing) public pages
 *   app.promtify.dev      → (app) authenticated user portal
 *   admin.promtify.dev    → (admin) admin portal
 *
 * Local development:
 *   localhost:3000           → marketing
 *   app.localhost:3000       → app portal
 *   admin.localhost:3000     → admin portal
 */

const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 
                    (process.env.NODE_ENV === 'production' ? 'promtify.dev' : 'localhost:3000');

function getSubdomain(host: string): string | null {
  // Strip port for comparison
  const hostWithoutPort = host.split(':')[0];
  const rootWithoutPort = ROOT_DOMAIN.split(':')[0];

  // localhost special case: app.localhost, admin.localhost
  if (hostWithoutPort.endsWith(`.${rootWithoutPort}`)) {
    const sub = hostWithoutPort.replace(`.${rootWithoutPort}`, '');
    if (sub && sub !== 'www') return sub;
  }

  return null;
}

// Routes on the app subdomain that DON'T require auth (public API, etc.)
const publicAppPaths = ['/api/auth'];

export async function proxy(request: NextRequest) {
  // Vercel provides x-forwarded-host in production
  const host = request.headers.get('x-forwarded-host') || 
               request.headers.get('host') || 
               ROOT_DOMAIN;
  const { pathname } = request.nextUrl;
  const subdomain = getSubdomain(host);

  // Cookie prefix is 'ps' (set in src/lib/auth/index.ts → advanced.cookiePrefix)
  const sessionToken =
    request.cookies.get('ps.session_token')?.value ||
    request.cookies.get('__Secure-ps.session_token')?.value;

  // ─── ADMIN SUBDOMAIN (admin.promtify.dev) ─────────────────────
  if (subdomain === 'admin') {
    // Must be authenticated + admin role
    if (!sessionToken) {
      const loginUrl = new URL('/login', `${request.nextUrl.protocol}//app.${ROOT_DOMAIN}`);
      loginUrl.searchParams.set('callbackUrl', request.url);
      return NextResponse.redirect(loginUrl);
    }

    // Rewrite /anything → /admin/anything (maps to (admin)/admin/ route group)
    // Root / → /admin
    const rewritePath = pathname === '/' ? '/admin' : `/admin${pathname}`;
    const url = request.nextUrl.clone();
    url.pathname = rewritePath;
    return NextResponse.rewrite(url);
  }

  // ─── APP SUBDOMAIN (app.promtify.dev) ──────────────────────────
  if (subdomain === 'app') {
    const isPublicPath = publicAppPaths.some((p) => pathname.startsWith(p));
    const isAuthRoute = ['/login', '/signup', '/verify'].some((r) => pathname.startsWith(r));

    // Auth routes: /login, /signup, /verify — always pass through.
    // The auth layout verifies the session server-side and redirects if already
    // logged in. The proxy must NOT redirect here — it cannot validate whether
    // the session token is actually still valid in the DB.
    if (isAuthRoute) {
      return NextResponse.next();
    }

    // Public paths (API auth callbacks etc.) — pass through
    if (isPublicPath || pathname.startsWith('/api/')) {
      return NextResponse.next();
    }

    // Everything else needs auth
    if (!sessionToken) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = '/login';
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Authenticated — pass through, pages live at (app)/dashboard etc.
    return NextResponse.next();
  }

  // ─── MAIN DOMAIN (promtify.dev) ────────────────────────────────
  // Logged-in users on the root domain → send to app subdomain.
  // The app layout will then redirect admins onward to admin subdomain.
  if (sessionToken && pathname === '/') {
    return NextResponse.redirect(
      new URL('/dashboard', `${request.nextUrl.protocol}//app.${ROOT_DOMAIN}`)
    );
  }

  // Block /admin and app-only routes on the main domain
  if (pathname.startsWith('/admin')) {
    const adminUrl = new URL(pathname.replace('/admin', '') || '/', `${request.nextUrl.protocol}//admin.${ROOT_DOMAIN}`);
    return NextResponse.redirect(adminUrl);
  }

  const appOnlyRoutes = ['/dashboard', '/prompts', '/generate', '/learn', '/history', '/settings'];
  if (appOnlyRoutes.some((r) => pathname.startsWith(r))) {
    const appUrl = new URL(pathname, `${request.nextUrl.protocol}//app.${ROOT_DOMAIN}`);
    return NextResponse.redirect(appUrl);
  }

  // Marketing pages, API routes, docs — pass through on main domain
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public|docs/promptship).*)',
  ],
};
