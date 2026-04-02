import type { Metadata } from 'next';
import { PricingCards } from '@/components/marketing/pricing-cards';
import { FAQAccordion } from '@/components/marketing/faq-accordion';

export const metadata: Metadata = {
  title: 'Pricing',
  description: 'Simple, transparent pricing for Promtify. Start free, upgrade when ready.',
};

export default function PricingPage() {
  return (
    <div className="py-20">
      <div className="container mx-auto px-4 text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">
          Simple, Transparent <span className="gradient-text">Pricing</span>
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Start free and upgrade when you need more. No hidden fees.
        </p>
      </div>
      <PricingCards />
      <div className="mt-20">
        <FAQAccordion />
      </div>
    </div>
  );
}
