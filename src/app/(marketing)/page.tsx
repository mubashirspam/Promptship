import { HeroSection } from '@/components/marketing/hero-section';
import { StatsSection } from '@/components/marketing/stats-section';
import { FeaturesGrid } from '@/components/marketing/features-grid';
import { TemplateShowcase } from '@/components/marketing/template-showcase';
import { HowItWorks } from '@/components/marketing/how-it-works';
import { PricingCards } from '@/components/marketing/pricing-cards';
import { Testimonials } from '@/components/marketing/testimonials';
import { FAQAccordion } from '@/components/marketing/faq-accordion';
import { CTASection } from '@/components/marketing/cta-section';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <FeaturesGrid />
      <div id="templates">
        <TemplateShowcase />
      </div>
      <HowItWorks />
      <PricingCards />
      <Testimonials />
      <FAQAccordion />
      <CTASection />
    </>
  );
}
