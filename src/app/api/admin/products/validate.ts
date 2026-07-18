import { NextResponse } from 'next/server';

const SCOPES = ['all', 'category', 'template', 'course', 'feature'];

export interface ProductValues {
  name: string;
  description: string | null;
  mode: string;
  interval: string | null;
  priceUsdCents: number;
  priceInrPaise: number;
  grants: { scope: string; scopeRef?: string; durationDays?: number }[];
  active: boolean;
  displayOrder: number;
}

function bad(message: string) {
  return {
    error: NextResponse.json(
      { success: false, error: { code: 'BAD_REQUEST', message } },
      { status: 400 }
    ),
  };
}

/** Shared validation for create/update. Returns { values } or { error }. */
export function validateProductInput(
  body: unknown
): { values: ProductValues } | { error: NextResponse } {
  const b = (body ?? {}) as Record<string, unknown>;

  const name = String(b.name ?? '').trim();
  if (!name) return bad('name is required');

  const mode = b.mode === 'subscription' ? 'subscription' : 'payment';
  const interval =
    mode === 'subscription'
      ? b.interval === 'year'
        ? 'year'
        : 'month'
      : null;

  const priceUsdCents = Number(b.priceUsdCents);
  const priceInrPaise = Number(b.priceInrPaise);
  for (const [label, v] of [
    ['priceUsdCents', priceUsdCents],
    ['priceInrPaise', priceInrPaise],
  ] as const) {
    if (!Number.isInteger(v) || v < 0 || v > 100_000_000) {
      return bad(`${label} must be a non-negative integer (minor units)`);
    }
  }

  if (!Array.isArray(b.grants)) return bad('grants must be an array');
  const grants: ProductValues['grants'] = [];
  for (const g of b.grants as Record<string, unknown>[]) {
    const scope = String(g?.scope ?? '');
    if (!SCOPES.includes(scope)) return bad(`invalid grant scope "${scope}"`);
    const scopeRef = g?.scopeRef ? String(g.scopeRef).trim() : undefined;
    if (scope !== 'all' && !scopeRef) return bad(`grant scope "${scope}" needs scopeRef`);
    const durationDays =
      g?.durationDays !== undefined && g?.durationDays !== null && g?.durationDays !== ''
        ? Number(g.durationDays)
        : undefined;
    if (durationDays !== undefined && (!Number.isInteger(durationDays) || durationDays < 1)) {
      return bad('durationDays must be a positive integer');
    }
    grants.push({ scope, ...(scopeRef && { scopeRef }), ...(durationDays && { durationDays }) });
  }

  return {
    values: {
      name,
      description: b.description ? String(b.description) : null,
      mode,
      interval,
      priceUsdCents,
      priceInrPaise,
      grants,
      active: b.active !== false,
      displayOrder: Number.isInteger(Number(b.displayOrder)) ? Number(b.displayOrder) : 0,
    },
  };
}
