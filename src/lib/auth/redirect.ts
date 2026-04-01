/**
 * Get the appropriate redirect URL based on user role and subdomain setup
 */
export function getRedirectUrl(user: { role?: string } | null, callbackUrl?: string): string {
  if (!user) {
    return '/login';
  }

  const role = user.role || 'user';
  const isAdmin = role === 'admin';

  // If there's a callback URL, use it
  if (callbackUrl) {
    return callbackUrl;
  }

  // Determine base URL based on environment
  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'localhost:3000';
  const protocol = rootDomain.includes('localhost') ? 'http' : 'https';

  // Admin users go to admin subdomain
  if (isAdmin) {
    return `${protocol}://admin.${rootDomain}/admin`;
  }

  // Regular users go to app subdomain or dashboard
  if (rootDomain.includes('localhost')) {
    return '/dashboard';
  }

  return `${protocol}://app.${rootDomain}/dashboard`;
}

/**
 * Get the login URL with proper callback
 */
export function getLoginUrl(callbackUrl?: string): string {
  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'localhost:3000';
  const protocol = rootDomain.includes('localhost') ? 'http' : 'https';
  
  const baseUrl = rootDomain.includes('localhost') 
    ? '/login' 
    : `${protocol}://app.${rootDomain}/login`;

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

  const parts = hostname.split('.');
  const subdomain = parts.length > 1 ? parts[0] : null;
  const isAdmin = user.role === 'admin';

  // Admin should be on admin subdomain (in production)
  if (isAdmin && subdomain === 'admin') return true;
  
  // Regular users should be on app subdomain or root
  if (!isAdmin && (subdomain === 'app' || subdomain === null)) return true;

  // In localhost, any subdomain is fine
  if (hostname.includes('localhost')) return true;

  return false;
}
