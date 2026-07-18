'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import {
  Loader2,
  Trash2,
  Search,
  ShieldCheck,
  Package,
  Receipt,
} from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PLAN_LABELS, PLAN_COLORS, type Plan } from '@/lib/utils/constants';

interface ProductOption {
  id: string;
  name: string;
}

interface Entitlement {
  id: string;
  scope: string;
  scopeId: string | null;
  source: string;
  expiresAt: string | null;
  revokedAt: string | null;
  createdAt: string;
}

interface Order {
  id: string;
  amount: number;
  currency: string;
  status: string | null;
  provider: string;
  providerPaymentId: string | null;
  createdAt: string;
}

interface UserProfile {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  role: string;
  credits: number;
  plan: Plan;
  createdAt: string;
}

interface TemplateHit {
  id: string;
  title: string;
  categoryName: string | null;
}

interface UserDetailDrawerProps {
  userId: string | null;
  planOptions: ProductOption[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function entitlementLabel(e: Entitlement) {
  if (e.scope === 'all') return 'ALL access';
  if (e.scope === 'feature') {
    const map: Record<string, string> = {
      'templates:figma': 'Figma Kits',
      'templates:ai_prompt': 'AI Prompts',
      'templates:code': 'Code Starters',
      courses: 'All courses',
      ai_generate: 'AI generator',
    };
    return map[e.scopeId ?? ''] ?? `feature: ${e.scopeId}`;
  }
  if (e.scope === 'template') return `Template: ${e.scopeId}`;
  return `${e.scope}: ${e.scopeId}`;
}

const statusColors: Record<string, string> = {
  paid: 'bg-green-600',
  pending: 'bg-yellow-600',
  failed: 'bg-red-600',
  refunded: 'bg-gray-600',
};

export function UserDetailDrawer({
  userId,
  planOptions,
  open,
  onOpenChange,
}: UserDetailDrawerProps) {
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [entitlements, setEntitlements] = useState<Entitlement[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  const [templateQuery, setTemplateQuery] = useState('');
  const [templateHits, setTemplateHits] = useState<TemplateHit[]>([]);
  const [searchingTemplates, setSearchingTemplates] = useState(false);

  const load = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/users/${userId}`);
      const json = await res.json();
      if (json.success) {
        setUser(json.data.user);
        setEntitlements(json.data.entitlements);
        setOrders(json.data.orders);
      } else {
        toast.error(json.error?.message ?? 'Failed to load user');
      }
    } catch {
      toast.error('Failed to load user');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (open && userId) load();
  }, [open, userId, load]);

  // Debounced template search for single-template grants
  useEffect(() => {
    if (!templateQuery.trim()) {
      setTemplateHits([]);
      return;
    }
    const t = setTimeout(async () => {
      setSearchingTemplates(true);
      try {
        const res = await fetch(
          `/api/admin/prompts?query=${encodeURIComponent(templateQuery.trim())}&pageSize=8`
        );
        const json = await res.json();
        setTemplateHits(json.success ? json.data.items : []);
      } catch {
        setTemplateHits([]);
      } finally {
        setSearchingTemplates(false);
      }
    }, 300);
    return () => clearTimeout(t);
  }, [templateQuery]);

  async function grant(body: Record<string, unknown>, successMsg: string) {
    if (!user) return;
    setBusy(true);
    try {
      const res = await fetch('/api/admin/entitlements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, ...body }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success(successMsg);
        await load();
      } else {
        toast.error(json.error?.message ?? 'Grant failed');
      }
    } catch {
      toast.error('Grant failed');
    } finally {
      setBusy(false);
    }
  }

  async function revoke(e: Entitlement) {
    if (!user) return;
    try {
      const res = await fetch('/api/admin/entitlements', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, scope: e.scope, scopeId: e.scopeId }),
      });
      const json = await res.json();
      if (json.success && json.data.revoked) {
        toast.success(`Revoked "${entitlementLabel(e)}"`);
        await load();
      } else {
        toast.error(json.error?.message ?? 'Revoke failed');
      }
    } catch {
      toast.error('Revoke failed');
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full overflow-y-auto p-0 sm:max-w-md">
        <SheetHeader className="border-b p-5">
          <SheetTitle>User details</SheetTitle>
          <SheetDescription>
            Manage this user&apos;s access and view their orders.
          </SheetDescription>
        </SheetHeader>

        {loading || !user ? (
          <div className="flex justify-center py-16">
            <Loader2 className="size-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="space-y-6 p-5">
            {/* Profile */}
            <div className="flex items-center gap-3">
              {user.image ? (
                <Image
                  src={user.image}
                  alt={user.name ?? ''}
                  width={44}
                  height={44}
                  className="size-11 rounded-full object-cover"
                />
              ) : (
                <div className="flex size-11 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                  {(user.name ?? user.email).charAt(0).toUpperCase()}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate font-semibold">{user.name ?? 'Unnamed'}</p>
                  {user.role === 'admin' && (
                    <Badge className="border-0 bg-red-500/10 text-red-500">admin</Badge>
                  )}
                </div>
                <p className="truncate text-sm text-muted-foreground">{user.email}</p>
              </div>
              <Badge className={cn('border-0', PLAN_COLORS[user.plan])}>
                {PLAN_LABELS[user.plan]}
              </Badge>
            </div>

            <div className="flex gap-4 text-sm text-muted-foreground">
              <span>{user.credits} credits</span>
              <span>Joined {format(new Date(user.createdAt), 'MMM d, yyyy')}</span>
            </div>

            {/* Grant access */}
            <section className="space-y-3">
              <h3 className="flex items-center gap-2 text-sm font-semibold">
                <ShieldCheck className="size-4" />
                Grant access
              </h3>

              <div className="flex flex-wrap items-center gap-2">
                <Button
                  size="sm"
                  disabled={busy}
                  onClick={() => grant({ scope: 'all' }, `Granted ALL access to ${user.email}`)}
                >
                  Give ALL access
                </Button>
                <Select
                  value=""
                  disabled={busy}
                  onValueChange={(productId) =>
                    grant({ productId }, `Granted plan "${productId}"`)
                  }
                >
                  <SelectTrigger size="sm" className="w-40">
                    <SelectValue placeholder="Give a plan…" />
                  </SelectTrigger>
                  <SelectContent>
                    {planOptions.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Single template grant */}
              <div className="space-y-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={templateQuery}
                    onChange={(e) => setTemplateQuery(e.target.value)}
                    placeholder="Grant one template — search by title…"
                    className="pl-9"
                  />
                </div>
                {searchingTemplates ? (
                  <div className="flex justify-center py-2">
                    <Loader2 className="size-4 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  templateHits.length > 0 && (
                    <ul className="max-h-48 space-y-1 overflow-y-auto rounded-md border p-1">
                      {templateHits.map((t) => (
                        <li
                          key={t.id}
                          className="flex items-center justify-between gap-2 rounded px-2 py-1.5 text-sm hover:bg-muted/50"
                        >
                          <div className="min-w-0">
                            <p className="truncate">{t.title}</p>
                            {t.categoryName && (
                              <p className="text-xs text-muted-foreground">
                                {t.categoryName}
                              </p>
                            )}
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={busy}
                            onClick={() =>
                              grant(
                                { scope: 'template', scopeId: t.id },
                                `Granted "${t.title}"`
                              )
                            }
                          >
                            Grant
                          </Button>
                        </li>
                      ))}
                    </ul>
                  )
                )}
              </div>
            </section>

            {/* Current access */}
            <section className="space-y-3">
              <h3 className="flex items-center gap-2 text-sm font-semibold">
                <Package className="size-4" />
                Access ({entitlements.filter((e) => !e.revokedAt).length})
              </h3>
              {entitlements.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No entitlements — free templates only.
                </p>
              ) : (
                <ul className="space-y-2">
                  {entitlements.map((e) => {
                    const revoked = Boolean(e.revokedAt);
                    const expired =
                      e.expiresAt && new Date(e.expiresAt) <= new Date();
                    return (
                      <li
                        key={e.id}
                        className="flex items-center justify-between gap-2 rounded-md border px-3 py-2 text-sm"
                      >
                        <div className="min-w-0">
                          <p
                            className={
                              revoked || expired
                                ? 'text-muted-foreground line-through'
                                : 'font-medium'
                            }
                          >
                            {entitlementLabel(e)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {e.source}
                            {e.expiresAt
                              ? ` · ${expired ? 'expired' : 'until'} ${format(new Date(e.expiresAt), 'MMM d, yyyy')}`
                              : ' · lifetime'}
                            {revoked && ' · revoked'}
                          </p>
                        </div>
                        {!revoked && (
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => revoke(e)}
                            aria-label="Revoke"
                          >
                            <Trash2 className="size-4 text-destructive" />
                          </Button>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>

            {/* Orders */}
            <section className="space-y-3">
              <h3 className="flex items-center gap-2 text-sm font-semibold">
                <Receipt className="size-4" />
                Orders ({orders.length})
              </h3>
              {orders.length === 0 ? (
                <p className="text-sm text-muted-foreground">No orders yet.</p>
              ) : (
                <ul className="space-y-2">
                  {orders.map((o) => (
                    <li
                      key={o.id}
                      className="flex items-center justify-between gap-2 rounded-md border px-3 py-2 text-sm"
                    >
                      <div className="min-w-0">
                        <p className="font-medium">
                          ${(o.amount / 100).toFixed(2)} {o.currency.toUpperCase()}
                        </p>
                        <p className="text-xs capitalize text-muted-foreground">
                          {o.provider} · {format(new Date(o.createdAt), 'MMM d, yyyy')}
                        </p>
                      </div>
                      <Badge
                        className={cn(
                          'border-0 text-xs text-white',
                          statusColors[o.status ?? ''] ?? 'bg-gray-600'
                        )}
                      >
                        {o.status ?? 'unknown'}
                      </Badge>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
