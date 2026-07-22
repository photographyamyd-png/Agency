"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/session";
import {
  generateBaselineReport,
  isBaselineReportReady,
  sendBaselineReport,
} from "@/lib/reports/generate";

export async function generateBaselineReportAction(
  clientId: string,
  force = false
) {
  await requireAdmin();
  const report = await generateBaselineReport(clientId, { force });
  revalidatePath(`/clients/${clientId}`);
  return { id: report.id, createdAt: report.createdAt, sentAt: report.sentAt };
}

export async function sendBaselineReportAction(clientId: string) {
  await requireAdmin();
  const report = await sendBaselineReport(clientId);
  revalidatePath(`/clients/${clientId}`);
  return {
    id: report?.id ?? null,
    sentAt: report?.sentAt ?? null,
    emailed: !!report?.sentAt,
  };
}

export async function getBaselineReportReadyAction(clientId: string) {
  await requireAdmin();
  return isBaselineReportReady(clientId);
}
