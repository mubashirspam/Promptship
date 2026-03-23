import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { blogPosts } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { BlogForm } from '@/components/admin/blog-form';

export const metadata: Metadata = {
  title: 'Edit Blog Post',
};

export const dynamic = 'force-dynamic';

interface EditBlogPostPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditBlogPostPage({ params }: EditBlogPostPageProps) {
  const { id } = await params;

  const result = await db().select().from(blogPosts).where(eq(blogPosts.id, id)).limit(1);
  const post = result[0];
  if (!post) notFound();

  return (
    <div className="space-y-6 max-w-4xl">
      <h1 className="text-2xl font-bold">Edit Blog Post</h1>
      <BlogForm initialData={post} />
    </div>
  );
}
