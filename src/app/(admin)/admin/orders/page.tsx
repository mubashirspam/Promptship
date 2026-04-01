import type { Metadata } from 'next';
import { db } from '@/lib/db';
import { payments, users } from '@/lib/db/schema';
import { desc, eq, sql } from 'drizzle-orm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

export const metadata: Metadata = {
  title: 'Manage Orders',
};

export const dynamic = 'force-dynamic';

const statusColors: Record<string, string> = {
  paid: 'bg-green-600',
  pending: 'bg-yellow-600',
  failed: 'bg-red-600',
  refunded: 'bg-gray-600',
};

export default async function AdminOrdersPage() {
  const [allPayments, stats] = await Promise.all([
    db()
      .select({
        id: payments.id,
        amount: payments.amount,
        currency: payments.currency,
        status: payments.status,
        provider: payments.provider,
        providerPaymentId: payments.providerPaymentId,
        createdAt: payments.createdAt,
        userName: users.name,
        userEmail: users.email,
      })
      .from(payments)
      .leftJoin(users, eq(payments.userId, users.id))
      .orderBy(desc(payments.createdAt))
      .limit(200),
    db()
      .select({
        totalCount: sql<number>`count(*)::int`,
        totalRevenue: sql<number>`coalesce(sum(case when status = 'paid' then amount else 0 end), 0)::int`,
        paidCount: sql<number>`count(*) filter (where status = 'paid')::int`,
      })
      .from(payments),
  ]);

  const totalRevenue = (stats[0]?.totalRevenue ?? 0) / 100;
  const totalCount = stats[0]?.totalCount ?? 0;
  const paidCount = stats[0]?.paidCount ?? 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Orders & Payments</h1>
        <p className="text-sm text-muted-foreground">{totalCount} total orders</p>
      </div>

      {/* Quick stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Paid Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{paidCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* Orders table */}
      {allPayments.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center">
            <p className="text-muted-foreground">No orders yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="rounded-md border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-4 py-3 text-left font-medium">Customer</th>
                <th className="px-4 py-3 text-left font-medium hidden md:table-cell">Provider</th>
                <th className="px-4 py-3 text-right font-medium">Amount</th>
                <th className="px-4 py-3 text-center font-medium">Status</th>
                <th className="px-4 py-3 text-left font-medium hidden lg:table-cell">Date</th>
              </tr>
            </thead>
            <tbody>
              {allPayments.map((p) => (
                <tr key={p.id} className="border-b last:border-0 hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <span className="font-medium">{p.userName ?? 'Unknown'}</span>
                    <p className="text-xs text-muted-foreground">{p.userEmail}</p>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <Badge variant="outline" className="capitalize">
                      {p.provider}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right font-medium">
                    ${(p.amount / 100).toFixed(2)} {p.currency.toUpperCase()}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Badge className={`${statusColors[p.status ?? ''] || 'bg-gray-600'} text-xs text-white`}>
                      {p.status ?? 'unknown'}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell text-muted-foreground text-xs">
                    {format(new Date(p.createdAt), 'MMM d, yyyy HH:mm')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
