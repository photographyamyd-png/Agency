import { prisma } from "@/lib/prisma";
import { DEFAULT_IMAGES } from "@/lib/images/defaults";

const DEFAULT_AGENCY = {
  businessName: "Amy · Web for Trades",
  tagline: "Websites for people who actually work for a living",
  heroHeadline:
    "Stop selling premium work with a website that looks like a 1992 game of Frogger.",
  heroSubhead:
    "Aunt Martha—or whoever built your site—meant well, but your digital storefront is costing you the jobs that pay the bills. You're a pro; stop looking like an amateur.",
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
