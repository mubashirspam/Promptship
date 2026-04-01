import type { Metadata } from 'next';
import Image from 'next/image';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { desc, sql } from 'drizzle-orm';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

export const metadata: Metadata = {
  title: 'Manage Users',
};

export const dynamic = 'force-dynamic';

const tierColors: Record<string, string> = {
  free: 'bg-emerald-500/10 text-emerald-500',
  starter: 'bg-blue-500/10 text-blue-500',
  pro: 'bg-purple-500/10 text-purple-500',
  team: 'bg-amber-500/10 text-amber-500',
};

const roleColors: Record<string, string> = {
  admin: 'bg-red-500/10 text-red-500',
  user: 'bg-gray-500/10 text-gray-500',
};

export default async function AdminUsersPage() {
  const [allUsers, countResult] = await Promise.all([
    db()
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
        image: users.image,
        tier: users.tier,
        role: users.role,
        credits: users.credits,
        emailVerified: users.emailVerified,
        createdAt: users.createdAt,
      })
      .from(users)
      .orderBy(desc(users.createdAt))
      .limit(200),
    db().select({ count: sql<number>`count(*)::int` }).from(users),
  ]);

  const total = countResult[0]?.count ?? 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">User Management</h1>
        <p className="text-sm text-muted-foreground">{total} total users</p>
      </div>

      {allUsers.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center">
            <p className="text-muted-foreground">No users yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="rounded-md border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-4 py-3 text-left font-medium">User</th>
                <th className="px-4 py-3 text-left font-medium hidden md:table-cell">Email</th>
                <th className="px-4 py-3 text-center font-medium hidden lg:table-cell">Tier</th>
                <th className="px-4 py-3 text-center font-medium hidden lg:table-cell">Role</th>
                <th className="px-4 py-3 text-center font-medium hidden lg:table-cell">Credits</th>
                <th className="px-4 py-3 text-center font-medium">Verified</th>
                <th className="px-4 py-3 text-left font-medium hidden lg:table-cell">Joined</th>
              </tr>
            </thead>
            <tbody>
              {allUsers.map((u) => (
                <tr key={u.id} className="border-b last:border-0 hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {u.image ? (
                        <Image
                          src={u.image}
                          alt={u.name ?? ''}
                          width={32}
                          height={32}
                          className="size-8 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                          {(u.name ?? u.email).charAt(0).toUpperCase()}
                        </div>
                      )}
                      <span className="font-medium">{u.name ?? 'Unnamed'}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell text-muted-foreground">
                    {u.email}
                  </td>
                  <td className="px-4 py-3 text-center hidden lg:table-cell">
                    <Badge className={`border-0 ${tierColors[u.tier] || ''}`}>
                      {u.tier.toUpperCase()}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-center hidden lg:table-cell">
                    <Badge className={`border-0 ${roleColors[u.role] || ''}`}>
                      {u.role}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-center hidden lg:table-cell">
                    {u.credits}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Badge variant={u.emailVerified ? 'default' : 'secondary'}>
                      {u.emailVerified ? 'Yes' : 'No'}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell text-muted-foreground text-xs">
                    {format(new Date(u.createdAt), 'MMM d, yyyy')}
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
