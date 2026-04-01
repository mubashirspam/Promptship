import type { Metadata } from 'next';
import { db } from '@/lib/db';
import { courseModules } from '@/lib/db/schema';
import { sql } from 'drizzle-orm';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const metadata: Metadata = {
  title: 'Manage Courses',
};

export const dynamic = 'force-dynamic';

export default async function AdminCoursesPage() {
  const [modules, countResult] = await Promise.all([
    db()
      .select({
        id: courseModules.id,
        title: courseModules.title,
        slug: courseModules.slug,
        description: courseModules.description,
        displayOrder: courseModules.displayOrder,
        isPublished: courseModules.isPublished,
        createdAt: courseModules.createdAt,
        lessonCount: sql<number>`(
          SELECT count(*)::int FROM lessons WHERE module_id = ${courseModules.id}
        )`,
      })
      .from(courseModules)
      .orderBy(courseModules.displayOrder),
    db().select({ count: sql<number>`count(*)::int` }).from(courseModules),
  ]);

  const total = countResult[0]?.count ?? 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Course Management</h1>
        <p className="text-sm text-muted-foreground">{total} total modules</p>
      </div>

      {modules.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center">
            <p className="text-muted-foreground">
              No course modules yet. Create your first module to get started.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="rounded-md border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-4 py-3 text-left font-medium">Order</th>
                <th className="px-4 py-3 text-left font-medium">Title</th>
                <th className="px-4 py-3 text-center font-medium hidden md:table-cell">Lessons</th>
                <th className="px-4 py-3 text-center font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {modules.map((m) => (
                <tr key={m.id} className="border-b last:border-0 hover:bg-muted/30">
                  <td className="px-4 py-3 text-muted-foreground">
                    {m.displayOrder}
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-medium">{m.title}</span>
                    {m.description && (
                      <p className="text-xs text-muted-foreground mt-0.5 truncate max-w-[300px]">
                        {m.description}
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center hidden md:table-cell">
                    {m.lessonCount}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Badge variant={m.isPublished ? 'default' : 'secondary'}>
                      {m.isPublished ? 'Published' : 'Draft'}
                    </Badge>
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
