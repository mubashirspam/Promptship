import { describe, it, expect } from 'vitest';
import {
  matchesEntitlement,
  courseQueries,
  templateQueries as buildTemplateQueries,
  derivePlan,
  type EntitlementRow,
} from './index';
import { getProduct, templateProductId, products } from '@/config/products';

const now = new Date('2026-07-17T12:00:00Z');
const future = new Date('2026-08-17T12:00:00Z');
const past = new Date('2026-06-17T12:00:00Z');

function row(partial: Partial<EntitlementRow>): EntitlementRow {
  return { scope: 'all', scopeId: null, expiresAt: null, revokedAt: null, ...partial };
}

const templateQueries = (templateId: string, categoryId: string, assetKind?: string) =>
  buildTemplateQueries({
    id: templateId,
    categoryId,
    isFree: false,
    assetKind: assetKind ?? null,
  });

describe('matchesEntitlement', () => {
  it('grants nothing with no rows', () => {
    expect(matchesEntitlement([], templateQueries('t1', 'c1'), now)).toBe(false);
  });

  it('all-access covers any template', () => {
    expect(matchesEntitlement([row({ scope: 'all' })], templateQueries('t1', 'c1'), now)).toBe(true);
  });

  it('template grant covers only that template', () => {
    const rows = [row({ scope: 'template', scopeId: 't1' })];
    expect(matchesEntitlement(rows, templateQueries('t1', 'c1'), now)).toBe(true);
    expect(matchesEntitlement(rows, templateQueries('t2', 'c1'), now)).toBe(false);
  });

  it('category grant covers all templates in the category', () => {
    const rows = [row({ scope: 'category', scopeId: 'c-figma' })];
    expect(matchesEntitlement(rows, templateQueries('t9', 'c-figma'), now)).toBe(true);
    expect(matchesEntitlement(rows, templateQueries('t9', 'c-code'), now)).toBe(false);
  });

  it('expired rows do not grant access; future expiry does', () => {
    expect(
      matchesEntitlement([row({ scope: 'all', expiresAt: past })], [{ scope: 'all' }], now)
    ).toBe(false);
    expect(
      matchesEntitlement([row({ scope: 'all', expiresAt: future })], [{ scope: 'all' }], now)
    ).toBe(true);
  });

  it('expiry boundary is exclusive', () => {
    expect(
      matchesEntitlement([row({ scope: 'all', expiresAt: now })], [{ scope: 'all' }], now)
    ).toBe(false);
  });

  it('revoked rows never grant access', () => {
    expect(
      matchesEntitlement(
        [row({ scope: 'all', revokedAt: past })],
        [{ scope: 'all' }],
        now
      )
    ).toBe(false);
  });

  it('a scoped row does not satisfy the all query and vice-scope mixups', () => {
    expect(
      matchesEntitlement([row({ scope: 'template', scopeId: 'c1' })], [
        { scope: 'category', scopeId: 'c1' },
      ], now)
    ).toBe(false);
  });

  it('feature and course scopes match on their ids', () => {
    const rows = [
      row({ scope: 'feature', scopeId: 'ai_generate' }),
      row({ scope: 'course', scopeId: 'm1' }),
    ];
    expect(matchesEntitlement(rows, [{ scope: 'feature', scopeId: 'ai_generate' }], now)).toBe(true);
    expect(matchesEntitlement(rows, [{ scope: 'course', scopeId: 'm1' }], now)).toBe(true);
    expect(matchesEntitlement(rows, [{ scope: 'course', scopeId: 'm2' }], now)).toBe(false);
  });
});

describe('plan (asset-kind) access', () => {
  it('a figma plan unlocks figma templates but not code templates', () => {
    const rows = [row({ scope: 'feature', scopeId: 'templates:figma' })];
    expect(
      matchesEntitlement(rows, templateQueries('t1', 'c1', 'figma'), now)
    ).toBe(true);
    expect(
      matchesEntitlement(rows, templateQueries('t2', 'c1', 'code'), now)
    ).toBe(false);
    expect(
      matchesEntitlement(rows, templateQueries('t3', 'c1', 'ai_prompt'), now)
    ).toBe(false);
  });

  it('premium (all three kinds) unlocks every template kind', () => {
    const rows = products.premium.grants.map((g) =>
      row({ scope: g.scope, scopeId: g.scopeRef ?? null })
    );
    for (const kind of ['figma', 'code', 'ai_prompt']) {
      expect(
        matchesEntitlement(rows, templateQueries('t1', 'c1', kind), now)
      ).toBe(true);
    }
  });
});

