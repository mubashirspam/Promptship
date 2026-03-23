import type { Metadata } from 'next';
import { db } from '@/lib/db';
import { categories } from '@/lib/db/schema';
import { asc } from 'drizzle-orm';
import { PromptForm } from '@/components/admin/prompt-form';

export const metadata: Metadata = {
  title: 'New Prompt',
};

export const dynamic = 'force-dynamic';

export default async function NewPromptPage() {
  const allCategories = await db()
    .select({ id: categories.id, name: categories.name, slug: categories.slug })
    .from(categories)
    .orderBy(asc(categories.displayOrder));

  return (
    <div className="space-y-6 max-w-4xl">
      <h1 className="text-2xl font-bold">Create New Prompt</h1>
      <PromptForm categories={allCategories} />
    </div>
  );
}
