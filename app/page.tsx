import { getAgencyProfile } from "@/lib/agency/profile";
import { resolveMarketingCopy } from "@/lib/agency/marketing-copy";
import { MarketingLayout } from "@/components/marketing/marketing-layout";
import { HeroSection } from "@/components/marketing/landing/hero-section";
import { RealityCheckSection } from "@/components/marketing/landing/reality-check-section";
import { ServicesSection } from "@/components/marketing/landing/services-section";
import { AboutAmySection } from "@/components/marketing/landing/about-amy-section";
import { ContactSection } from "@/components/marketing/landing/contact-section";
import {
  parseServicesImages,
  resolveChickenImage,
  resolveHeroAlt,
  resolveHeroImage,
  resolveServiceImage,
  resolveTradesAlt,
  resolveTradesImage,
} from "@/lib/images/defaults";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const agency = await getAgencyProfile();
  const copy = resolveMarketingCopy(agency);
  const servicesImages = parseServicesImages(agency.servicesImages);
  const heroImage = resolveHeroImage(agency.heroImageUrl);
  const heroAlt = resolveHeroAlt(agency.heroImageAlt);

  return (
    <MarketingLayout
      businessName={copy.businessName}
      logoUrl={agency.logoUrl}
      email={agency.email}
      phone={agency.phone}
      chickenImage={resolveChickenImage()}
    >
      <HeroSection
        tagline={copy.tagline}
        headline={copy.headline}
        subhead={copy.subhead}
        heroImage={heroImage}
        heroAlt={heroAlt}
        phone={agency.phone}
      />

      <RealityCheckSection />

      <AboutAmySection
        portraitImage={resolveTradesImage()}
        portraitAlt={resolveTradesAlt()}
        chickenImage={resolveChickenImage()}
      />

      <ServicesSection
        resolveImage={(key) => resolveServiceImage(key, servicesImages)}
      />

      <ContactSection />
    </MarketingLayout>
  );
}
