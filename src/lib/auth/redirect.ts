const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'lvh.me:3000';
// A port in the root domain means local dev over http; real domains are https
const protocol = rootDomain.includes(':') ? 'http' : 'https';

/**
 * Get the appropriate redirect URL based on user role and subdomain setup.
 * Identical behavior in every environment — only NEXT_PUBLIC_ROOT_DOMAIN differs.
 */
export function getRedirectUrl(user: { role?: string } | null, callbackUrl?: string): string {
  if (!user) {
    return '/login';
  }

  // If there's a callback URL, use it
  if (callbackUrl) {
    return callbackUrl;
  }

  // Admin users go to the admin subdomain root (proxy rewrites / → /admin)
  if ((user.role || 'user') === 'admin') {
    return `${protocol}://admin.${rootDomain}/`;
  }

  return `${protocol}://app.${rootDomain}/dashboard`;
}

/**
 * Get the login URL with proper callback
 */
export function getLoginUrl(callbackUrl?: string): string {
  const baseUrl = `${protocol}://app.${rootDomain}/login`;

  if (callbackUrl) {
    return `${baseUrl}?callbackUrl=${encodeURIComponent(callbackUrl)}`;
  }

  return baseUrl;
}

/**
 * Check if current subdomain matches user role
 */
export function isCorrectSubdomain(user: { role?: string } | null, hostname: string): boolean {
  if (!user) return true;

  const rootWithoutPort = rootDomain.split(':')[0];
  const hostWithoutPort = hostname.split(':')[0];
  const subdomain = hostWithoutPort.endsWith(`.${rootWithoutPort}`)
    ? hostWithoutPort.slice(0, -(rootWithoutPort.length + 1))
    : null;
  const isAdmin = user.role === 'admin';

  // Admins may use both portals; regular users belong on app.* or the root domain
  if (isAdmin && (subdomain === 'admin' || subdomain === 'app' || subdomain === null)) return true;
  if (!isAdmin && (subdomain === 'app' || subdomain === null)) return true;

  return false;
}
