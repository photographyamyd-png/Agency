"use server";

import { revalidatePath } from "next/cache";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/session";
import {
  emptyGeoReadiness,
  type GeoReadinessData,
  type GeoReadinessItemKey,
} from "@/lib/blueprint/geo-readiness";
import {
  emptySiteChecklist,
  type SiteChecklistData,
  type SiteChecklistItemKey,
} from "@/lib/blueprint/site-checklist";

async function getBrandProfileJson(clientId: string) {
  return prisma.brandProfile.findUnique({ where: { clientId } });
}

export async function saveGeoReadinessItem(
  clientId: string,
  itemKey: GeoReadinessItemKey,
  status: "pending" | "done" | "na",
  notes?: string
) {
  await requireAdmin();
  const profile = await getBrandProfileJson(clientId);
  const current: GeoReadinessData =
    (profile?.geoReadinessJson as GeoReadinessData | null) ?? emptyGeoReadiness();

  current[itemKey] = {
    status,
    notes,
    completedAt: status === "done" ? new Date().toISOString() : undefined,
  };

  await prisma.brandProfile.upsert({
    where: { clientId },
    create: {
      clientId,
      geoReadinessJson: current as unknown as Prisma.InputJsonValue,
      gbpCategoriesSecondary: [],
      serviceAreas: [],
      exampleSites: [],
    },
    update: {
      geoReadinessJson: current as unknown as Prisma.InputJsonValue,
    },
  });

  revalidatePath(`/clients/${clientId}`);
}

export async function saveSiteChecklistItem(
  clientId: string,
  itemKey: SiteChecklistItemKey,
  status: "pending" | "done" | "na",
  notes?: string
) {
  await requireAdmin();
  const profile = await getBrandProfileJson(clientId);
  const current: SiteChecklistData =
    (profile?.siteSeoChecklistJson as SiteChecklistData | null) ??
    emptySiteChecklist();

  current[itemKey] = {
    status,
    notes,
    completedAt: status === "done" ? new Date().toISOString() : undefined,
  };

  await prisma.brandProfile.upsert({
    where: { clientId },
    create: {
      clientId,
      siteSeoChecklistJson: current as unknown as Prisma.InputJsonValue,
      gbpCategoriesSecondary: [],
      serviceAreas: [],
      exampleSites: [],
    },
    update: {
      siteSeoChecklistJson: current as unknown as Prisma.InputJsonValue,
    },
  });

  revalidatePath(`/clients/${clientId}`);
}

export async function ensureSiteChecklistsSeeded(clientId: string) {
  await requireAdmin();
  const profile = await getBrandProfileJson(clientId);
  if (!profile) {
    await prisma.brandProfile.create({
      data: {
        clientId,
        geoReadinessJson: emptyGeoReadiness() as unknown as Prisma.InputJsonValue,
        siteSeoChecklistJson: emptySiteChecklist() as unknown as Prisma.InputJsonValue,
        gbpCategoriesSecondary: [],
        serviceAreas: [],
        exampleSites: [],
      },
    });
    return;
  }

  const updates: Prisma.BrandProfileUpdateInput = {};
  if (!profile.geoReadinessJson) {
    updates.geoReadinessJson = emptyGeoReadiness() as unknown as Prisma.InputJsonValue;
  }
  if (!profile.siteSeoChecklistJson) {
    updates.siteSeoChecklistJson = emptySiteChecklist() as unknown as Prisma.InputJsonValue;
  }
  if (Object.keys(updates).length > 0) {
    await prisma.brandProfile.update({ where: { clientId }, data: updates });
  }
}
