import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { requireAdmin } from '@/lib/auth/require-admin';
import { db } from '@/lib/db';
import { blogPosts, users } from '@/lib/db/schema';
import { eq, desc, ilike, and, sql } from 'drizzle-orm';

// GET /api/admin/blog — list all blog posts
export async function GET(request: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const { searchParams } = request.nextUrl;
    const query = searchParams.get('query');
    const status = searchParams.get('status');
    const page = Number(searchParams.get('page') || '1');
    const pageSize = Number(searchParams.get('pageSize') || '50');

    const conditions: ReturnType<typeof eq>[] = [];
    if (query) {
      conditions.push(ilike(blogPosts.title, `%${query}%`));
    }
    if (status && (status === 'draft' || status === 'published' || status === 'archived')) {
      conditions.push(eq(blogPosts.status, status));
    }

    const [results, countResult] = await Promise.all([
      db()
        .select({
          id: blogPosts.id,
          title: blogPosts.title,
          slug: blogPosts.slug,
          excerpt: blogPosts.excerpt,
          status: blogPosts.status,
          category: blogPosts.category,
          tags: blogPosts.tags,
          coverImageUrl: blogPosts.coverImageUrl,
          publishedAt: blogPosts.publishedAt,
          createdAt: blogPosts.createdAt,
          authorName: users.name,
        })
        .from(blogPosts)
        .leftJoin(users, eq(blogPosts.authorId, users.id))
        .where(conditions.length ? and(...conditions) : undefined)
        .orderBy(desc(blogPosts.createdAt))
        .limit(pageSize)
        .offset((page - 1) * pageSize),
      db()
        .select({ count: sql<number>`count(*)::int` })
        .from(blogPosts)
        .where(conditions.length ? and(...conditions) : undefined),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        items: results,
        page,
        pageSize,
        total: countResult[0]?.count ?? 0,
      },
    });
  } catch (err) {
    console.error('Admin blog list error:', err);
    return NextResponse.json(
      { success: false, error: { code: 'FETCH_FAILED', message: 'Failed to fetch blog posts' } },
      { status: 500 }
    );
  }
}

// POST /api/admin/blog — create a new blog post
export async function POST(request: NextRequest) {
  const { error, session } = await requireAdmin();
  if (error) return error;

  try {
    const body = await request.json();
    const {
      title,
      slug,
      excerpt,
      content,
      coverImageUrl,
      status = 'draft',
      category,
      tags = [],
    } = body;

    if (!title || !slug || !content) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION', message: 'title, slug, and content are required' } },
        { status: 400 }
      );
    }

    const result = await db()
      .insert(blogPosts)
      .values({
        title,
        slug,
        excerpt,
        content,
        coverImageUrl,
        authorId: session!.user.id,
        status,
        category,
        tags,
        publishedAt: status === 'published' ? new Date() : null,
      })
      .returning();

    return NextResponse.json({ success: true, data: result[0] }, { status: 201 });
  } catch (err: unknown) {
    console.error('Admin create blog error:', err);
    const message =
      err instanceof Error && err.message.includes('unique')
        ? 'A blog post with this slug already exists'
        : 'Failed to create blog post';
    return NextResponse.json(
      { success: false, error: { code: 'CREATE_FAILED', message } },
      { status: 500 }
    );
  }
}
