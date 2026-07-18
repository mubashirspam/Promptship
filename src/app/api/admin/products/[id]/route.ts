import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { productsTable } from '@/lib/db/schema';
import { requireAdmin } from '@/lib/auth/require-admin';
import { validateProductInput } from '../validate';

/** PATCH /api/admin/products/[id] — update price/name/grants/active/order */
export async function PATCH(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  try {
    const { id } = await props.params;
    const body = await request.json().catch(() => null);

    // Merge with current row so partial updates validate as a whole
    const [current] = await db()
      .select()
      .from(productsTable)
      .where(eq(productsTable.id, id))
      .limit(1);
    if (!current) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Product not found' } },
        { status: 404 }
      );
    }

    const check = validateProductInput({ ...current, ...(body ?? {}) });
    if ('error' in check) return check.error;

    const [row] = await db()
      .update(productsTable)
      .set({ ...check.values, updatedAt: new Date() })
      .where(eq(productsTable.id, id))
      .returning();

    return NextResponse.json({ success: true, data: row });
  } catch (error) {
    console.error('Product update error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'UPDATE_FAILED', message: 'Failed to update product' } },
      { status: 500 }
    );
  }
}

/** DELETE /api/admin/products/[id] — prefer deactivating (active:false) */
export async function DELETE(
  _request: Request,
  props: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  try {
    const { id } = await props.params;
    const [row] = await db()
      .delete(productsTable)
      .where(eq(productsTable.id, id))
      .returning({ id: productsTable.id });
    if (!row) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Product not found' } },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Product delete error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'DELETE_FAILED', message: 'Failed to delete product' } },
      { status: 500 }
    );
  }
}
