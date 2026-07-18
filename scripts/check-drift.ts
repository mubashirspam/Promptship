import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from '@/lib/db/schema';
import { getTableName, is } from 'drizzle-orm';
import { PgTable } from 'drizzle-orm/pg-core';

const target = process.argv[2] ?? 'staging';
const url = target === 'production' ? process.env.DATABASE_URL_PRODUCTION : process.env.DATABASE_URL;
const db = drizzle(neon(url!));

async function main() {
  let failures = 0;
  for (const [name, table] of Object.entries(schema)) {
    if (!is(table, PgTable)) continue;
    try {
      await db.select().from(table as PgTable).limit(1);
    } catch (e) {
      failures++;
      const msg = (e as Error & { cause?: Error }).cause?.message ?? (e as Error).message;
      console.log(`DRIFT ${target} ${getTableName(table as PgTable)} (${name}): ${msg}`);
    }
  }
  console.log(failures === 0 ? `✅ ${target}: all tables match schema` : `❌ ${target}: ${failures} drifted tables`);
}
main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
