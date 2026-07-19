"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/session";
import { generateMonthlyMaintenanceChecklist } from "@/lib/blueprint/instantiate";

export async function getMaintenanceChecklist(clientId: string, month?: number, year?: number) {
  await requireAdmin();
  const now = new Date();
  const periodMonth = month ?? now.getMonth() + 1;
  const periodYear = year ?? now.getFullYear();

  let checklist = await prisma.maintenanceChecklist.findUnique({
    where: {
      clientId_periodMonth_periodYear: { clientId, periodMonth, periodYear },
    },
    include: { items: { orderBy: { order: "asc" } } },
  });

  if (!checklist) {
    const created = await generateMonthlyMaintenanceChecklist(clientId, periodMonth, periodYear);
    if (created) {
      checklist = await prisma.maintenanceChecklist.findUnique({
        where: { id: created.id },
        include: { items: { orderBy: { order: "asc" } } },
      });
    }
  }

  return checklist;
}

export async function updateMaintenanceItem(
  itemId: string,
  status: "PENDING" | "DONE" | "NA"
) {
  await requireAdmin();
  const item = await prisma.maintenanceChecklistItem.update({
    where: { id: itemId },
    data: {
      status,
      completedAt: status === "DONE" ? new Date() : null,
    },
    include: { checklist: true },
  });

  const allDone = await prisma.maintenanceChecklistItem.count({
    where: {
      checklistId: item.checklistId,
      status: { not: "DONE" },
    },
  });

  if (allDone === 0) {
    await prisma.maintenanceChecklist.update({
      where: { id: item.checklistId },
      data: { completedAt: new Date() },
    });
  }

  revalidatePath(`/clients/${item.checklist.clientId}`);
}

export async function getSystemEvents(limit = 50) {
  await requireAdmin();
  return prisma.systemEvent.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
    include: {
      client: { select: { id: true, legalBusinessName: true } },
    },
  });
}
