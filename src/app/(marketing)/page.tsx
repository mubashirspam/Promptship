import { HeroSection } from '@/components/marketing/hero-section';
import { StatsSection } from '@/components/marketing/stats-section';
import { FeaturesGrid } from '@/components/marketing/features-grid';
import { TemplateShowcase } from '@/components/marketing/template-showcase';
import { HowItWorks } from '@/components/marketing/how-it-works';
import { PricingCards } from '@/components/marketing/pricing-cards';
import { Testimonials } from '@/components/marketing/testimonials';
import { FAQAccordion } from '@/components/marketing/faq-accordion';
import { CTASection } from '@/components/marketing/cta-section';
import { DarkBackdrop } from '@/components/marketing/dark-backdrop';

export default function HomePage() {
  return (
    <>
      {/* Shorter, normal-flow hero (no parallax) so the next section peeks in */}
      <HeroSection />

      <div className="relative z-10" id="templates">
        <TemplateShowcase />
      </div>

      {/*
        One continuous dark backdrop behind every remaining section, so the
        page reads as one seamless dark canvas instead of pricing being the
        only dark island.
      */}
      <DarkBackdrop>
        <StatsSection />
        <FeaturesGrid />
        <HowItWorks />
        <PricingCards />
        <Testimonials />
        <FAQAccordion />
        <CTASection />
      </DarkBackdrop>
    </>
  );
}
