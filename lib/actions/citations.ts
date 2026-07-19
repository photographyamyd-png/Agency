"use server";

import { revalidatePath } from "next/cache";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/session";
import { goldenNapSchema, reviewTargetsSchema } from "@/lib/validation/blueprint";

export async function getCitations(clientId: string) {
  await requireAdmin();
  return prisma.citationRecord.findMany({
    where: { clientId },
    orderBy: { directory: "asc" },
  });
}

export async function updateCitationStatus(
  id: string,
  status: string,
  url?: string
) {
  await requireAdmin();
  const citation = await prisma.citationRecord.update({
    where: { id },
    data: { status, url: url ?? undefined, lastCheckedAt: new Date() },
  });
  revalidatePath(`/clients/${citation.clientId}`);
}

export async function saveGoldenNap(clientId: string, data: unknown) {
  await requireAdmin();
  const parsed = goldenNapSchema.safeParse(data);
  if (!parsed.success) return { error: "Invalid NAP data" };

  await prisma.brandProfile.upsert({
    where: { clientId },
    create: {
      clientId,
      goldenNapJson: parsed.data as Prisma.InputJsonValue,
      gbpCategoriesSecondary: [],
      serviceAreas: [],
      exampleSites: [],
    },
    update: { goldenNapJson: parsed.data as Prisma.InputJsonValue },
  });

  revalidatePath(`/clients/${clientId}`);
  return { success: true };
}

export async function getGoldenNap(clientId: string) {
  await requireAdmin();
  const profile = await prisma.brandProfile.findUnique({ where: { clientId } });
  return profile?.goldenNapJson ?? null;
}

export async function saveReviewTargets(clientId: string, data: unknown) {
  await requireAdmin();
  const parsed = reviewTargetsSchema.safeParse(data);
  if (!parsed.success) return { error: "Invalid review targets" };

  await prisma.brandProfile.upsert({
    where: { clientId },
    create: {
      clientId,
      reviewTargetsJson: parsed.data as Prisma.InputJsonValue,
      gbpCategoriesSecondary: [],
      serviceAreas: [],
      exampleSites: [],
    },
    update: { reviewTargetsJson: parsed.data as Prisma.InputJsonValue },
  });

  revalidatePath(`/clients/${clientId}`);
  return { success: true };
}

export async function getReviewSnapshots(clientId: string) {
  await requireAdmin();
  return prisma.reviewSnapshot.findMany({
    where: { clientId },
    orderBy: { capturedAt: "desc" },
  });
}

export async function getGbpActivity(clientId: string) {
  await requireAdmin();
  return prisma.gBPActivityLog.findMany({
    where: { clientId },
    orderBy: { postedAt: "desc" },
    take: 20,
  });
}

export async function logGbpActivity(formData: FormData) {
  await requireAdmin();
  const clientId = formData.get("clientId") as string;
  await prisma.gBPActivityLog.create({
    data: {
      clientId,
      type: (formData.get("type") as string) || "POST",
      content: (formData.get("content") as string) || null,
      ctaType: (formData.get("ctaType") as string) || null,
      destinationUrl: (formData.get("destinationUrl") as string) || null,
      utmParams: (formData.get("utmParams") as string) || null,
      photoAttached: formData.get("photoAttached") === "on",
    },
  });
  revalidatePath(`/clients/${clientId}`);
}
