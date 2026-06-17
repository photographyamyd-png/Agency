/**
 * One-time: push Amy trade-focused marketing copy into the existing agency profile.
 * Run: npx tsx scripts/sync-marketing-copy.ts
 */
import { PrismaClient } from "@prisma/client";
import { MARKETING_COPY } from "../lib/agency/marketing-copy";

const prisma = new PrismaClient();

async function main() {
  const profile = await prisma.agencyProfile.findFirst();
  if (!profile) {
    console.log("No agency profile found — seed or visit the site first.");
    return;
  }

  await prisma.agencyProfile.update({
    where: { id: profile.id },
    data: {
      businessName: profile.businessName.includes("Your Web Agency")
        ? "Amy · Web for Trades"
        : profile.businessName,
      tagline: MARKETING_COPY.tagline,
      heroHeadline: MARKETING_COPY.headline,
      heroSubhead: MARKETING_COPY.subhead,
      heroImageUrl:
        "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1920&q=85",
      heroImageAlt: "Plumber on a service call — local trade business",
      servicesImages: {
        WEBSITE:
          "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&q=85",
        SEO: "https://images.unsplash.com/photo-1621905252507-b35492ba26c8?w=1200&q=85",
        REPORTING:
          "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=85",
      },
    },
  });

  console.log("Agency marketing copy synced for:", profile.id);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
