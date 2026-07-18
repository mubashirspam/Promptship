import type { Metadata } from 'next';
import { Store } from 'lucide-react';
import { ComingSoon } from '@/components/shared/coming-soon';

export const metadata: Metadata = {
  title: 'Marketplace',
};

export default function MarketplacePage() {
  return (
    <ComingSoon
      icon={Store}
      title="Marketplace"
      description="Buy and sell premium templates and prompts from the community. A curated marketplace is on the way."
      highlights={[
        'Discover templates from top creators',
        'Sell your own Figma, code & prompt assets',
        'Instant access on purchase',
      ]}
    />
  );
}
