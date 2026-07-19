import { prisma } from "@/lib/prisma";
import { DEFAULT_IMAGES } from "@/lib/images/defaults";

const DEFAULT_AGENCY = {
  businessName: "Amy · Web for Trades",
  tagline: "Websites & local SEO for construction and the trades",
  heroHeadline: "Be the obvious choice when locals need a contractor",
  heroSubhead:
    "Show up in Maps and local search, look as professional as your jobsite, and get the phone ringing with jobs that pay.",
  email: "hello@youragency.com",
  phone: "",
  logoUrl: null as string | null,
  heroImageUrl: DEFAULT_IMAGES.hero,
  heroImageAlt: DEFAULT_IMAGES.heroAlt,
  servicesImages: DEFAULT_IMAGES.services,
  resultsImages: DEFAULT_IMAGES.results,
  autoOnboardWebsiteLeads: true,
  defaultRevisionRounds: 2,
  defaultPaymentSchedule: null as null,
  standardAgreementTerms: null as string | null,
  updatedAt: new Date(),
};

export async function getAgencyProfile() {
  try {
    const profile = await prisma.agencyProfile.findFirst();
    if (profile) return profile;
    return await prisma.agencyProfile.create({
      data: {
        businessName: DEFAULT_AGENCY.businessName,
        tagline: DEFAULT_AGENCY.tagline,
        heroHeadline: DEFAULT_AGENCY.heroHeadline,
        heroSubhead: DEFAULT_AGENCY.heroSubhead,
        email: DEFAULT_AGENCY.email,
        autoOnboardWebsiteLeads: DEFAULT_AGENCY.autoOnboardWebsiteLeads,
      },
    });
  } catch {
    return { id: "fallback", ...DEFAULT_AGENCY };
  }
}
