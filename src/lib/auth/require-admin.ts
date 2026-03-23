import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';

/**
 * Verify the current user is an admin. Returns session or a 403 response.
 */
export async function requireAdmin() {
  const session = await getSession();

  if (!session) {
    return {
      error: NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Not authenticated' } },
        { status: 401 }
      ),
      session: null,
    };
  }

  const role = (session.user as { role?: string }).role;
  if (role !== 'admin') {
    return {
      error: NextResponse.json(
        { success: false, error: { code: 'FORBIDDEN', message: 'Admin access required' } },
        { status: 403 }
      ),
      session: null,
    };
  }

  return { error: null, session };
}
