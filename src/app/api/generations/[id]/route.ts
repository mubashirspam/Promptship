import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { generations } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { getSession } from '@/lib/auth/session';

export async function GET(
  _request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
        { status: 401 }
      );
    }

    const { id } = await props.params;

    const generation = await db().query.generations.findFirst({
      where: and(
        eq(generations.id, id),
        eq(generations.userId, session.user.id)
      ),
    });

    if (!generation) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Generation not found' } },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: generation });
  } catch (error) {
    console.error('Generation fetch error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'FETCH_FAILED', message: 'Failed to fetch generation' } },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
        { status: 401 }
      );
    }

    const { id } = await props.params;

    const deleted = await db
      .delete(generations)
      .where(
        and(
          eq(generations.id, id),
          eq(generations.userId, session.user.id)
        )
      )
      .returning({ id: generations.id });

    if (deleted.length === 0) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Generation not found' } },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Generation delete error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'DELETE_FAILED', message: 'Failed to delete generation' } },
      { status: 500 }
    );
  }
}
