import { NextResponse } from 'next/server';
import { asc } from 'drizzle-orm';
import { db } from '@/lib/db';
import { productsTable } from '@/lib/db/schema';
import { requireAdmin } from '@/lib/auth/require-admin';
import { validateProductInput } from './validate';

/** GET /api/admin/products — all products including inactive */
export async function GET() {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  const rows = await db()
    .select()
    .from(productsTable)
    .orderBy(asc(productsTable.displayOrder), asc(productsTable.id));
  return NextResponse.json({ success: true, data: rows });
}

/** POST /api/admin/products — create a product */
export async function POST(request: Request) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  try {
    const body = await request.json().catch(() => null);
    const id = String(body?.id ?? '').trim();
    if (!/^[a-z0-9][a-z0-9-]{1,50}$/.test(id)) {
      return NextResponse.json(
        { success: false, error: { code: 'BAD_REQUEST', message: 'id must be a lowercase slug' } },
        { status: 400 }
      );
    }
    const check = validateProductInput(body);
    if ('error' in check) return check.error;

    const [row] = await db()
      .insert(productsTable)
      .values({ id, ...check.values })
      .onConflictDoNothing()
      .returning();

    if (!row) {
      return NextResponse.json(
        { success: false, error: { code: 'CONFLICT', message: `Product "${id}" already exists` } },
        { status: 409 }
      );
    }
    return NextResponse.json({ success: true, data: row });
  } catch (error) {
    console.error('Product create error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'CREATE_FAILED', message: 'Failed to create product' } },
      { status: 500 }
    );
  }
}
