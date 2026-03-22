import { drizzle } from 'drizzle-orm/neon-http';
import { migrate } from 'drizzle-orm/neon-http/migrator';
import { neon } from '@neondatabase/serverless';

async function runMigration() {
  const env = process.env.NODE_ENV as string || 'development';
  
  let databaseUrl: string | undefined;
  
  if (env === 'production') {
    databaseUrl = process.env.DATABASE_URL_PRODUCTION;
  } else if (env === 'staging') {
    databaseUrl = process.env.DATABASE_URL_STAGING;
  } else {
    databaseUrl = process.env.DATABASE_URL;
  }

  if (!databaseUrl) {
    throw new Error(`DATABASE_URL not found for environment: ${env}`);
  }

  console.log(`🚀 Running migrations for ${env.toUpperCase()} environment...`);
  console.log(`📦 Database: ${databaseUrl.split('@')[1]?.split('/')[0] || 'unknown'}`);

  const sql = neon(databaseUrl);
  const db = drizzle(sql);

  try {
    await migrate(db, { migrationsFolder: './src/lib/db/migrations' });
    console.log('✅ Migrations completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

runMigration();
