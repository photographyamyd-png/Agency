"use server";

import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/session";

export async function updateAgencyProfile(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id") ?? "");
  const businessName = String(formData.get("businessName") ?? "");
  const tagline = String(formData.get("tagline") ?? "") || null;
  const heroHeadline = String(formData.get("heroHeadline") ?? "") || null;
  const heroSubhead = String(formData.get("heroSubhead") ?? "") || null;
  const email = String(formData.get("email") ?? "") || null;
  const phone = String(formData.get("phone") ?? "") || null;
  const autoOnboard = formData.get("autoOnboardWebsiteLeads") === "on";

  const logoUrl = String(formData.get("logoUrl") ?? "") || null;
  const heroImageUrl = String(formData.get("heroImageUrl") ?? "") || null;
  const heroImageAlt = String(formData.get("heroImageAlt") ?? "") || null;
  const servicesWebsite = String(formData.get("servicesWebsite") ?? "") || null;
  const servicesSeo = String(formData.get("servicesSeo") ?? "") || null;
  const servicesReporting = String(formData.get("servicesReporting") ?? "") || null;
  const resultsImage1 = String(formData.get("resultsImage1") ?? "") || null;
  const resultsImage2 = String(formData.get("resultsImage2") ?? "") || null;

  const servicesImages =
    servicesWebsite || servicesSeo || servicesReporting
      ? {
          ...(servicesWebsite ? { WEBSITE: servicesWebsite } : {}),
          ...(servicesSeo ? { SEO: servicesSeo } : {}),
          ...(servicesReporting ? { REPORTING: servicesReporting } : {}),
        }
      : null;

  const resultsImages = [resultsImage1, resultsImage2].filter(Boolean);
  const resultsJson = resultsImages.length > 0 ? resultsImages : null;

  if (!businessName) return;

  const data = {
    businessName,
    tagline,
    heroHeadline,
    heroSubhead,
    email,
    phone,
    logoUrl,
    heroImageUrl,
    heroImageAlt,
    servicesImages: servicesImages
      ? (servicesImages as Prisma.InputJsonValue)
      : Prisma.DbNull,
    resultsImages: resultsJson
      ? (resultsJson as Prisma.InputJsonValue)
      : Prisma.DbNull,
    autoOnboardWebsiteLeads: autoOnboard,
  };

  if (id) {
    await prisma.agencyProfile.update({
      where: { id },
      data,
    });
  } else {
    await prisma.agencyProfile.create({
      data,
    });
  }

  revalidatePath("/");
  revalidatePath("/settings/agency");
}

export async function updateOnboardingTemplate(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id") ?? "");
  const welcomeEmailSubject = String(formData.get("welcomeEmailSubject") ?? "");
  const welcomeEmailBody = String(formData.get("welcomeEmailBody") ?? "");

  if (!id) return;

  await prisma.onboardingTemplate.update({
    where: { id },
    data: { welcomeEmailSubject, welcomeEmailBody },
  });

  revalidatePath("/settings/onboarding");
}

export async function getOnboardingTemplates() {
  await requireAdmin();
  return prisma.onboardingTemplate.findMany({
    orderBy: { createdAt: "asc" },
    include: { _count: { select: { rules: true, sessions: true } } },
  });
}

export async function updateQuestionnaireFields(
  templateId: string,
  fields: unknown[]
) {
  await requireAdmin();
  await prisma.onboardingTemplate.update({
    where: { id: templateId },
    data: { questionnaire: { fields } as Prisma.InputJsonValue },
  });
  revalidatePath("/settings/onboarding");
}

export async function getAgencyProfileForSettings() {
  await requireAdmin();
  return prisma.agencyProfile.findFirst();
}
