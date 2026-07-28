import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { prompts, categories } from '@/lib/db/schema';
import { eq, asc } from 'drizzle-orm';
import { PromptForm } from '@/components/admin/prompt-form';

export const metadata: Metadata = {
  title: 'Edit Template',
};

export const dynamic = 'force-dynamic';

interface EditTemplatePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditTemplatePage({ params }: EditTemplatePageProps) {
  const { id } = await params;

  const [promptResult, allCategories] = await Promise.all([
    db().select().from(prompts).where(eq(prompts.id, id)).limit(1),
    db()
      .select({ id: categories.id, name: categories.name, slug: categories.slug, parentId: categories.parentId })
      .from(categories)
      .orderBy(asc(categories.displayOrder)),
  ]);

  const prompt = promptResult[0];
  if (!prompt) notFound();

  return (
    <div className="space-y-6 max-w-4xl">
      <h1 className="text-2xl font-bold">Edit Template</h1>
      <PromptForm categories={allCategories} initialData={prompt} />
    </div>
  );
}
