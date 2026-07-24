import { ParallaxHero } from '@/components/marketing/parallax-hero';
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
      {/*
        200vh container — hero moves at 50% scroll speed inside it.
        Hero fully exits the viewport after 200vh of scrolling.
      */}
      <ParallaxHero />

      {/*
        Pull the template section up so it starts 50px below
        the hero bottom (100vh - 50px from page top).
        -mt-[calc(100vh+50px)] = 200vh container - (100vh - 50px).
      */}
      <div className="relative z-10 -mt-[calc(100vh+50px)]" id="templates">
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
