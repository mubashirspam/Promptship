import { headers } from 'next/headers';
import { auth } from '@/lib/auth';

/**
 * Get the current session on the server side.
 * Returns null if not authenticated.
 */
export async function getSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return session;
}

/**
 * Get the current session or throw (for use in API routes).
 * Returns user + session.
 */
export async function requireSession() {
  const session = await getSession();
  if (!session) {
    throw new Error('UNAUTHORIZED');
  }
  return session;
}
