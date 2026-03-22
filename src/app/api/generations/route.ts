import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { generations } from '@/lib/db/schema';
import { eq, desc, and } from 'drizzle-orm';
import { getSession } from '@/lib/auth/session';

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
        { status: 401 }
      );
    }

    const { searchParams } = request.nextUrl;
    const page = Number(searchParams.get('page') || '1');
    const pageSize = Number(searchParams.get('pageSize') || '20');
    const framework = searchParams.get('framework');

    const conditions = [eq(generations.userId, session.user.id)];
    if (framework) {
      conditions.push(eq(generations.framework, framework));
    }

    const items = await db
      .select()
      .from(generations)
      .where(and(...conditions))
      .orderBy(desc(generations.createdAt))
      .limit(pageSize)
      .offset((page - 1) * pageSize);

    return NextResponse.json({
      success: true,
      data: {
        items,
        page,
        pageSize,
        hasMore: items.length === pageSize,
      },
    });
  } catch (error) {
    console.error('Generations fetch error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'FETCH_FAILED', message: 'Failed to fetch generations' } },
      { status: 500 }
    );
  }
}
