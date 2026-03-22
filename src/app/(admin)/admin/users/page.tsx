import type { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Manage Users',
};

export default function AdminUsersPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">User Management</h1>
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">All Users</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            User management table will be displayed here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
