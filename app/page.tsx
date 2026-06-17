import { getAgencyProfile } from "@/lib/agency/profile";
import { MarketingLayout } from "@/components/marketing/marketing-layout";
import { HeroSection } from "@/components/marketing/landing/hero-section";
import { ServicesSection } from "@/components/marketing/landing/services-section";
import { SkillsSection } from "@/components/marketing/landing/skills-section";
import { ResultsSection } from "@/components/marketing/landing/results-section";
import { ProcessSection } from "@/components/marketing/landing/process-section";
import { ContactSection } from "@/components/marketing/landing/contact-section";
import {
  parseResultsImages,
  parseServicesImages,
  resolveHeroAlt,
  resolveHeroImage,
  resolveResultsImages,
  resolveServiceImage,
  resolveTradesAlt,
  resolveTradesImage,
} from "@/lib/images/defaults";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const agency = await getAgencyProfile();
  const servicesImages = parseServicesImages(agency.servicesImages);
  const resultsImages = resolveResultsImages(
    parseResultsImages(agency.resultsImages)
  );
  const heroImage = resolveHeroImage(agency.heroImageUrl);
  const heroAlt = resolveHeroAlt(agency.heroImageAlt);

  return (
    <MarketingLayout
      businessName={agency.businessName}
      logoUrl={agency.logoUrl}
      email={agency.email}
      phone={agency.phone}
    >
      <HeroSection
        tagline={agency.tagline ?? "Websites & Local SEO for Trade Businesses"}
        headline={agency.heroHeadline ?? "More Calls From Google — Without the Marketing BS"}
        subhead={
          agency.heroSubhead ??
          "We build websites and run local SEO for HVAC, plumbing, roofing, and contractors. More leads from search — plus weekly reports that show you the numbers."
        }
        heroImage={heroImage}
        heroAlt={heroAlt}
        phone={agency.phone}
      />

      <ServicesSection
        resolveImage={(key) => resolveServiceImage(key, servicesImages)}
      />

      <SkillsSection
        image={resolveTradesImage()}
        imageAlt={resolveTradesAlt()}
      />

      <ResultsSection images={resultsImages} />

      <ProcessSection />

      <ContactSection />
    </MarketingLayout>
  );
}
