import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { productsTable } from '@/lib/db/schema';
import { products } from '@/config/products';

/**
 * Seed the products table from config/products.ts.
 * ON CONFLICT DO NOTHING — admin-panel edits are never clobbered; delete a
 * row first if you want to re-seed it.
 *
 *   pnpm db:seed-products[:production]
 */

const env = (process.env.NODE_ENV as string) || 'development';
const databaseUrl =
  env === 'production'
    ? process.env.DATABASE_URL_PRODUCTION
    : env === 'staging'
      ? process.env.DATABASE_URL_STAGING
      : process.env.DATABASE_URL;

async function main() {
  if (!databaseUrl) throw new Error(`No database URL for env "${env}"`);
  const db = drizzle(neon(databaseUrl));

  let order = 0;
  for (const product of Object.values(products)) {
    await db
      .insert(productsTable)
      .values({
        id: product.id,
        name: product.name,
        mode: product.mode,
        interval: product.interval ?? null,
        priceUsdCents: product.priceUsdCents,
        priceInrPaise: product.priceInrPaise,
        grants: product.grants.map((g) => ({ ...g })),
        active: product.active !== false,
        displayOrder: order++,
      })
      .onConflictDoNothing();
  }
  console.log(`✅ products seeded (${env}) — existing rows untouched`);
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
