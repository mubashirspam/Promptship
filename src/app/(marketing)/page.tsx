import { HeroSection } from '@/components/marketing/hero-section';
import { FeaturesGrid } from '@/components/marketing/features-grid';
import { PricingCards } from '@/components/marketing/pricing-cards';
import { Testimonials } from '@/components/marketing/testimonials';
import { FAQAccordion } from '@/components/marketing/faq-accordion';
import { CTASection } from '@/components/marketing/cta-section';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturesGrid />
      <PricingCards />
      <Testimonials />
      <FAQAccordion />
      <CTASection />
    </>
  );
}
