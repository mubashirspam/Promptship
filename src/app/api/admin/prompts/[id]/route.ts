import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { requireAdmin } from '@/lib/auth/require-admin';
import { db } from '@/lib/db';
import { prompts } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

// GET /api/admin/prompts/[id] — get single prompt with full content
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const { id } = await params;
    const result = await db().select().from(prompts).where(eq(prompts.id, id)).limit(1);

    if (!result[0]) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Prompt not found' } },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: result[0] });
  } catch (err) {
    console.error('Admin get prompt error:', err);
    return NextResponse.json(
      { success: false, error: { code: 'FETCH_FAILED', message: 'Failed to fetch prompt' } },
      { status: 500 }
    );
  }
}

// PUT /api/admin/prompts/[id] — update a prompt
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const { id } = await params;
    const body = await request.json();

    const result = await db()
      .update(prompts)
      .set({
        ...body,
        updatedAt: new Date(),
      })
      .where(eq(prompts.id, id))
      .returning();

    if (!result[0]) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Prompt not found' } },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: result[0] });
  } catch (err) {
    console.error('Admin update prompt error:', err);
    return NextResponse.json(
      { success: false, error: { code: 'UPDATE_FAILED', message: 'Failed to update prompt' } },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/prompts/[id] — delete a prompt
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const { id } = await params;
    const result = await db().delete(prompts).where(eq(prompts.id, id)).returning();

    if (!result[0]) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Prompt not found' } },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: { id } });
  } catch (err) {
    console.error('Admin delete prompt error:', err);
    return NextResponse.json(
      { success: false, error: { code: 'DELETE_FAILED', message: 'Failed to delete prompt' } },
      { status: 500 }
    );
  }
}