describe('course access', () => {
  it('unlocks via all-access, blanket courses pass, or the module itself', () => {
    const q = courseQueries('m1');
    expect(matchesEntitlement([row({ scope: 'all' })], q, now)).toBe(true);
    expect(
      matchesEntitlement([row({ scope: 'feature', scopeId: 'courses' })], q, now)
    ).toBe(true);
    expect(
      matchesEntitlement([row({ scope: 'course', scopeId: 'm1' })], q, now)
    ).toBe(true);
    expect(
      matchesEntitlement([row({ scope: 'course', scopeId: 'm2' })], q, now)
    ).toBe(false);
    expect(
      matchesEntitlement([row({ scope: 'feature', scopeId: 'ai_generate' })], q, now)
    ).toBe(false);
  });
});

describe('products', () => {
  it('plans grant the right template kinds (12-month duration)', () => {
    expect(getProduct('basic')?.grants).toEqual([
      { scope: 'feature', scopeRef: 'templates:figma', durationDays: 365 },
    ]);
    for (const g of getProduct('premium')?.grants ?? []) {
      expect(g.durationDays).toBe(365);
    }
    expect(getProduct('pro')?.grants.map((g) => g.scopeRef)).toEqual([
      'templates:figma',
      'templates:ai_prompt',
    ]);
    expect(getProduct('premium')?.grants.map((g) => g.scopeRef)).toEqual([
      'templates:figma',
      'templates:ai_prompt',
      'templates:code',
    ]);
    for (const id of ['basic', 'pro', 'premium', 'courses-addon']) {
      expect(getProduct(id)?.mode).toBe('payment'); // lifetime one-time
      expect(getProduct(id)?.active).not.toBe(false);
    }
  });

  it('resolves dynamic single-template SKUs', () => {
    const p = getProduct(templateProductId('abc-123'));
    expect(p?.mode).toBe('payment');
    expect(p?.grants).toEqual([{ scope: 'template', scopeRef: 'abc-123' }]);
  });

  it('resolves dynamic single-course SKUs', () => {
    const p = getProduct('course:mod-1');
    expect(p?.mode).toBe('payment');
    expect(p?.grants).toEqual([{ scope: 'course', scopeRef: 'mod-1' }]);
  });

  it('courses add-on grants the blanket courses pass', () => {
    expect(getProduct('courses-addon')?.grants).toEqual([
      { scope: 'feature', scopeRef: 'courses' },
    ]);
    expect(getProduct('courses-addon')?.priceUsdCents).toBe(700); // $7
  });

  it('next-launch products exist but are inactive', () => {
    const ai = getProduct('ai-generate-monthly');
    expect(ai?.active).toBe(false);
    expect(ai?.grants).toEqual([{ scope: 'feature', scopeRef: 'ai_generate' }]);
  });

  it('rejects unknown and malformed ids', () => {
    expect(getProduct('nope')).toBeNull();
    expect(getProduct('template:')).toBeNull();
    expect(getProduct('course:')).toBeNull();
  });

  it('every static product grants something', () => {
    for (const p of Object.values(products)) {
      expect(p.grants.length).toBeGreaterThan(0);
      expect(p.priceUsdCents).toBeGreaterThan(0);
      expect(p.priceInrPaise).toBeGreaterThan(0);
    }
  });
});

describe('derivePlan', () => {
  const feature = (key: string) =>
    row({ scope: 'feature', scopeId: key });

  it('is free with no entitlements', () => {
    expect(derivePlan([])).toBe('free');
  });

  it('is basic with the figma bundle only', () => {
    expect(derivePlan([feature('templates:figma')])).toBe('basic');
  });

  it('is pro with figma + ai prompt bundles', () => {
    expect(
      derivePlan([feature('templates:figma'), feature('templates:ai_prompt')])
    ).toBe('pro');
  });

  it('is premium with all three template bundles', () => {
    expect(
      derivePlan([
        feature('templates:figma'),
        feature('templates:ai_prompt'),
        feature('templates:code'),
      ])
    ).toBe('premium');
  });

  it('is premium with all-access', () => {
    expect(derivePlan([row({ scope: 'all' })])).toBe('premium');
  });

  it('ignores revoked and expired bundle rows', () => {
    expect(
      derivePlan([
        { scope: 'feature', scopeId: 'templates:figma', expiresAt: null, revokedAt: past },
        { scope: 'feature', scopeId: 'templates:ai_prompt', expiresAt: past, revokedAt: null },
      ])
    ).toBe('free');
  });

  it('does not promote to pro from a single-template purchase', () => {
    expect(
      derivePlan([row({ scope: 'template', scopeId: 't1' })])
    ).toBe('free');
  });
});
