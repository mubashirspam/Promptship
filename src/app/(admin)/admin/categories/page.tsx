import type { Metadata } from 'next';
import { CategoriesTable } from '@/components/admin/categories-table';

export const metadata: Metadata = {
  title: 'Categories',
};

export const dynamic = 'force-dynamic';

export default function AdminCategoriesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Categories</h1>
        <p className="text-sm text-muted-foreground">
          Add, rename, reorder and delete the categories used across templates
          and the user portal.
        </p>
      </div>
      <CategoriesTable />
    </div>
  );
}
