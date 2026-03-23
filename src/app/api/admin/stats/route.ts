import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/require-admin';
import { db } from '@/lib/db';
import { users, prompts, generations, blogPosts, payments } from '@/lib/db/schema';
import { sql, eq, gte, and } from 'drizzle-orm';

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const [
      totalUsersResult,
      totalPromptsResult,
      generationsTodayResult,
      revenueMtdResult,
      totalBlogPostsResult,
      publishedPromptsResult,
    ] = await Promise.all([
      db().select({ count: sql<number>`count(*)::int` }).from(users),
      db().select({ count: sql<number>`count(*)::int` }).from(prompts),
      db()
        .select({ count: sql<number>`count(*)::int` })
        .from(generations)
        .where(gte(generations.createdAt, startOfDay)),
      db()
        .select({ total: sql<number>`coalesce(sum(amount), 0)::int` })
        .from(payments)
        .where(
          and(
            gte(payments.createdAt, startOfMonth),
            eq(payments.status, 'paid')
          )
        ),
      db()
        .select({ count: sql<number>`count(*)::int` })
        .from(blogPosts)
        .where(eq(blogPosts.status, 'published')),
      db()
        .select({ count: sql<number>`count(*)::int` })
        .from(prompts)
        .where(eq(prompts.isPublished, true)),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        totalUsers: totalUsersResult[0]?.count ?? 0,
        totalPrompts: totalPromptsResult[0]?.count ?? 0,
        generationsToday: generationsTodayResult[0]?.count ?? 0,
        revenueMtd: (revenueMtdResult[0]?.total ?? 0) / 100, // cents to dollars
        totalBlogPosts: totalBlogPostsResult[0]?.count ?? 0,
        publishedPrompts: publishedPromptsResult[0]?.count ?? 0,
      },
    });
  } catch (err) {
    console.error('Admin stats error:', err);
    return NextResponse.json(
      { success: false, error: { code: 'FETCH_FAILED', message: 'Failed to fetch stats' } },
      { status: 500 }
    );
  }
}
