import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { requireAdmin } from '@/lib/auth/require-admin';
import { db } from '@/lib/db';
import { blogPosts } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

// GET /api/admin/blog/[id] — get single blog post
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const { id } = await params;
    const result = await db().select().from(blogPosts).where(eq(blogPosts.id, id)).limit(1);

    if (!result[0]) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Blog post not found' } },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: result[0] });
  } catch (err) {
    console.error('Admin get blog error:', err);
    return NextResponse.json(
      { success: false, error: { code: 'FETCH_FAILED', message: 'Failed to fetch blog post' } },
      { status: 500 }
    );
  }
}

// PUT /api/admin/blog/[id] — update a blog post
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const { id } = await params;
    const body = await request.json();

    // If publishing for first time, set publishedAt
    if (body.status === 'published' && !body.publishedAt) {
      body.publishedAt = new Date();
    }

    const result = await db()
      .update(blogPosts)
      .set({
        ...body,
        updatedAt: new Date(),
      })
      .where(eq(blogPosts.id, id))
      .returning();

    if (!result[0]) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Blog post not found' } },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: result[0] });
  } catch (err) {
    console.error('Admin update blog error:', err);
    return NextResponse.json(
      { success: false, error: { code: 'UPDATE_FAILED', message: 'Failed to update blog post' } },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/blog/[id] — delete a blog post
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const { id } = await params;
    const result = await db().delete(blogPosts).where(eq(blogPosts.id, id)).returning();

    if (!result[0]) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Blog post not found' } },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: { id } });
  } catch (err) {
    console.error('Admin delete blog error:', err);
    return NextResponse.json(
      { success: false, error: { code: 'DELETE_FAILED', message: 'Failed to delete blog post' } },
      { status: 500 }
    );
  }
}
