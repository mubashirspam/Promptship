import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { and, desc, eq, ilike, or, sql } from 'drizzle-orm';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { requireAdmin } from '@/lib/auth/require-admin';

/** GET /api/admin/users?query=&page=&pageSize= */
export async function GET(request: NextRequest) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  try {
    const { searchParams } = request.nextUrl;
    const query = searchParams.get('query')?.trim() ?? '';
    const page = Math.max(1, Number(searchParams.get('page') || '1'));
    const pageSize = Math.min(100, Math.max(1, Number(searchParams.get('pageSize') || '20')));

    const conditions = [];
    if (query) {
      conditions.push(
        or(ilike(users.email, `%${query}%`), ilike(users.name, `%${query}%`))
      );
    }
    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const [items, countResult] = await Promise.all([
      db()
        .select({
          id: users.id,
          email: users.email,
          name: users.name,
          image: users.image,
          role: users.role,
          credits: users.credits,
          emailVerified: users.emailVerified,
          createdAt: users.createdAt,
        })
        .from(users)
        .where(where)
        .orderBy(desc(users.createdAt))
        .limit(pageSize)
        .offset((page - 1) * pageSize),
      db()
        .select({ count: sql<number>`count(*)::int` })
        .from(users)
        .where(where),
    ]);

    const total = countResult[0]?.count ?? 0;
    return NextResponse.json({
      success: true,
      data: {
        items,
        total,
        page,
        pageSize,
        totalPages: Math.max(1, Math.ceil(total / pageSize)),
      },
    });
  } catch (error) {
    console.error('Admin users fetch error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'FETCH_FAILED', message: 'Failed to fetch users' } },
      { status: 500 }
    );
  }
}
