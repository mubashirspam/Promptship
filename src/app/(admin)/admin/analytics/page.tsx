import type { Metadata } from 'next';
import { db } from '@/lib/db';
import { users, prompts, generations, payments } from '@/lib/db/schema';
import { sql, gte, eq, desc } from 'drizzle-orm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { subDays } from 'date-fns';

export const metadata: Metadata = {
  title: 'Analytics',
};

export const dynamic = 'force-dynamic';

async function getAnalytics() {
  const now = new Date();
  const thirtyDaysAgo = subDays(now, 30);
  const sevenDaysAgo = subDays(now, 7);

  const [
    usersByTier,
    recentSignups,
    topPrompts,
    dailyGenerations,
    revenueByMonth,
  ] = await Promise.all([
    db()
      .select({
        tier: users.tier,
        count: sql<number>`count(*)::int`,
      })
      .from(users)
      .groupBy(users.tier),
    db()
      .select({
        date: sql<string>`to_char(created_at, 'YYYY-MM-DD')`,
        count: sql<number>`count(*)::int`,
      })
      .from(users)
      .where(gte(users.createdAt, thirtyDaysAgo))
      .groupBy(sql`to_char(created_at, 'YYYY-MM-DD')`)
      .orderBy(sql`to_char(created_at, 'YYYY-MM-DD')`),
    db()
      .select({
        id: prompts.id,
        title: prompts.title,
        usageCount: prompts.usageCount,
        copyCount: prompts.copyCount,
        tier: prompts.tier,
      })
      .from(prompts)
      .orderBy(desc(prompts.usageCount))
      .limit(10),
    db()
      .select({
        date: sql<string>`to_char(created_at, 'YYYY-MM-DD')`,
        count: sql<number>`count(*)::int`,
      })
      .from(generations)
      .where(gte(generations.createdAt, sevenDaysAgo))
      .groupBy(sql`to_char(created_at, 'YYYY-MM-DD')`)
      .orderBy(sql`to_char(created_at, 'YYYY-MM-DD')`),
    db()
      .select({
        month: sql<string>`to_char(created_at, 'YYYY-MM')`,
        total: sql<number>`coalesce(sum(amount), 0)::int`,
        count: sql<number>`count(*)::int`,
      })
      .from(payments)
      .where(eq(payments.status, 'paid'))
      .groupBy(sql`to_char(created_at, 'YYYY-MM')`)
      .orderBy(sql`to_char(created_at, 'YYYY-MM') DESC`)
      .limit(6),
  ]);

  return { usersByTier, recentSignups, topPrompts, dailyGenerations, revenueByMonth };
}

const tierColors: Record<string, string> = {
  free: 'bg-emerald-500',
  starter: 'bg-blue-500',
  pro: 'bg-purple-500',
  team: 'bg-amber-500',
};

export default async function AdminAnalyticsPage() {
  const data = await getAnalytics();
  const totalUsers = data.usersByTier.reduce((sum, t) => sum + t.count, 0);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Analytics</h1>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Users by Tier */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Users by Tier</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.usersByTier.map((t) => (
              <div key={t.tier} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`size-3 rounded-full ${tierColors[t.tier] || 'bg-gray-500'}`} />
                  <span className="text-sm font-medium capitalize">{t.tier}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">{t.count}</span>
                  <div className="h-2 w-24 overflow-hidden rounded-full bg-muted">
                    <div
                      className={`h-full rounded-full ${tierColors[t.tier] || 'bg-gray-500'}`}
                      style={{ width: `${totalUsers > 0 ? (t.count / totalUsers) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Signups (last 30 days) */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Signups (Last 30 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            {data.recentSignups.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">No signups yet</p>
            ) : (
              <div className="flex h-32 items-end gap-1">
                {data.recentSignups.map((d) => {
                  const max = Math.max(...data.recentSignups.map((s) => s.count));
                  return (
                    <div
                      key={d.date}
                      className="flex-1 rounded-t bg-primary/80 hover:bg-primary transition-colors"
                      style={{ height: `${max > 0 ? (d.count / max) * 100 : 0}%`, minHeight: '4px' }}
                      title={`${d.date}: ${d.count} signups`}
                    />
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Generations (last 7 days) */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Generations (Last 7 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            {data.dailyGenerations.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">No generations yet</p>
            ) : (
              <div className="space-y-2">
                {data.dailyGenerations.map((d) => (
                  <div key={d.date} className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{d.date}</span>
                    <span className="text-sm font-medium">{d.count}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Revenue by Month */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Revenue by Month</CardTitle>
          </CardHeader>
          <CardContent>
            {data.revenueByMonth.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">No revenue yet</p>
            ) : (
              <div className="space-y-2">
                {data.revenueByMonth.map((m) => (
                  <div key={m.month} className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{m.month}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground">{m.count} payments</span>
                      <span className="text-sm font-bold">${(m.total / 100).toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Top Prompts */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Top 10 Prompts by Usage</CardTitle>
        </CardHeader>
        <CardContent>
          {data.topPrompts.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">No prompts yet</p>
          ) : (
            <div className="rounded-md border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="px-4 py-2 text-left font-medium">#</th>
                    <th className="px-4 py-2 text-left font-medium">Title</th>
                    <th className="px-4 py-2 text-center font-medium">Tier</th>
                    <th className="px-4 py-2 text-center font-medium">Uses</th>
                    <th className="px-4 py-2 text-center font-medium">Copies</th>
                  </tr>
                </thead>
                <tbody>
                  {data.topPrompts.map((p, i) => (
                    <tr key={p.id} className="border-b last:border-0">
                      <td className="px-4 py-2 text-muted-foreground">{i + 1}</td>
                      <td className="px-4 py-2 font-medium">{p.title}</td>
                      <td className="px-4 py-2 text-center">
                        <Badge variant="secondary">{p.tier}</Badge>
                      </td>
                      <td className="px-4 py-2 text-center">{p.usageCount}</td>
                      <td className="px-4 py-2 text-center">{p.copyCount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
