import type { Metadata } from 'next';
import Link from 'next/link';
import { db } from '@/lib/db';
import { prompts, categories } from '@/lib/db/schema';
import { eq, desc, sql } from 'drizzle-orm';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PromptStatusToggle } from '@/components/admin/prompt-status-toggle';
import { PromptFeaturedToggle } from '@/components/admin/prompt-featured-toggle';
import { PromptPromoteButton } from '@/components/admin/prompt-promote-button';
import {
  canPromoteToProduction,
  getProductionStatusBySlug,
} from '@/lib/templates/promote-to-production';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Manage Templates',
};

export const dynamic = 'force-dynamic';

const PAGE_SIZE = 50;

type PromoteStatus = 'not-promoted' | 'outdated' | 'in-sync';
type ProdFilter = 'all' | PromoteStatus;
const PROD_FILTERS: { value: ProdFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'not-promoted', label: 'Not in prod' },
  { value: 'outdated', label: 'Needs update' },
  { value: 'in-sync', label: 'In prod' },
];

export default async function AdminTemplatesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; prod?: string }>;
}) {
  const sp = await searchParams;
  const page = Math.max(1, parseInt(sp.page ?? '1', 10) || 1);
  const prodFilter: ProdFilter = PROD_FILTERS.some((f) => f.value === sp.prod)
    ? (sp.prod as ProdFilter)
    : 'all';

  // Every published/unpublished prompt — the table used to hard-cap at the
  // newest 100 (desc createdAt), which silently hid older templates (e.g. the
  // first batches ever seeded) from this page entirely, including from the
  // "push to production" action below. Row count here stays in the low
  // hundreds, so loading them all server-side and paginating in memory is
  // cheap and lets us filter by production status before paginating.
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
        updatedAt: prompts.updatedAt,
        categoryName: categories.name,
      })
      .from(prompts)
      .leftJoin(categories, eq(prompts.categoryId, categories.id))
      .orderBy(desc(prompts.createdAt)),
    db().select({ count: sql<number>`count(*)::int` }).from(prompts),
  ]);

  const total = countResult[0]?.count ?? 0;

  // "Push to production" is only wired up where DATABASE_URL_PRODUCTION is
  // configured for this deployment (staging/local) — never on production
  // itself, which has nothing to promote to.
  const canPromote = canPromoteToProduction();
  const productionStatus = canPromote
    ? await getProductionStatusBySlug(allPrompts.map((p) => p.slug))
    : new Map<string, { updatedAt: Date }>();

  function statusFor(p: (typeof allPrompts)[number]): PromoteStatus {
    if (!productionStatus.has(p.slug)) return 'not-promoted';
    return productionStatus.get(p.slug)!.updatedAt < p.updatedAt ? 'outdated' : 'in-sync';
  }

  const filtered =
    canPromote && prodFilter !== 'all'
      ? allPrompts.filter((p) => statusFor(p) === prodFilter)
      : allPrompts;

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageRows = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  function pageHref(nextPage: number, nextProd = prodFilter) {
    const params = new URLSearchParams();
    if (nextPage > 1) params.set('page', String(nextPage));
    if (nextProd !== 'all') params.set('prod', nextProd);
    const qs = params.toString();
    return qs ? `/templates?${qs}` : '/templates';
  }

  return (
    <div className="space-y-6">
      <div className="sticky top-0 z-20 flex h-14 items-center justify-between bg-background">
        <div>
          <h1 className="text-2xl font-bold">Manage Templates</h1>
          <p className="text-sm text-muted-foreground">
            {total} total templates
            {canPromote && filtered.length !== allPrompts.length && (
              <> · {filtered.length} matching filter</>
            )}
          </p>
        </div>
        <Button asChild>
          <Link href="/templates/new">
            <Plus className="size-4 mr-1" />
            Add Template
          </Link>
        </Button>
      </div>

      {canPromote && (
        <div className="flex flex-wrap items-center gap-2">
          {PROD_FILTERS.map((f) => (
            <Link key={f.value} href={pageHref(1, f.value)}>
              <Badge
                variant={prodFilter === f.value ? 'default' : 'outline'}
                className="cursor-pointer"
              >
                {f.label}
              </Badge>
            </Link>
          ))}
        </div>
      )}

      {allPrompts.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center">
            <p className="text-muted-foreground">No templates yet. Add your first template to get started.</p>
          </CardContent>
        </Card>
      ) : filtered.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center">
            <p className="text-muted-foreground">No templates match this filter.</p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="rounded-md border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="sticky top-14 z-10 bg-muted px-4 py-3 text-left font-medium">Title</th>
                  <th className="sticky top-14 z-10 bg-muted px-4 py-3 text-left font-medium hidden md:table-cell">Category</th>
                  <th className="sticky top-14 z-10 bg-muted px-4 py-3 text-left font-medium hidden lg:table-cell">Access</th>
                  <th className="sticky top-14 z-10 bg-muted px-4 py-3 text-center font-medium hidden lg:table-cell">Uses</th>
                  <th className="sticky top-14 z-10 bg-muted px-4 py-3 text-center font-medium">Status</th>
                  <th className="sticky top-14 z-10 bg-muted px-4 py-3 text-center font-medium">Featured</th>
                  {canPromote && (
                    <th className="sticky top-14 z-10 bg-muted px-4 py-3 text-center font-medium">Production</th>
                  )}
                  <th className="sticky top-14 z-10 bg-muted px-4 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pageRows.map((p) => (
                  <tr key={p.id} className="border-b last:border-0 hover:bg-muted/30">
                    <td className="px-4 py-3">
                      <span className="font-medium">{p.title}</span>
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
                    <td className="px-4 py-3 text-center">
                      <PromptFeaturedToggle id={p.id} initialIsFeatured={!!p.isFeatured} />
                    </td>
                    {canPromote && (
                      <td className="px-4 py-3 text-center">
                        <PromptPromoteButton id={p.id} initialStatus={statusFor(p)} />
                      </td>
                    )}
                    <td className="px-4 py-3 text-right">
                      <Button asChild variant="ghost" size="sm">
                        <Link href={`/templates/${p.id}/edit`}>Edit</Link>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages} ({filtered.length} rows)
              </p>
              <div className="flex items-center gap-2">
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className={cn(currentPage <= 1 && 'pointer-events-none opacity-50')}
                >
                  <Link href={pageHref(currentPage - 1)} aria-disabled={currentPage <= 1}>
                    <ChevronLeft className="size-4" />
                    Prev
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className={cn(currentPage >= totalPages && 'pointer-events-none opacity-50')}
                >
                  <Link href={pageHref(currentPage + 1)} aria-disabled={currentPage >= totalPages}>
                    Next
                    <ChevronRight className="size-4" />
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
