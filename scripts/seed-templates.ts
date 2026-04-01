#!/usr/bin/env tsx
/**
 * Premium Template Seeding Script
 * Reads markdown templates from /templates directory and seeds them into database
 * 
 * Usage:
 *   pnpm db:seed-templates
 */

import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import matter from 'gray-matter';
import { neon } from '@neondatabase/serverless';
import { drizzle, type NeonHttpDatabase } from 'drizzle-orm/neon-http';
import * as schema from '../src/lib/db/schema';
import { prompts, categories } from '../src/lib/db/schema';
import { eq } from 'drizzle-orm';

type Database = NeonHttpDatabase<typeof schema>;

interface TemplateFrontmatter {
  title: string;
  slug: string;
  category: string;
  description: string;
  tier: 'free' | 'starter' | 'pro' | 'team';
  frameworks: string[];
  isPremium?: boolean;
  isFeatured?: boolean;
  thumbnailUrl?: string;
  previewImageUrl?: string;
  previewVideoUrl?: string;
  technicalSpecs?: {
    fonts?: { name: string; weights: number[]; url?: string }[];
    colors?: { name: string; hsl: string; usage: string }[];
    animations?: { name: string; keyframes: string; usage: string }[];
    dependencies?: { name: string; version: string; required: boolean }[];
    assets?: { type: string; url: string; description: string }[];
  };
  layoutMetadata?: {
    sections?: string[];
    components?: string[];
    complexity?: 'simple' | 'medium' | 'complex';
    responsive?: boolean;
    darkMode?: boolean;
  };
}

async function ensureCategory(categorySlug: string, db: Database) {
  const existing = await db.query.categories.findFirst({
    where: eq(categories.slug, categorySlug),
  });

  if (existing) {
    return existing.id;
  }

  // Create category if it doesn't exist
  const categoryNames: Record<string, string> = {
    hero: 'Hero Sections',
    landing: 'Landing Pages',
    dashboard: 'Dashboards',
    auth: 'Authentication',
    pricing: 'Pricing',
    features: 'Features',
    testimonials: 'Testimonials',
    footer: 'Footers',
    navigation: 'Navigation',
  };

  const [newCategory] = await db
    .insert(categories)
    .values({
      name: categoryNames[categorySlug] || categorySlug,
      slug: categorySlug,
      description: `${categoryNames[categorySlug] || categorySlug} templates`,
    })
    .returning();

  return newCategory.id;
}

async function seedTemplate(filePath: string, db: Database) {
  const content = readFileSync(filePath, 'utf-8');
  const { data, content: markdownContent } = matter(content);
  const frontmatter = data as TemplateFrontmatter;

  console.log(`📝 Processing: ${frontmatter.title}`);

  // Ensure category exists
  const categoryId = await ensureCategory(frontmatter.category, db);

  // Extract short prompt from first paragraph of markdown
  const shortPrompt = markdownContent
    .split('\n\n')
    .find((para: string) => para.trim() && !para.startsWith('#'))
    ?.trim() || frontmatter.description;

  // Check if template already exists
  const existing = await db.query.prompts.findFirst({
    where: eq(prompts.slug, frontmatter.slug),
  });

  const templateData = {
    categoryId,
    title: frontmatter.title,
    slug: frontmatter.slug,
    description: frontmatter.description,
    promptText: shortPrompt,
    detailedPrompt: markdownContent,
    templateType: frontmatter.isPremium ? 'premium' : 'detailed',
    tier: frontmatter.tier,
    frameworks: frontmatter.frameworks,
    isPremium: frontmatter.isPremium || false,
    isFeatured: frontmatter.isFeatured || false,
    thumbnailUrl: frontmatter.thumbnailUrl,
    previewImageUrl: frontmatter.previewImageUrl,
    previewVideoUrl: frontmatter.previewVideoUrl,
    technicalSpecs: frontmatter.technicalSpecs || null,
    layoutMetadata: frontmatter.layoutMetadata || null,
  };

  if (existing) {
    // Update existing template
    await db
      .update(prompts)
      .set({
        ...templateData,
        updatedAt: new Date(),
      })
      .where(eq(prompts.id, existing.id));
    
    console.log(`✅ Updated: ${frontmatter.title}`);
  } else {
    // Insert new template
    await db.insert(prompts).values(templateData);
    console.log(`✅ Created: ${frontmatter.title}`);
  }
}

async function main() {
  console.log('🚀 Starting template seeding...\n');

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

  console.log(`Seeding ${env.toUpperCase()} database templates...\n`);

  const sql = neon(databaseUrl);
  const db = drizzle(sql, { schema });

  const templatesDir = join(process.cwd(), 'templates');
  const files = readdirSync(templatesDir).filter(
    (file) => file.endsWith('.md') && file !== 'README.md'
  );

  console.log(`Found ${files.length} template(s)\n`);

  for (const file of files) {
    try {
      await seedTemplate(join(templatesDir, file), db);
    } catch (error) {
      console.error(`❌ Error processing ${file}:`, error);
    }
  }

  console.log('\n✨ Template seeding complete!');
  process.exit(0);
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
