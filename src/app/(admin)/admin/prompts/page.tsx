import type { Metadata } from 'next';
import Link from 'next/link';
import { db } from '@/lib/db';
import { prompts, categories } from '@/lib/db/schema';
import { eq, desc, sql } from 'drizzle-orm';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PromptStatusToggle } from '@/components/admin/prompt-status-toggle';
import { Plus, Star } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Manage Prompts',
};

export const dynamic = 'force-dynamic';

export default async function AdminPromptsPage() {
  const [allPrompts, countResult] = await Promise.all([
    db()
      .select({
        id: prompts.id,
        title: prompts.title,
        slug: prompts.slug,
        description: prompts.description,
        isFree: prompts.isFree,
        frameworks: prompts.frameworks,
        usageCount: prompts.usageCount,
        copyCount: prompts.copyCount,
        isFeatured: prompts.isFeatured,
        isPublished: prompts.isPublished,
        createdAt: prompts.createdAt,
        categoryName: categories.name,
      })
      .from(prompts)
      .leftJoin(categories, eq(prompts.categoryId, categories.id))
      .orderBy(desc(prompts.createdAt))
      .limit(100),
    db().select({ count: sql<number>`count(*)::int` }).from(prompts),
  ]);

  const total = countResult[0]?.count ?? 0;

  return (
    <div className="space-y-6">
      <div className="sticky top-0 z-20 flex h-14 items-center justify-between bg-background">
        <div>
          <h1 className="text-2xl font-bold">Manage Prompts</h1>
          <p className="text-sm text-muted-foreground">{total} total prompts</p>
        </div>
        <Link href="/prompts/new">
          <Button>
            <Plus className="size-4 mr-1" />
            Add Prompt
          </Button>
        </Link>
      </div>

      {allPrompts.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center">
            <p className="text-muted-foreground">No prompts yet. Add your first prompt to get started.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="rounded-md border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="sticky top-14 z-10 bg-muted px-4 py-3 text-left font-medium">Title</th>
                <th className="sticky top-14 z-10 bg-muted px-4 py-3 text-left font-medium hidden md:table-cell">Category</th>
                <th className="sticky top-14 z-10 bg-muted px-4 py-3 text-left font-medium hidden lg:table-cell">Access</th>
                <th className="sticky top-14 z-10 bg-muted px-4 py-3 text-center font-medium hidden lg:table-cell">Uses</th>
                <th className="sticky top-14 z-10 bg-muted px-4 py-3 text-center font-medium">Status</th>
                <th className="sticky top-14 z-10 bg-muted px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {allPrompts.map((p) => (
                <tr key={p.id} className="border-b last:border-0 hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {p.isFeatured && <Star className="size-3 text-yellow-500 fill-yellow-500" />}
                      <span className="font-medium">{p.title}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 truncate max-w-[300px]">
                      {p.description}
                    </p>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <Badge variant="outline">{p.categoryName ?? 'Uncategorized'}</Badge>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <Badge variant={p.isFree ? 'secondary' : 'default'}>
                      {p.isFree ? 'free' : 'paid'}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-center hidden lg:table-cell">
                    {p.usageCount}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <PromptStatusToggle id={p.id} initialIsPublished={!!p.isPublished} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/prompts/${p.id}/edit`}>
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
