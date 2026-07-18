'use client';

import { useCallback, useEffect, useState } from 'react';
import { Loader2, Save } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

/**
 * Grants are edited via well-known toggles (the scopes the store actually
 * uses). Custom scopes stay untouched and are shown as badges.
 */
const KNOWN_GRANTS = [
  { key: 'templates:figma', label: 'Figma Kits', scope: 'feature' },
  { key: 'templates:ai_prompt', label: 'AI Prompts', scope: 'feature' },
  { key: 'templates:code', label: 'Code Starters', scope: 'feature' },
  { key: 'courses', label: 'All courses', scope: 'feature' },
  { key: 'ai_generate', label: 'AI generator', scope: 'feature' },
  { key: '*', label: 'ALL access (everything)', scope: 'all' },
];

interface Grant {
  scope: string;
  scopeRef?: string;
  durationDays?: number;
}

interface ProductRow {
  id: string;
  name: string;
  description: string | null;
  mode: string;
  interval: string | null;
  priceUsdCents: number;
  priceInrPaise: number;
  grants: Grant[];
  active: boolean;
  displayOrder: number;
}

function grantKey(g: Grant) {
  return g.scope === 'all' ? '*' : (g.scopeRef ?? '');
}

export function ProductsTable() {
  const [rows, setRows] = useState<ProductRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [dirty, setDirty] = useState<Set<string>>(new Set());

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/products');
      const json = await res.json();
      if (json.success) setRows(json.data);
      else toast.error(json.error?.message ?? 'Failed to load products');
    } catch {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function edit(id: string, patch: Partial<ProductRow>) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
    setDirty((prev) => new Set(prev).add(id));
  }

  function toggleGrant(row: ProductRow, key: string, enabled: boolean) {
    const def = KNOWN_GRANTS.find((k) => k.key === key);
    if (!def) return;
    let grants = row.grants.filter((g) => grantKey(g) !== key);
    if (enabled) {
      grants =
        def.scope === 'all'
          ? [...grants, { scope: 'all' }]
          : [...grants, { scope: def.scope, scopeRef: def.key }];
    }
    edit(row.id, { grants });
  }

  async function save(row: ProductRow) {
    setSavingId(row.id);
    try {
      const res = await fetch(`/api/admin/products/${row.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: row.name,
          priceUsdCents: row.priceUsdCents,
          priceInrPaise: row.priceInrPaise,
          active: row.active,
          grants: row.grants,
          displayOrder: row.displayOrder,
        }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success(`Saved "${row.id}"`);
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
      setSavingId(null);
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
      {rows.map((row) => {
        const knownKeys = new Set(KNOWN_GRANTS.map((k) => k.key));
        const customGrants = row.grants.filter((g) => !knownKeys.has(grantKey(g)));

        return (
          <Card key={row.id} className={!row.active ? 'opacity-70' : undefined}>
            <CardContent className="space-y-4 py-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <code className="rounded bg-muted px-2 py-0.5 text-xs">{row.id}</code>
                  <Badge variant="secondary">
                    {row.mode === 'subscription'
                      ? `subscription / ${row.interval ?? 'month'}`
                      : 'one-time'}
                  </Badge>
                  {!row.active && <Badge variant="destructive">inactive</Badge>}
                </div>
                <div className="flex items-center gap-2">
                  <Label htmlFor={`active-${row.id}`} className="text-sm text-muted-foreground">
                    Purchasable
                  </Label>
                  <Switch
                    id={`active-${row.id}`}
                    checked={row.active}
                    onCheckedChange={(v) => edit(row.id, { active: v })}
                  />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div className="sm:col-span-1">
                  <Label className="mb-1.5 block text-xs text-muted-foreground">Name</Label>
                  <Input
                    value={row.name}
                    onChange={(e) => edit(row.id, { name: e.target.value })}
                  />
                </div>
                <div>
                  <Label className="mb-1.5 block text-xs text-muted-foreground">
                    Price USD (e.g. 19 = $19)
                  </Label>
                  <Input
                    type="number"
                    min={0}
                    step="0.01"
                    value={row.priceUsdCents / 100}
                    onChange={(e) =>
                      edit(row.id, {
                        priceUsdCents: Math.round(Number(e.target.value || 0) * 100),
                      })
                    }
                  />
                </div>
                <div>
                  <Label className="mb-1.5 block text-xs text-muted-foreground">
                    Price INR (e.g. 1499 = ₹1499)
                  </Label>
                  <Input
                    type="number"
                    min={0}
                    step="1"
                    value={row.priceInrPaise / 100}
                    onChange={(e) =>
                      edit(row.id, {
                        priceInrPaise: Math.round(Number(e.target.value || 0) * 100),
                      })
                    }
                  />
                </div>
              </div>

              <div>
                <Label className="mb-2 block text-xs text-muted-foreground">
                  Access granted on purchase
                </Label>
                <div className="flex flex-wrap gap-x-5 gap-y-2">
                  {KNOWN_GRANTS.map((k) => (
                    <label key={k.key} className="flex items-center gap-2 text-sm">
                      <Checkbox
                        checked={row.grants.some((g) => grantKey(g) === k.key)}
                        onCheckedChange={(v) => toggleGrant(row, k.key, v === true)}
                      />
                      {k.label}
                    </label>
                  ))}
                  {customGrants.map((g, i) => (
                    <Badge key={i} variant="outline">
                      {g.scope}:{g.scopeRef}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  size="sm"
                  disabled={!dirty.has(row.id) || savingId !== null}
                  onClick={() => save(row)}
                >
                  {savingId === row.id ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <>
                      <Save className="size-4" />
                      Save
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}

      <p className="text-sm text-muted-foreground">
        Changes are live immediately: checkout charges these prices and grants
        this access. Deactivate instead of deleting — existing buyers keep
        their entitlements either way.
      </p>
    </div>
  );
}
