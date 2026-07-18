'use client';

import { useCallback, useEffect, useState } from 'react';
import { Loader2, Plus, Save, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface CategoryRow {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  parentId: string | null;
  displayOrder: number;
  promptCount: number;
}

export function CategoriesTable() {
  const [rows, setRows] = useState<CategoryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [dirty, setDirty] = useState<Set<string>>(new Set());
  const [newName, setNewName] = useState('');
  const [newParent, setNewParent] = useState('none');
  const [creating, setCreating] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/categories');
      const json = await res.json();
      if (json.success) setRows(json.data);
      else toast.error(json.error?.message ?? 'Failed to load categories');
    } catch {
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function edit(id: string, patch: Partial<CategoryRow>) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
    setDirty((prev) => new Set(prev).add(id));
  }

  async function create() {
    if (!newName.trim()) return;
    setCreating(true);
    try {
      const res = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newName.trim(),
          parentId: newParent === 'none' ? null : newParent,
        }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success(`Category "${json.data.name}" created`);
        setNewName('');
        setNewParent('none');
        load();
      } else {
        toast.error(json.error?.message ?? 'Create failed');
      }
    } catch {
      toast.error('Create failed');
    } finally {
      setCreating(false);
    }
  }

  async function save(row: CategoryRow) {
    setBusyId(row.id);
    try {
      const res = await fetch(`/api/admin/categories/${row.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: row.name,
          slug: row.slug,
          description: row.description,
          icon: row.icon,
          parentId: row.parentId,
          displayOrder: row.displayOrder,
        }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success(`Saved "${json.data.name}"`);
        setDirty((prev) => {
          const next = new Set(prev);
          next.delete(row.id);
          return next;
        });
      } else {
        toast.error(json.error?.message ?? 'Save failed');
      }
    } catch {
      toast.error('Save failed');
    } finally {
      setBusyId(null);
    }
  }

  async function remove(row: CategoryRow) {
    const force =
      row.promptCount > 0 &&
      window.confirm(
        `"${row.name}" is used by ${row.promptCount} template(s). Delete anyway and leave them uncategorized?`
      );
    if (row.promptCount > 0 && !force) return;
    if (row.promptCount === 0 && !window.confirm(`Delete category "${row.name}"?`)) return;

    setBusyId(row.id);
    try {
      const res = await fetch(
        `/api/admin/categories/${row.id}${force ? '?force=true' : ''}`,
        { method: 'DELETE' }
      );
      const json = await res.json();
      if (json.success) {
        toast.success(`Deleted "${row.name}"`);
        load();
      } else {
        toast.error(json.error?.message ?? 'Delete failed');
      }
    } catch {
      toast.error('Delete failed');
    } finally {
      setBusyId(null);
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="flex justify-center py-10">
          <Loader2 className="size-5 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Add new */}
      <div className="flex gap-2">
        <Input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="New category name (e.g. Buttons, Navbars, Mobile Onboarding…)"
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), create())}
        />
        <Select value={newParent} onValueChange={setNewParent}>
          <SelectTrigger className="w-44 shrink-0">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Top-level</SelectItem>
            {rows
              .filter((r) => !r.parentId)
              .map((r) => (
                <SelectItem key={r.id} value={r.id}>
                  under {r.name}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
        <Button onClick={create} disabled={creating || !newName.trim()}>
          {creating ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
          Add
        </Button>
      </div>

      <div className="rounded-md border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-3 py-2.5 text-left font-medium">Name</th>
              <th className="hidden px-3 py-2.5 text-left font-medium md:table-cell">Slug</th>
              <th className="hidden px-3 py-2.5 text-left font-medium md:table-cell">Parent</th>
              <th className="hidden px-3 py-2.5 text-left font-medium lg:table-cell">Icon</th>
              <th className="px-3 py-2.5 text-center font-medium">Order</th>
              <th className="px-3 py-2.5 text-center font-medium">Templates</th>
              <th className="px-3 py-2.5 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {[...rows]
              .sort((a, b) => {
                // Group children directly after their parent
                const keyOf = (r: CategoryRow) => {
                  const parent = r.parentId ? rows.find((p) => p.id === r.parentId) : null;
                  const primary = parent ? parent.displayOrder : r.displayOrder;
                  const primaryName = parent ? parent.name : r.name;
                  return [primary, primaryName, r.parentId ? 1 : 0, r.displayOrder, r.name] as const;
                };
                const ka = keyOf(a);
                const kb = keyOf(b);
                for (let i = 0; i < ka.length; i++) {
                  if (ka[i] < kb[i]) return -1;
                  if (ka[i] > kb[i]) return 1;
                }
                return 0;
              })
              .map((row) => (
              <tr key={row.id} className="border-b last:border-0">
                <td className="px-3 py-2">
                  <div className="flex items-center gap-1">
                    {row.parentId && (
                      <span className="pl-2 text-muted-foreground">└</span>
                    )}
                    <Input
                      value={row.name}
                      onChange={(e) => edit(row.id, { name: e.target.value })}
                      className="h-8"
                    />
                  </div>
                </td>
                <td className="hidden px-3 py-2 md:table-cell">
                  <Input
                    value={row.slug}
                    onChange={(e) => edit(row.id, { slug: e.target.value })}
                    className="h-8 font-mono text-xs"
                  />
                </td>
                <td className="hidden px-3 py-2 md:table-cell">
                  <Select
                    value={row.parentId ?? 'none'}
                    onValueChange={(v) => edit(row.id, { parentId: v === 'none' ? null : v })}
                  >
                    <SelectTrigger size="sm" className="w-36">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Top-level</SelectItem>
                      {rows
                        .filter((r) => !r.parentId && r.id !== row.id)
                        .map((r) => (
                          <SelectItem key={r.id} value={r.id}>
                            {r.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </td>
                <td className="hidden px-3 py-2 lg:table-cell">
                  <Input
                    value={row.icon ?? ''}
                    onChange={(e) => edit(row.id, { icon: e.target.value })}
                    placeholder="emoji/name"
                    className="h-8 w-24"
                  />
                </td>
                <td className="px-3 py-2 text-center">
                  <Input
                    type="number"
                    value={row.displayOrder}
                    onChange={(e) => edit(row.id, { displayOrder: Number(e.target.value) })}
                    className="mx-auto h-8 w-16 text-center"
                  />
                </td>
                <td className="px-3 py-2 text-center">
                  <Badge variant="secondary">{row.promptCount}</Badge>
                </td>
                <td className="px-3 py-2">
                  <div className="flex justify-end gap-1">
                    <Button
                      size="icon-sm"
                      variant="ghost"
                      disabled={!dirty.has(row.id) || busyId !== null}
                      onClick={() => save(row)}
                      aria-label="Save"
                    >
                      {busyId === row.id ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        <Save className="size-4" />
                      )}
                    </Button>
                    <Button
                      size="icon-sm"
                      variant="ghost"
                      disabled={busyId !== null}
                      onClick={() => remove(row)}
                      aria-label="Delete"
                    >
                      <Trash2 className="size-4 text-destructive" />
                    </Button>
                  </div>
                </td>
              </tr>
              ))}
          </tbody>
        </table>
      </div>

      <p className="text-sm text-muted-foreground">
        Categories drive the tabs in the user portal and the category picker on
        templates. Order controls tab position. Deleting a category in use
        un-categorizes its templates (after confirmation).
      </p>
    </div>
  );
}
