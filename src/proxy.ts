import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Subdomain routing strategy (identical topology in every environment):
 *   {root}           → (marketing) public pages
 *   app.{root}       → (app)/app/* user portal + (auth) login/signup/verify
 *   admin.{root}     → (admin)/admin/* admin portal
 *
 * Environments differ only by NEXT_PUBLIC_ROOT_DOMAIN:
 *   local       lvh.me:3000          (public DNS → 127.0.0.1, wildcard subdomains)
 *   staging     staging.promtify.dev
 *   production  promtify.dev
 *
 * Both app.* and admin.* use structural rewrites (/x → /app/x, /admin/x), so
 * subdomains are isolated by construction — new pages need no proxy changes.
 * The proxy only checks cookie *presence*; real session/role validation happens
 * server-side in layouts and API routes.
 */

const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN ||
                    (process.env.NODE_ENV === 'production' ? 'promtify.dev' : 'lvh.me:3000');

function getSubdomain(host: string): string | null {
  // Strip port for comparison
  const hostWithoutPort = host.split(':')[0];
  const rootWithoutPort = ROOT_DOMAIN.split(':')[0];

  if (hostWithoutPort.endsWith(`.${rootWithoutPort}`)) {
    const sub = hostWithoutPort.replace(`.${rootWithoutPort}`, '');
    if (sub && sub !== 'www') return sub;
  }

  return null;
}

// (auth) group routes — live on the app subdomain, always public there
const authRoutes = ['/login', '/signup', '/verify'];

export async function proxy(request: NextRequest) {
  // Vercel provides x-forwarded-host in production
  const host = request.headers.get('x-forwarded-host') ||
               request.headers.get('host') ||
               ROOT_DOMAIN;
  const { pathname } = request.nextUrl;
  const subdomain = getSubdomain(host);

  // Static assets (/logo.svg, fonts, images from /public) are served at the
  // root path and must never be auth-gated or rewritten
  if (/\.\w+$/.test(pathname) && !pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // Cookie prefix is 'ps' (set in src/lib/auth/index.ts → advanced.cookiePrefix)
  const sessionToken =
    request.cookies.get('ps.session_token')?.value ||
    request.cookies.get('__Secure-ps.session_token')?.value;

  const isAuthRoute = authRoutes.some((r) => pathname.startsWith(r));

  // ─── ADMIN SUBDOMAIN (admin.{root}) ────────────────────────────
  if (subdomain === 'admin') {
    // API routes (auth sign-out, etc.) must pass through without rewriting
    if (pathname.startsWith('/api/')) {
      return NextResponse.next();
    }

    // Must be authenticated; role=admin is enforced in (admin)/layout.tsx
    if (!sessionToken) {
      const loginUrl = new URL('/login', `${request.nextUrl.protocol}//app.${ROOT_DOMAIN}`);
      loginUrl.searchParams.set('callbackUrl', request.url);
      return NextResponse.redirect(loginUrl);
    }

    // Structural rewrite: /x → /admin/x (maps to (admin)/admin/ route group)
    const url = request.nextUrl.clone();
    url.pathname = pathname === '/' ? '/admin' : `/admin${pathname}`;
    return NextResponse.rewrite(url);
  }

  // ─── APP SUBDOMAIN (app.{root}) ────────────────────────────────
  if (subdomain === 'app') {
    // (auth) pages pass through un-rewritten. The auth layout verifies the
    // session server-side and redirects if already logged in — the proxy
    // cannot validate token validity, only presence.
    if (isAuthRoute || pathname.startsWith('/api/')) {
      return NextResponse.next();
    }

    if (!sessionToken) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = '/login';
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // '/' has no app page — land on the dashboard
    if (pathname === '/') {
      const url = request.nextUrl.clone();
      url.pathname = '/dashboard';
      return NextResponse.redirect(url);
    }

    // Structural rewrite: /x → /app/x (maps to (app)/app/ pages).
    // Marketing/admin paths 404 here by construction — subdomains are isolated.
    const url = request.nextUrl.clone();
    url.pathname = `/app${pathname}`;
    return NextResponse.rewrite(url);
  }

  // ─── MAIN DOMAIN ({root}) ──────────────────────────────────────
  // Logged-in users on the root domain → send to app subdomain.
  // The app layout will then redirect admins onward to admin subdomain.
  if (sessionToken && pathname === '/') {
    return NextResponse.redirect(
      new URL('/dashboard', `${request.nextUrl.protocol}//app.${ROOT_DOMAIN}`)
    );
  }

  // Auth pages live on the app subdomain only
  if (isAuthRoute) {
    return NextResponse.redirect(
      new URL(pathname + request.nextUrl.search, `${request.nextUrl.protocol}//app.${ROOT_DOMAIN}`)
    );
  }

  // Block direct access to the internal /app and /admin path prefixes
  if (pathname.startsWith('/app/') || pathname === '/app') {
    return NextResponse.redirect(
      new URL(pathname.replace(/^\/app/, '') || '/', `${request.nextUrl.protocol}//app.${ROOT_DOMAIN}`)
    );
  }
  if (pathname.startsWith('/admin')) {
    return NextResponse.redirect(
      new URL(pathname.replace(/^\/admin/, '') || '/', `${request.nextUrl.protocol}//admin.${ROOT_DOMAIN}`)
    );
  }

  // Legacy convenience redirects for old deep links (correctness does not
  // depend on this list — unknown app paths simply 404 on the root domain)
  const legacyAppRoutes = ['/dashboard', '/prompts', '/generate', '/learn', '/history', '/settings', '/templates', '/upgrade'];
  if (legacyAppRoutes.some((r) => pathname.startsWith(r))) {
    return NextResponse.redirect(
      new URL(pathname, `${request.nextUrl.protocol}//app.${ROOT_DOMAIN}`)
    );
  }

  // Marketing pages and API routes pass through on the main domain
  return NextResponse.next();
}

export const config = {
  // Skip _next internals and any dotted path (static files) entirely
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.\\w+$).*)',
  ],
};
