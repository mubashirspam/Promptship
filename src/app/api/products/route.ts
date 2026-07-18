import { NextResponse } from 'next/server';
import { listProducts } from '@/lib/products';

/** Public list of purchasable products (plans + add-ons) for pricing UIs. */
export async function GET() {
  try {
    const products = await listProducts({ activeOnly: true });
    return NextResponse.json({
      success: true,
      data: products.map((p) => ({
        id: p.id,
        name: p.name,
        mode: p.mode,
        interval: p.interval ?? null,
        priceUsdCents: p.priceUsdCents,
        priceInrPaise: p.priceInrPaise,
      })),
    });
  } catch (error) {
    console.error('Products fetch error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'FETCH_FAILED', message: 'Failed to fetch products' } },
      { status: 500 }
    );
  }
}
