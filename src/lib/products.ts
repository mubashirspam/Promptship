import { asc, eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { productsTable } from '@/lib/db/schema';
import {
  getProduct as getConfigProduct,
  type Product,
  type ProductGrant,
} from '@/config/products';

/**
 * Runtime product resolution — the DB is the source of truth (admin-managed
 * prices/grants); config/products.ts provides dynamic single-item SKUs
 * (template:/course:) and acts as fallback if a row was deleted.
 */

type ProductRow = typeof productsTable.$inferSelect;

function rowToProduct(row: ProductRow): Product {
  return {
    id: row.id,
    name: row.name,
    mode: row.mode === 'subscription' ? 'subscription' : 'payment',
    interval:
      row.interval === 'month' || row.interval === 'year'
        ? row.interval
        : undefined,
    priceUsdCents: row.priceUsdCents,
    priceInrPaise: row.priceInrPaise,
    grants: (row.grants ?? []) as ProductGrant[],
    active: row.active,
  };
}

export async function getProductById(id: string): Promise<Product | null> {
  // Dynamic single-item SKUs never live in the DB
  if (id.startsWith('template:') || id.startsWith('course:')) {
    return getConfigProduct(id);
  }
  const [row] = await db()
    .select()
    .from(productsTable)
    .where(eq(productsTable.id, id))
    .limit(1);
  if (row) return rowToProduct(row);
  return getConfigProduct(id);
}

export async function listProducts(opts: { activeOnly?: boolean } = {}) {
  const rows = await db()
    .select()
    .from(productsTable)
    .orderBy(asc(productsTable.displayOrder), asc(productsTable.id));
  const all = rows.map(rowToProduct);
  return opts.activeOnly ? all.filter((p) => p.active !== false) : all;
}
