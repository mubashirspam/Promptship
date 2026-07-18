import type { Metadata } from 'next';
import { ProductsTable } from '@/components/admin/products-table';

export const metadata: Metadata = {
  title: 'Plans & Pricing',
};

export const dynamic = 'force-dynamic';

export default function AdminPlansPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Plans & Pricing</h1>
        <p className="text-sm text-muted-foreground">
          Edit prices and what each plan unlocks. The pricing pages and
          checkout read from here.
        </p>
      </div>
      <ProductsTable />
    </div>
  );
}
