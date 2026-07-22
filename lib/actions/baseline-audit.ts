"use server";

import { revalidatePath } from "next/cache";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/session";
import {
  BASELINE_AUDIT_ITEMS,
  emptyBaselineAudit,
  type BaselineAuditData,
  type BaselineAuditItemKey,
} from "@/lib/blueprint/phase-1-intake";
import { baselineAuditDataSchema } from "@/lib/validation/blueprint";
import { emitSystemEvent } from "@/lib/events/emit";

export async function getBaselineAudit(clientId: string) {
  await requireAdmin();
  const audit = await prisma.baselineAudit.findFirst({
    where: { clientId },
    orderBy: { capturedAt: "desc" },
  });
  if (!audit) return { data: emptyBaselineAudit(), id: null };
  const parsed = baselineAuditDataSchema.safeParse(audit.dataJson);
  return {
    id: audit.id,
    data: parsed.success ? parsed.data : emptyBaselineAudit(),
    capturedAt: audit.capturedAt,
  };
}

export async function saveBaselineAuditItem(
  clientId: string,
  itemKey: BaselineAuditItemKey,
  status: "pending" | "done" | "na",
  notes?: string
) {
  await requireAdmin();

  const existing = await prisma.baselineAudit.findFirst({
    where: { clientId },
    orderBy: { capturedAt: "desc" },
  });

  const parsedExisting = existing
    ? baselineAuditDataSchema.safeParse(existing.dataJson)
    : null;
  const current: BaselineAuditData = parsedExisting?.success
    ? parsedExisting.data
    : emptyBaselineAudit();

  current[itemKey] = {
    status,
    notes,
    completedAt: status === "done" ? new Date().toISOString() : undefined,
  };

  if (existing) {
    await prisma.baselineAudit.update({
      where: { id: existing.id },
      data: { dataJson: current as unknown as Prisma.InputJsonValue },
    });
  } else {
    await prisma.baselineAudit.create({
      data: { clientId, dataJson: current as unknown as Prisma.InputJsonValue },
    });
  }

  const doneCount = Object.values(current).filter((v) => v.status === "done").length;
  if (doneCount === BASELINE_AUDIT_ITEMS.length) {
    await emitSystemEvent({
      type: "CLIENT_CREATED",
      clientId,
      payload: { action: "baseline_audit_complete" },
    });
  }

  try {
    const { maybeAutoGenerateBaselineReport } = await import("@/lib/reports/generate");
    await maybeAutoGenerateBaselineReport(clientId);
  } catch {
    // non-fatal
  }

  revalidatePath(`/clients/${clientId}`);
}

export async function saveBusinessIntel(
  clientId: string,
  data: Record<string, string>
) {
  await requireAdmin();
  await prisma.brandProfile.upsert({
    where: { clientId },
    create: {
      clientId,
      businessIntelJson: data as Prisma.InputJsonValue,
      gbpCategoriesSecondary: [],
      serviceAreas: [],
      exampleSites: [],
    },
    update: { businessIntelJson: data as Prisma.InputJsonValue },
  });
  revalidatePath(`/clients/${clientId}`);
}

export async function getBusinessIntel(clientId: string) {
  await requireAdmin();
  const profile = await prisma.brandProfile.findUnique({ where: { clientId } });
  return (profile?.businessIntelJson as Record<string, string> | null) ?? {};
}
