import { describe, it, expect } from 'vitest';
import { NextRequest } from 'next/server';
import { proxy } from './proxy';

// NEXT_PUBLIC_ROOT_DOMAIN is pinned to lvh.me:3000 in vitest.config.ts —
// the same value local dev uses, so tests exercise the real topology.

const ROOT = 'lvh.me:3000';

function run(host: string, path: string, opts: { cookie?: boolean } = {}) {
  const headers: Record<string, string> = { host };
  if (opts.cookie) headers.cookie = 'ps.session_token=test-token';
  return proxy(new NextRequest(`http://${host}${path}`, { headers }));
}

function location(res: Response) {
  return res.headers.get('location');
}

function rewrite(res: Response) {
  const target = res.headers.get('x-middleware-rewrite');
  return target ? new URL(target).pathname : null;
}

describe('root domain', () => {
  it('passes marketing pages through anonymously', async () => {
    const res = await run(ROOT, '/pricing');
    expect(location(res)).toBeNull();
    expect(rewrite(res)).toBeNull();
  });

  it('sends logged-in users on / to the app dashboard', async () => {
    const res = await run(ROOT, '/', { cookie: true });
    expect(location(res)).toBe(`http://app.${ROOT}/dashboard`);
  });

  it('leaves anonymous users on /', async () => {
    const res = await run(ROOT, '/');
    expect(location(res)).toBeNull();
  });

  it('redirects auth routes to the app subdomain', async () => {
    const res = await run(ROOT, '/login');
    expect(location(res)).toBe(`http://app.${ROOT}/login`);
  });

  it('redirects direct /app/* access to the app subdomain', async () => {
    const res = await run(ROOT, '/app/dashboard');
    expect(location(res)).toBe(`http://app.${ROOT}/dashboard`);
  });

  it('redirects /admin/* to the admin subdomain', async () => {
    const res = await run(ROOT, '/admin/users');
    expect(location(res)).toBe(`http://admin.${ROOT}/users`);
  });

  it('redirects legacy app deep links to the app subdomain', async () => {
    for (const path of ['/dashboard', '/templates', '/upgrade']) {
      const res = await run(ROOT, path);
      expect(location(res)).toBe(`http://app.${ROOT}${path}`);
    }
  });
});

describe('app subdomain', () => {
  it('lets auth routes through without a session', async () => {
    for (const path of ['/login', '/signup', '/verify']) {
      const res = await run(`app.${ROOT}`, path);
      expect(location(res)).toBeNull();
      expect(rewrite(res)).toBeNull();
    }
  });

  it('lets API routes through without a session', async () => {
    const res = await run(`app.${ROOT}`, '/api/auth/callback/google');
    expect(location(res)).toBeNull();
  });

  it('redirects unauthenticated page requests to /login with callback', async () => {
    const res = await run(`app.${ROOT}`, '/dashboard');
    const loc = new URL(location(res)!);
    expect(loc.pathname).toBe('/login');
    expect(loc.searchParams.get('callbackUrl')).toBe('/dashboard');
  });

  it('redirects / to /dashboard for authenticated users', async () => {
    const res = await run(`app.${ROOT}`, '/', { cookie: true });
    expect(new URL(location(res)!).pathname).toBe('/dashboard');
  });

  it('structurally rewrites pages into the /app segment', async () => {
    const res = await run(`app.${ROOT}`, '/dashboard', { cookie: true });
    expect(rewrite(res)).toBe('/app/dashboard');
  });

  it('rewrites unknown/new pages without proxy changes', async () => {
    const res = await run(`app.${ROOT}`, '/some/future/page', { cookie: true });
    expect(rewrite(res)).toBe('/app/some/future/page');
  });

  it('isolates marketing pages (they 404 via the /app rewrite)', async () => {
    const res = await run(`app.${ROOT}`, '/pricing', { cookie: true });
    expect(rewrite(res)).toBe('/app/pricing');
  });
});

describe('admin subdomain', () => {
  it('redirects unauthenticated users to app login with callback', async () => {
    const res = await run(`admin.${ROOT}`, '/users');
    const loc = new URL(location(res)!);
    expect(loc.host).toBe(`app.${ROOT}`);
    expect(loc.pathname).toBe('/login');
    expect(loc.searchParams.get('callbackUrl')).toContain(`admin.${ROOT}`);
  });

  it('rewrites / to /admin', async () => {
    const res = await run(`admin.${ROOT}`, '/', { cookie: true });
    expect(rewrite(res)).toBe('/admin');
  });

  it('rewrites pages into the /admin segment', async () => {
    const res = await run(`admin.${ROOT}`, '/users', { cookie: true });
    expect(rewrite(res)).toBe('/admin/users');
  });

  it('passes API routes through un-rewritten', async () => {
    const res = await run(`admin.${ROOT}`, '/api/auth/sign-out', { cookie: true });
    expect(rewrite(res)).toBeNull();
    expect(location(res)).toBeNull();
  });
});

describe('static assets', () => {
  it('never gates or rewrites public files on any subdomain', async () => {
    for (const host of [ROOT, `app.${ROOT}`, `admin.${ROOT}`]) {
      const res = await run(host, '/logo.png');
      expect(location(res)).toBeNull();
      expect(rewrite(res)).toBeNull();
    }
  });

  it('still gates API routes (dotted check must not catch /api)', async () => {
    const res = await run(`app.${ROOT}`, '/api/user.settings');
    expect(location(res)).toBeNull(); // /api/* passes through by design
  });
});

describe('secure cookie variant', () => {
  it('accepts the __Secure- prefixed session cookie', async () => {
    const req = new NextRequest(`http://app.${ROOT}/dashboard`, {
      headers: { host: `app.${ROOT}`, cookie: '__Secure-ps.session_token=tok' },
    });
    const res = await proxy(req);
    expect(rewrite(res)).toBe('/app/dashboard');
  });
});
