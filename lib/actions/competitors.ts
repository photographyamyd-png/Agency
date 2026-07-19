"use server";

import { revalidatePath } from "next/cache";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/session";

export async function getCompetitors(clientId: string) {
  await requireAdmin();
  return prisma.competitor.findMany({
    where: { clientId },
    orderBy: { createdAt: "asc" },
  });
}

export async function upsertCompetitor(formData: FormData) {
  await requireAdmin();
  const id = formData.get("id") as string | null;
  const clientId = formData.get("clientId") as string;
  const name = formData.get("name") as string;
  const url = formData.get("url") as string;

  const data = {
    name: name || null,
    url,
    gbpPrimaryCategory: (formData.get("gbpPrimaryCategory") as string) || null,
    gbpSecondaryCategories: formData.get("gbpSecondaryCategories")
      ? (formData.get("gbpSecondaryCategories") as string)
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : [],
    reviewCount: formData.get("reviewCount")
      ? parseInt(formData.get("reviewCount") as string, 10)
      : null,
    avgRating: formData.get("avgRating")
      ? parseFloat(formData.get("avgRating") as string)
      : null,
    photoCount: formData.get("photoCount")
      ? parseInt(formData.get("photoCount") as string, 10)
      : null,
    geoGridNotes: (formData.get("geoGridNotes") as string) || null,
    qaNotes: (formData.get("qaNotes") as string) || null,
    postsNotes: (formData.get("postsNotes") as string) || null,
    servicesNotes: (formData.get("servicesNotes") as string) || null,
    reviewVelocity: (formData.get("reviewVelocity") as string) || null,
    semanticPhrases: formData.get("semanticPhrases")
      ? (formData.get("semanticPhrases") as string)
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean)
      : [],
  };

  if (id) {
    await prisma.competitor.update({ where: { id }, data });
  } else {
    await prisma.competitor.create({ data: { clientId, ...data } });
  }

  revalidatePath(`/clients/${clientId}`);
}

export async function deleteCompetitor(id: string, clientId: string) {
  await requireAdmin();
  await prisma.competitor.delete({ where: { id } });
  revalidatePath(`/clients/${clientId}`);
}

export async function getGeoGridSnapshots(clientId: string) {
  await requireAdmin();
  return prisma.geoGridSnapshot.findMany({
    where: { clientId },
    orderBy: { capturedAt: "desc" },
  });
}

export async function createGeoGridSnapshot(formData: FormData) {
  await requireAdmin();
  const clientId = formData.get("clientId") as string;
  await prisma.geoGridSnapshot.create({
    data: {
      clientId,
      seedPhrase: formData.get("seedPhrase") as string,
      notes: (formData.get("notes") as string) || null,
      screenshotUrl: (formData.get("screenshotUrl") as string) || null,
    },
  });
  revalidatePath(`/clients/${clientId}`);
}

export async function generateActionPlanFromResearch(clientId: string) {
  await requireAdmin();

  const [competitors, keywords] = await Promise.all([
    prisma.competitor.findMany({ where: { clientId }, take: 3 }),
    prisma.keyword.findMany({ where: { clientId } }),
  ]);

  const items: Prisma.ActionPlanItemCreateManyInput[] = [];

  if (competitors.length < 3) {
    items.push({
      clientId,
      title: "Complete map-pack competitor audit (top 3)",
      priority: "URGENT",
      owner: "admin",
    });
  }

  const withoutIntent = keywords.filter((k) => !k.intent);
  if (withoutIntent.length > 0) {
    items.push({
      clientId,
      title: `Tag intent tier on ${withoutIntent.length} keywords`,
      priority: "QUICK_WIN",
      owner: "admin",
    });
  }

  const phrases = competitors.flatMap((c) => {
    const raw = c.semanticPhrases;
    return Array.isArray(raw) ? (raw as string[]) : [];
  });
  if (phrases.length > 0) {
    items.push({
      clientId,
      title: `Integrate ${phrases.length} competitor semantic phrases into content and GBP`,
      description: phrases.slice(0, 5).join(", "),
      priority: "MEDIUM",
      owner: "admin",
    });
  }

  if (items.length > 0) {
    await prisma.actionPlanItem.createMany({ data: items });
  }

  revalidatePath(`/clients/${clientId}`);
  return items.length;
}
