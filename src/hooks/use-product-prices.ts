'use client';

import { useEffect, useState } from 'react';

export interface ProductPrice {
  usd: number;
  inr: number;
  active: boolean;
}

/**
 * Live prices from the DB-backed products API (admin-managed), keyed by
 * product id in whole currency units. Callers fall back to the static
 * config values until (or if) the fetch resolves.
 */
export function useProductPrices() {
  const [prices, setPrices] = useState<Record<string, ProductPrice>>({});

  useEffect(() => {
    let cancelled = false;
    fetch('/api/products')
      .then((r) => r.json())
      .then((json) => {
        if (cancelled || !json.success) return;
        const map: Record<string, ProductPrice> = {};
        for (const p of json.data as {
          id: string;
          priceUsdCents: number;
          priceInrPaise: number;
        }[]) {
          map[p.id] = {
            usd: p.priceUsdCents / 100,
            inr: p.priceInrPaise / 100,
            active: true,
          };
        }
        setPrices(map);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  return prices;
}
