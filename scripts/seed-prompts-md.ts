import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from '../src/lib/db/schema';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Seed all markdown prompt files from scripts/prompts/ into the database.
 * Each .md file becomes a prompt with markdown content stored in promptText.
 */
async function seedMarkdownPrompts() {
  const env = (process.env.NODE_ENV as string) || 'development';

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

  console.log(`Seeding MD prompts into ${env.toUpperCase()} database...`);

  const sql = neon(databaseUrl);
  const db = drizzle(sql, { schema });

  // Ensure "Landing Pages" category exists (default for all MD prompts)
  const existingCategories = await db.select().from(schema.categories);
  const categoryMap = new Map(existingCategories.map((c) => [c.slug, c.id]));

  if (!categoryMap.has('landing-pages')) {
    const [inserted] = await db
      .insert(schema.categories)
      .values({
        name: 'Landing Pages',
        slug: 'landing-pages',
        description: 'Hero sections, SaaS pages, and marketing landing pages that convert.',
        icon: 'Rocket',
        displayOrder: 1,
      })
      .onConflictDoNothing()
      .returning();
    if (inserted) {
      categoryMap.set('landing-pages', inserted.id);
    }
  }

  const landingPagesCategoryId = categoryMap.get('landing-pages')!;

  // Read all .md files from scripts/prompts/
  const promptsDir = path.join(__dirname, 'prompts');
  const files = fs.readdirSync(promptsDir).filter((f) => f.endsWith('.md'));

  console.log(`Found ${files.length} markdown prompt files`);

  let inserted = 0;
  let skipped = 0;

  for (const file of files) {
    const filePath = path.join(promptsDir, file);
    const content = fs.readFileSync(filePath, 'utf-8').trim();

    // Derive slug and title from filename
    const slug = file.replace('.md', '');
    const title = slug
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    // Extract first line as description (if it's a short sentence)
    const firstLine = content.split('\n')[0].trim();
    const description =
      firstLine.length <= 300 ? firstLine : firstLine.slice(0, 297) + '...';

    try {
      const result = await db
        .insert(schema.prompts)
        .values({
          title,
          slug,
          description,
          promptText: content,
          categoryId: landingPagesCategoryId,
          tier: 'free',
          frameworks: ['react'],
          isFeatured: false,
          isPublished: true,
        })
        .onConflictDoNothing()
        .returning();

      if (result.length > 0) {
        inserted++;
        console.log(`  + ${title}`);
      } else {
        skipped++;
        console.log(`  ~ ${title} (already exists)`);
      }
    } catch (err) {
      console.error(`  ! Failed to insert ${title}:`, err);
    }
  }

  console.log(`\nDone! Inserted: ${inserted}, Skipped: ${skipped}`);
  process.exit(0);
}

seedMarkdownPrompts().catch((err) => {
  console.error('Seed MD prompts failed:', err);
  process.exit(1);
});
