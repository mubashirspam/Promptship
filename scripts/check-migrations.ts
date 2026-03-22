import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { sql } from 'drizzle-orm';

async function checkMigrations() {
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

  console.log(`🔍 Checking migrations for ${env.toUpperCase()} environment...`);

  const connection = neon(databaseUrl);
  const db = drizzle(connection);

  try {
    const result = await db.execute(sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'drizzle' 
        AND table_name = '__drizzle_migrations'
      ) as migrations_table_exists;
    `);

    if (result.rows[0]?.migrations_table_exists) {
      const migrations = await db.execute(sql`
        SELECT * FROM drizzle.__drizzle_migrations 
        ORDER BY created_at DESC;
      `);
      
      console.log(`\n📊 Applied migrations (${migrations.rows.length}):`);
      migrations.rows.forEach((row, index) => {
        const migrationRow = row as { hash: string; created_at: string };
        console.log(`  ${index + 1}. ${migrationRow.hash} - ${new Date(migrationRow.created_at).toLocaleString()}`);
      });
    } else {
      console.log('⚠️  No migrations table found. Database might not be initialized.');
    }

    console.log('\n✅ Check completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Check failed:', error);
    process.exit(1);
  }
}

checkMigrations();
