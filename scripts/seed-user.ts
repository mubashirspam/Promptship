import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { eq } from 'drizzle-orm';
import * as schema from '../src/lib/db/schema';

async function seedUser() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error('DATABASE_URL not set');

  console.log('Adding sample data for admin user...');

  const sql = neon(databaseUrl);
  const db = drizzle(sql, { schema });

  // ─── 1. Get user ──────────────────────────────────────────
  const existing = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.email, 'admin@promptship.dev'))
    .limit(1);

  if (existing.length === 0) {
    console.log('User not found. Sign up first via the UI.');
    process.exit(1);
  }

  const userId = existing[0].id;
  console.log('Found user:', userId);

  // ─── 2. Get prompt IDs for sample data ──────────────────────
  const prompts = await db.select().from(schema.prompts).limit(10);
  if (prompts.length === 0) {
    console.log('No prompts found - run seed.ts first');
    process.exit(1);
  }

  // ─── 4. Add favorites ──────────────────────────────────────
  const favPrompts = prompts.filter((p) => p.isFeatured).slice(0, 4);
  for (const prompt of favPrompts) {
    await db
      .insert(schema.favorites)
      .values({ userId, promptId: prompt.id })
      .onConflictDoNothing();
  }
  console.log(`Added ${favPrompts.length} favorites`);

  // ─── 5. Add prompt copies ─────────────────────────────────
  for (const prompt of prompts.slice(0, 6)) {
    await db.insert(schema.promptCopies).values({ userId, promptId: prompt.id });
  }
  console.log('Added 6 prompt copies');

  // ─── 6. Add sample generations ────────────────────────────
  const generationsData = [
    {
      userId,
      promptId: prompts[0]?.id,
      framework: 'react',
      templateType: 'hero-section',
      inputPrompt: 'Create a modern SaaS hero section with gradient text and floating mockup',
      outputCode: `export function HeroSection() {\n  return (\n    <section className="relative min-h-screen flex items-center">\n      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12">\n        <div className="flex flex-col justify-center">\n          <h1 className="text-6xl font-bold">\n            Build <span className="bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">faster</span>\n          </h1>\n          <p className="mt-4 text-xl text-gray-600">Ship production-ready UIs in minutes.</p>\n          <div className="mt-8 flex gap-4">\n            <button className="px-8 py-3 bg-purple-600 text-white rounded-lg">Get Started</button>\n            <button className="px-8 py-3 border rounded-lg">Learn More</button>\n          </div>\n        </div>\n        <div className="relative">\n          <div className="rounded-2xl bg-white/10 backdrop-blur-xl border p-8 shadow-2xl">\n            <div className="h-64 bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg" />\n          </div>\n        </div>\n      </div>\n    </section>\n  );\n}`,
      aiProvider: 'claude',
      aiModel: 'claude-sonnet-4-20250514',
      tokensInput: 1240,
      tokensOutput: 890,
      latencyMs: 3200,
      costUsd: '0.004500',
    },
    {
      userId,
      promptId: prompts[4]?.id,
      framework: 'react',
      templateType: 'login-page',
      inputPrompt: 'Create a clean login page with social OAuth buttons',
      outputCode: `export function LoginPage() {\n  return (\n    <div className="min-h-screen flex items-center justify-center bg-gray-50">\n      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-lg">\n        <h2 className="text-2xl font-bold text-center">Welcome back</h2>\n        <div className="mt-6 space-y-3">\n          <button className="w-full flex items-center justify-center gap-3 px-4 py-3 border rounded-lg hover:bg-gray-50">Continue with Google</button>\n          <button className="w-full flex items-center justify-center gap-3 px-4 py-3 border rounded-lg hover:bg-gray-50">Continue with GitHub</button>\n        </div>\n        <div className="my-6 border-t" />\n        <form className="space-y-4">\n          <input type="email" placeholder="Email" className="w-full px-4 py-3 border rounded-lg" />\n          <input type="password" placeholder="Password" className="w-full px-4 py-3 border rounded-lg" />\n          <button className="w-full py-3 bg-black text-white rounded-lg">Sign In</button>\n        </form>\n      </div>\n    </div>\n  );\n}`,
      aiProvider: 'claude',
      aiModel: 'claude-sonnet-4-20250514',
      tokensInput: 980,
      tokensOutput: 720,
      latencyMs: 2800,
      costUsd: '0.003200',
    },
    {
      userId,
      promptId: prompts[2]?.id,
      framework: 'react',
      templateType: 'dashboard',
      inputPrompt: 'Create an analytics dashboard with KPI cards and charts',
      outputCode: `export function Dashboard() {\n  const stats = [\n    { label: 'Revenue', value: '$45,231', change: '+20.1%' },\n    { label: 'Users', value: '2,350', change: '+15.2%' },\n    { label: 'Conversion', value: '3.2%', change: '+4.1%' },\n    { label: 'Signups', value: '573', change: '+12.5%' },\n  ];\n  return (\n    <div className="p-6 space-y-6">\n      <div className="grid grid-cols-4 gap-4">\n        {stats.map(s => (\n          <div key={s.label} className="p-6 bg-white rounded-xl shadow-sm border">\n            <p className="text-sm text-gray-500">{s.label}</p>\n            <p className="text-2xl font-bold mt-1">{s.value}</p>\n            <p className="text-sm text-green-600 mt-1">{s.change}</p>\n          </div>\n        ))}\n      </div>\n    </div>\n  );\n}`,
      aiProvider: 'claude',
      aiModel: 'claude-sonnet-4-20250514',
      tokensInput: 1560,
      tokensOutput: 1100,
      latencyMs: 4100,
      costUsd: '0.006200',
    },
    {
      userId,
      promptId: prompts[6]?.id,
      framework: 'html',
      templateType: 'product-catalog',
      inputPrompt: 'Create a product catalog with filters and grid layout',
      outputCode: `<div class="max-w-7xl mx-auto px-6 py-12">\n  <div class="flex gap-8">\n    <aside class="w-64 shrink-0">\n      <h3 class="font-semibold mb-4">Filters</h3>\n      <div class="space-y-3">\n        <label class="flex items-center gap-2"><input type="checkbox"> Electronics</label>\n        <label class="flex items-center gap-2"><input type="checkbox"> Clothing</label>\n      </div>\n    </aside>\n    <div class="flex-1 grid grid-cols-3 gap-6">\n      <div class="bg-white rounded-xl shadow-sm border p-4">\n        <div class="h-48 bg-gray-100 rounded-lg mb-4"></div>\n        <h3 class="font-medium">Product Name</h3>\n        <p class="text-gray-500 text-sm">$99.00</p>\n      </div>\n    </div>\n  </div>\n</div>`,
      aiProvider: 'claude',
      aiModel: 'claude-sonnet-4-20250514',
      tokensInput: 1100,
      tokensOutput: 650,
      latencyMs: 2400,
      costUsd: '0.003800',
    },
    {
      userId,
      promptId: prompts[8]?.id,
      framework: 'vue',
      templateType: 'pricing-table',
      inputPrompt: 'Create a pricing comparison table with monthly/annual toggle',
      outputCode: `<template>\n  <div class="max-w-5xl mx-auto py-16 px-6">\n    <div class="text-center mb-12">\n      <h2 class="text-3xl font-bold">Simple Pricing</h2>\n      <div class="mt-4 flex items-center justify-center gap-3">\n        <span>Monthly</span>\n        <button class="w-12 h-6 bg-purple-600 rounded-full relative">\n          <span class="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />\n        </button>\n        <span>Annual <span class="text-green-600 text-sm">Save 20%</span></span>\n      </div>\n    </div>\n    <div class="grid md:grid-cols-3 gap-8">\n      <div class="border rounded-2xl p-8">\n        <h3 class="text-lg font-semibold">Starter</h3>\n        <p class="text-3xl font-bold mt-2">$9<span class="text-lg text-gray-500">/mo</span></p>\n      </div>\n    </div>\n  </div>\n</template>`,
      aiProvider: 'claude',
      aiModel: 'claude-sonnet-4-20250514',
      tokensInput: 1350,
      tokensOutput: 920,
      latencyMs: 3500,
      costUsd: '0.005100',
    },
  ];

  for (const gen of generationsData) {
    await db.insert(schema.generations).values(gen);
  }
  console.log('Added 5 generations');

  // ─── 7. Add course module + lessons + progress ────────────
  const [courseModule] = await db
    .insert(schema.courseModules)
    .values({
      title: 'Prompt Engineering Fundamentals',
      slug: 'prompt-engineering-fundamentals',
      description: 'Learn how to write effective prompts for UI generation',
      displayOrder: 1,
      isPublished: true,
    })
    .onConflictDoNothing()
    .returning();

  if (courseModule) {
    const lessonsData = [
      { title: 'Introduction to AI Prompts', slug: 'intro-to-ai-prompts', displayOrder: 1, isFreePreview: true, isPublished: true },
      { title: 'Understanding UI Components', slug: 'understanding-ui-components', displayOrder: 2, isFreePreview: true, isPublished: true },
      { title: 'Writing Effective Layout Prompts', slug: 'writing-layout-prompts', displayOrder: 3, isFreePreview: false, isPublished: true },
      { title: 'Color, Typography & Styling', slug: 'color-typography-styling', displayOrder: 4, isFreePreview: false, isPublished: true },
      { title: 'Responsive Design Prompts', slug: 'responsive-design-prompts', displayOrder: 5, isFreePreview: false, isPublished: true },
      { title: 'Animation & Interaction', slug: 'animation-interaction', displayOrder: 6, isFreePreview: false, isPublished: true },
      { title: 'Framework-Specific Tips', slug: 'framework-specific-tips', displayOrder: 7, isFreePreview: false, isPublished: true },
      { title: 'Advanced Prompt Patterns', slug: 'advanced-prompt-patterns', displayOrder: 8, isFreePreview: false, isPublished: true },
    ];

    const insertedLessons = await db
      .insert(schema.lessons)
      .values(lessonsData.map((l) => ({ ...l, moduleId: courseModule.id })))
      .returning();

    // Mark first 3 lessons as completed
    for (let i = 0; i < 3 && i < insertedLessons.length; i++) {
      await db.insert(schema.lessonProgress).values({
        userId,
        lessonId: insertedLessons[i].id,
        watchTimeSec: 600 + Math.floor(Math.random() * 300),
        isCompleted: true,
        completedAt: new Date(),
        lastPositionSec: 0,
      }).onConflictDoNothing();
    }
    // Mark 4th lesson as in-progress
    if (insertedLessons[3]) {
      await db.insert(schema.lessonProgress).values({
        userId,
        lessonId: insertedLessons[3].id,
        watchTimeSec: 240,
        isCompleted: false,
        lastPositionSec: 240,
      }).onConflictDoNothing();
    }

    console.log('Added course module with 8 lessons and progress');
  } else {
    console.log('Course module already exists');
  }

  console.log('\n========================================');
  console.log('Sample data seeded successfully!');
  console.log('========================================');
  console.log(`User:     admin@promptship.dev`);
  console.log('========================================');
  console.log('Sample data added:');
  console.log('  - 4 favorites');
  console.log('  - 6 prompt copies');
  console.log('  - 5 AI generations');
  console.log('  - 1 course (8 lessons, 3 completed)');
  console.log('========================================\n');

  process.exit(0);
}

seedUser().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
