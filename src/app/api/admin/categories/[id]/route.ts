import { NextResponse } from 'next/server';
import { eq, sql } from 'drizzle-orm';
import { db } from '@/lib/db';
import { categories, prompts } from '@/lib/db/schema';
import { requireAdmin } from '@/lib/auth/require-admin';

/** PATCH /api/admin/categories/[id] — { name?, slug?, description?, icon?, displayOrder? } */
export async function PATCH(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  try {
    const { id } = await props.params;
    const body = await request.json().catch(() => null);

    const updates: Record<string, unknown> = {};
    if (body?.name !== undefined) {
      const name = String(body.name).trim();
      if (!name) {
        return NextResponse.json(
          { success: false, error: { code: 'BAD_REQUEST', message: 'name cannot be empty' } },
          { status: 400 }
        );
      }
      updates.name = name;
    }
    if (body?.slug !== undefined) {
      const slug = String(body.slug)
        .toLowerCase()
        .replace(/[^a-z0-9-]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
      if (!slug) {
        return NextResponse.json(
          { success: false, error: { code: 'BAD_REQUEST', message: 'invalid slug' } },
          { status: 400 }
        );
      }
      updates.slug = slug;
    }
    if (body?.description !== undefined) updates.description = body.description || null;
    if (body?.icon !== undefined) updates.icon = body.icon || null;
    if (body?.parentId !== undefined) {
      if (body.parentId === null || body.parentId === '') {
        updates.parentId = null;
      } else {
        const parentId = String(body.parentId);
        if (parentId === id) {
          return NextResponse.json(
            { success: false, error: { code: 'BAD_REQUEST', message: 'A category cannot be its own parent' } },
            { status: 400 }
          );
        }
        const [parent] = await db()
          .select({ id: categories.id, parentId: categories.parentId })
          .from(categories)
          .where(eq(categories.id, parentId))
          .limit(1);
        if (!parent) {
          return NextResponse.json(
            { success: false, error: { code: 'BAD_REQUEST', message: 'Parent category not found' } },
            { status: 400 }
          );
        }
        if (parent.parentId) {
          return NextResponse.json(
            { success: false, error: { code: 'BAD_REQUEST', message: 'Only one level of subcategories is supported' } },
            { status: 400 }
          );
        }
        // Becoming a child is only allowed if this category has no children
        const [child] = await db()
          .select({ id: categories.id })
          .from(categories)
          .where(eq(categories.parentId, id))
          .limit(1);
        if (child) {
          return NextResponse.json(
            { success: false, error: { code: 'BAD_REQUEST', message: 'This category has subcategories — move them first' } },
            { status: 400 }
          );
        }
        updates.parentId = parentId;
      }
    }
    if (body?.displayOrder !== undefined) {
      const order = Number(body.displayOrder);
      if (!Number.isInteger(order)) {
        return NextResponse.json(
          { success: false, error: { code: 'BAD_REQUEST', message: 'displayOrder must be an integer' } },
          { status: 400 }
        );
      }
      updates.displayOrder = order;
    }
    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { success: false, error: { code: 'BAD_REQUEST', message: 'Nothing to update' } },
        { status: 400 }
      );
    }

    const [row] = await db()
      .update(categories)
      .set(updates)
      .where(eq(categories.id, id))
      .returning();

    if (!row) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Category not found' } },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: row });
  } catch (error) {
    console.error('Category update error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'UPDATE_FAILED', message: 'Failed to update category' } },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/categories/[id]
 * Refuses while templates still use it (move them first) — unless
 * ?force=true, which un-categorizes those templates and then deletes.
 */
export async function DELETE(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  try {
    const { id } = await props.params;
    const force = new URL(request.url).searchParams.get('force') === 'true';

    const [{ count }] = await db()
      .select({ count: sql<number>`count(*)::int` })
      .from(prompts)
      .where(eq(prompts.categoryId, id));

    if (count > 0 && !force) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'IN_USE',
            message: `${count} template(s) use this category. Move them first, or delete with force to un-categorize them.`,
            promptCount: count,
          },
        },
        { status: 409 }
      );
    }

    if (count > 0) {
      await db()
        .update(prompts)
        .set({ categoryId: null })
        .where(eq(prompts.categoryId, id));
    }

    const [row] = await db()
      .delete(categories)
      .where(eq(categories.id, id))
      .returning({ id: categories.id });

    if (!row) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Category not found' } },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: { id, uncategorized: count } });
  } catch (error) {
    console.error('Category delete error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'DELETE_FAILED', message: 'Failed to delete category' } },
      { status: 500 }
    );
  }
}
