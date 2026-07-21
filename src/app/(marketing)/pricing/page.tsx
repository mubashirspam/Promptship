import type { Metadata } from 'next';
import { PricingCards } from '@/components/marketing/pricing-cards';
import { FAQAccordion } from '@/components/marketing/faq-accordion';

export const metadata: Metadata = {
  title: 'Pricing',
  description:
    'Simple, transparent pricing for Promtify — 400+ templates, one lifetime price, every framework.',
};

export default function PricingPage() {
  // PricingCards renders its own full-bleed dark section with heading —
  // the page adds nothing above it so home and /pricing look identical
  return (
    <div>
      <PricingCards />
      <div className="py-20">
        <FAQAccordion />
      </div>
    </div>
  );
}
