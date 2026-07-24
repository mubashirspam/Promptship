import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

let db: ReturnType<typeof drizzle> | null = null;

// Resolve the connection string per environment so the running app uses the
// database that matches the deploy. On Vercel, VERCEL_ENV is
// 'production' | 'preview' | 'development'; fall back to NODE_ENV locally.
// Each tier falls back to DATABASE_URL if its specific var is not set.
export function resolveDatabaseUrl(): string | undefined {
  const env = process.env.VERCEL_ENV ?? process.env.NODE_ENV;
  if (env === 'production') {
    return process.env.DATABASE_URL_PRODUCTION ?? process.env.DATABASE_URL;
  }
  if (env === 'preview' || env === 'staging') {
    return process.env.DATABASE_URL_STAGING ?? process.env.DATABASE_URL;
  }
  return process.env.DATABASE_URL;
}

function getDb() {
  if (!db) {
    const url = resolveDatabaseUrl();
    if (!url) {
      throw new Error('DATABASE_URL environment variable is not set');
    }
    const sql = neon(url);
    db = drizzle(sql, { schema });
  }
  return db;
}

export { getDb as db };

export type Database = ReturnType<typeof drizzle>;
