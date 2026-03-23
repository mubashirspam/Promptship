import type { Metadata } from 'next';
import Link from 'next/link';
import { db } from '@/lib/db';
import { blogPosts, users } from '@/lib/db/schema';
import { eq, desc, sql } from 'drizzle-orm';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';
import { format } from 'date-fns';

export const metadata: Metadata = {
  title: 'Manage Blog',
};

export const dynamic = 'force-dynamic';

const statusColors: Record<string, string> = {
  published: 'bg-green-600',
  draft: 'bg-yellow-600',
  archived: 'bg-gray-600',
};

export default async function AdminBlogPage() {
  const [posts, countResult] = await Promise.all([
    db()
      .select({
        id: blogPosts.id,
        title: blogPosts.title,
        slug: blogPosts.slug,
        excerpt: blogPosts.excerpt,
        status: blogPosts.status,
        category: blogPosts.category,
        publishedAt: blogPosts.publishedAt,
        createdAt: blogPosts.createdAt,
        authorName: users.name,
      })
      .from(blogPosts)
      .leftJoin(users, eq(blogPosts.authorId, users.id))
      .orderBy(desc(blogPosts.createdAt))
      .limit(100),
    db().select({ count: sql<number>`count(*)::int` }).from(blogPosts),
  ]);

  const total = countResult[0]?.count ?? 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Manage Blog</h1>
          <p className="text-sm text-muted-foreground">{total} total posts</p>
        </div>
        <Link href="/blog/new">
          <Button>
            <Plus className="size-4 mr-1" />
            New Post
          </Button>
        </Link>
      </div>

      {posts.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center">
            <p className="text-muted-foreground">No blog posts yet. Create your first post.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="rounded-md border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-4 py-3 text-left font-medium">Title</th>
                <th className="px-4 py-3 text-left font-medium hidden md:table-cell">Author</th>
                <th className="px-4 py-3 text-left font-medium hidden lg:table-cell">Category</th>
                <th className="px-4 py-3 text-center font-medium">Status</th>
                <th className="px-4 py-3 text-left font-medium hidden lg:table-cell">Date</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id} className="border-b last:border-0 hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <span className="font-medium">{post.title}</span>
                    {post.excerpt && (
                      <p className="text-xs text-muted-foreground mt-0.5 truncate max-w-[300px]">
                        {post.excerpt}
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell text-muted-foreground">
                    {post.authorName ?? 'Unknown'}
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    {post.category ? (
                      <Badge variant="outline">{post.category}</Badge>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Badge className={`${statusColors[post.status] || ''} text-xs text-white`}>
                      {post.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell text-muted-foreground text-xs">
                    {post.publishedAt
                      ? format(new Date(post.publishedAt), 'MMM d, yyyy')
                      : format(new Date(post.createdAt), 'MMM d, yyyy')}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/blog/${post.id}/edit`}>
                      <Button variant="ghost" size="sm">Edit</Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
