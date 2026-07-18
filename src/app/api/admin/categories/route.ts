import { NextResponse } from 'next/server';
import { asc, eq, sql } from 'drizzle-orm';
import { db } from '@/lib/db';
import { categories, prompts } from '@/lib/db/schema';
import { requireAdmin } from '@/lib/auth/require-admin';

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/** GET /api/admin/categories — all categories with template counts */
export async function GET() {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  const rows = await db()
    .select({
      id: categories.id,
      name: categories.name,
      slug: categories.slug,
      description: categories.description,
      icon: categories.icon,
      parentId: categories.parentId,
      displayOrder: categories.displayOrder,
      promptCount: sql<number>`(SELECT count(*)::int FROM ${prompts} WHERE ${prompts.categoryId} = ${categories.id})`,
    })
    .from(categories)
    .orderBy(asc(categories.displayOrder), asc(categories.name));

  return NextResponse.json({ success: true, data: rows });
}

/** POST /api/admin/categories — { name, slug?, description?, icon?, displayOrder? } */
export async function POST(request: Request) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  try {
    const body = await request.json().catch(() => null);
    const name = String(body?.name ?? '').trim();
    if (!name) {
      return NextResponse.json(
        { success: false, error: { code: 'BAD_REQUEST', message: 'name is required' } },
        { status: 400 }
      );
    }
    const slug = slugify(String(body?.slug || name));
    if (!slug) {
      return NextResponse.json(
        { success: false, error: { code: 'BAD_REQUEST', message: 'slug resolves to empty' } },
        { status: 400 }
      );
    }

    const [existing] = await db()
      .select({ id: categories.id })
      .from(categories)
      .where(eq(categories.slug, slug))
      .limit(1);
    if (existing) {
      return NextResponse.json(
        { success: false, error: { code: 'CONFLICT', message: `Category slug "${slug}" already exists` } },
        { status: 409 }
      );
    }

    // Optional parent — must exist and itself be top-level (one level max)
    let parentId: string | null = null;
    if (body?.parentId) {
      const [parent] = await db()
        .select({ id: categories.id, parentId: categories.parentId })
        .from(categories)
        .where(eq(categories.id, String(body.parentId)))
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
      parentId = parent.id;
    }

    const [row] = await db()
      .insert(categories)
      .values({
        name,
        slug,
        description: body?.description ? String(body.description) : null,
        icon: body?.icon ? String(body.icon) : null,
        parentId,
        displayOrder: Number.isInteger(Number(body?.displayOrder))
          ? Number(body.displayOrder)
          : 0,
      })
      .returning();

    return NextResponse.json({ success: true, data: row }, { status: 201 });
  } catch (error) {
    console.error('Category create error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'CREATE_FAILED', message: 'Failed to create category' } },
      { status: 500 }
    );
  }
}
