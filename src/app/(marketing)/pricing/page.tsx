import type { Metadata } from 'next';
import { PricingCards } from '@/components/marketing/pricing-cards';
import { FAQAccordion } from '@/components/marketing/faq-accordion';
import { DarkBackdrop } from '@/components/marketing/dark-backdrop';

export const metadata: Metadata = {
  title: 'Pricing',
  description:
    'Simple, transparent pricing for Promtify — 400+ templates, one lifetime price, every framework.',
};

export default function PricingPage() {
  return (
    <DarkBackdrop>
      <PricingCards />
      <FAQAccordion />
    </DarkBackdrop>
  );
}
