import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { blogPosts, users } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { MarkdownRenderer } from '@/components/shared/markdown-renderer';

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await db()
    .select({ title: blogPosts.title, excerpt: blogPosts.excerpt })
    .from(blogPosts)
    .where(and(eq(blogPosts.slug, slug), eq(blogPosts.status, 'published')))
    .limit(1);

  if (!post[0]) {
    return { title: 'Post Not Found' };
  }

  return {
    title: post[0].title,
    description: post[0].excerpt ?? undefined,
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;

  const result = await db()
    .select({
      id: blogPosts.id,
      title: blogPosts.title,
      content: blogPosts.content,
      excerpt: blogPosts.excerpt,
      category: blogPosts.category,
      tags: blogPosts.tags,
      coverImageUrl: blogPosts.coverImageUrl,
      publishedAt: blogPosts.publishedAt,
      authorName: users.name,
      authorImage: users.image,
    })
    .from(blogPosts)
    .leftJoin(users, eq(blogPosts.authorId, users.id))
    .where(and(eq(blogPosts.slug, slug), eq(blogPosts.status, 'published')))
    .limit(1);

  const post = result[0];
  if (!post) notFound();

  return (
    <article className="py-20">
      <div className="container mx-auto px-4 max-w-3xl">
        {post.coverImageUrl && (
          <div className="aspect-video w-full overflow-hidden rounded-lg mb-8">
            <img
              src={post.coverImageUrl}
              alt={post.title}
              className="h-full w-full object-cover"
            />
          </div>
        )}

        <div className="flex items-center gap-3 mb-4">
          {post.category && <Badge variant="secondary">{post.category}</Badge>}
          {post.publishedAt && (
            <span className="text-sm text-muted-foreground">
              {format(new Date(post.publishedAt), 'MMMM d, yyyy')}
            </span>
          )}
        </div>

        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>

        {post.authorName && (
          <div className="flex items-center gap-2 mb-8 text-sm text-muted-foreground">
            <span>By {post.authorName}</span>
          </div>
        )}

        <MarkdownRenderer
          content={post.content}
          className="prose prose-lg dark:prose-invert max-w-none"
        />

        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-12 pt-6 border-t">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
