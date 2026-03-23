import type { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, FileText, Sparkles, DollarSign, BookOpen } from 'lucide-react';
import { db } from '@/lib/db';
import { users, prompts, generations, blogPosts, payments } from '@/lib/db/schema';
import { sql, eq, gte, and } from 'drizzle-orm';

export const metadata: Metadata = {
  title: 'Admin Dashboard',
};

export const dynamic = 'force-dynamic';

async function getStats() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const [
    totalUsersResult,
    totalPromptsResult,
    generationsTodayResult,
    revenueMtdResult,
    totalBlogPostsResult,
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
        and(gte(payments.createdAt, startOfMonth), eq(payments.status, 'paid'))
      ),
    db()
      .select({ count: sql<number>`count(*)::int` })
      .from(blogPosts)
      .where(eq(blogPosts.status, 'published')),
  ]);

  return {
    totalUsers: totalUsersResult[0]?.count ?? 0,
    totalPrompts: totalPromptsResult[0]?.count ?? 0,
    generationsToday: generationsTodayResult[0]?.count ?? 0,
    revenueMtd: (revenueMtdResult[0]?.total ?? 0) / 100,
    totalBlogPosts: totalBlogPostsResult[0]?.count ?? 0,
  };
}

export default async function AdminDashboardPage() {
  const data = await getStats();

  const stats = [
    { label: 'Total Users', value: data.totalUsers.toLocaleString(), icon: Users, color: 'text-blue-500' },
    { label: 'Total Prompts', value: data.totalPrompts.toLocaleString(), icon: FileText, color: 'text-purple-500' },
    { label: 'Generations Today', value: data.generationsToday.toLocaleString(), icon: Sparkles, color: 'text-orange-500' },
    { label: 'Revenue (MTD)', value: `$${data.revenueMtd.toLocaleString()}`, icon: DollarSign, color: 'text-green-500' },
    { label: 'Blog Posts', value: data.totalBlogPosts.toLocaleString(), icon: BookOpen, color: 'text-cyan-500' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <Card key={label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{label}</CardTitle>
              <Icon className={`size-4 ${color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
