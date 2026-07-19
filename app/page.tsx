import { getAgencyProfile } from "@/lib/agency/profile";
import { resolveMarketingCopy } from "@/lib/agency/marketing-copy";
import { MarketingLayout } from "@/components/marketing/marketing-layout";
import { HeroSection } from "@/components/marketing/landing/hero-section";
import { PartnerTrustBar } from "@/components/marketing/landing/partner-trust-bar";
import { MarqueeStrip } from "@/components/marketing/landing/marquee-strip";
import { StrategySection } from "@/components/marketing/landing/strategy-section";
import { ServicesSection } from "@/components/marketing/landing/services-section";
import { MidCtaBanner } from "@/components/marketing/landing/mid-cta-banner";
import { ResultsSection } from "@/components/marketing/landing/results-section";
import { ProcessSection } from "@/components/marketing/landing/process-section";
import { AboutAmySection } from "@/components/marketing/landing/about-amy-section";
import { PricingSection } from "@/components/marketing/landing/pricing-section";
import { ContactSection } from "@/components/marketing/landing/contact-section";
import {
  resolveChickenImage,
  resolveTradesImage,
  resolveTradesAlt,
} from "@/lib/images/defaults";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const agency = await getAgencyProfile();
  const copy = resolveMarketingCopy(agency);
  const chickenImage = resolveChickenImage();
  const portraitImage = resolveTradesImage();
  const portraitAlt = resolveTradesAlt();

  return (
    <MarketingLayout
      businessName={copy.businessName}
      logoUrl={agency.logoUrl}
      email={agency.email}
      phone={agency.phone}
      chickenImage={chickenImage}
    >
      <HeroSection
        tagline={copy.tagline}
        headline={copy.headline}
        subhead={copy.subhead}
        phone={agency.phone}
      />

      <PartnerTrustBar />
      <MarqueeStrip />
      <StrategySection />

      <ServicesSection />

      <MidCtaBanner />

      <ResultsSection />

      <ProcessSection />

      <AboutAmySection
        portraitImage={portraitImage}
        portraitAlt={portraitAlt}
        chickenImage={chickenImage}
      />

      <PricingSection />

      <ContactSection />
    </MarketingLayout>
  );
}
