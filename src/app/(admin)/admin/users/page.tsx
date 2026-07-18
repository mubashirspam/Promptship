import type { Metadata } from 'next';
import { UsersTable } from '@/components/admin/users-table';

export const metadata: Metadata = {
  title: 'Manage Users',
};

export const dynamic = 'force-dynamic';

export default function AdminUsersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">User Management</h1>
        <p className="text-sm text-muted-foreground">
          Search users, view orders, and manage access entitlements.
        </p>
      </div>
      <UsersTable />
    </div>
  );
}
