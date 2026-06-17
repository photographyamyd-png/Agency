import { prisma } from "@/lib/prisma";
import { DEFAULT_IMAGES } from "@/lib/images/defaults";

const DEFAULT_AGENCY = {
  businessName: "Your Web Agency",
  tagline: "Websites & Local SEO for Trade Businesses",
  heroHeadline: "More Calls From Google — Without the Marketing BS",
  heroSubhead:
    "We build websites and run local SEO for HVAC, plumbing, roofing, and contractors. More leads from search — plus weekly reports that show you the numbers.",
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
