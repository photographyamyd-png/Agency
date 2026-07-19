"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/session";

export async function updateActionPlanItem(
  itemId: string,
  status: string,
  clientId: string
) {
  await requireAdmin();
  await prisma.actionPlanItem.update({
    where: { id: itemId },
    data: { status },
  });
  revalidatePath(`/clients/${clientId}`);
}

export async function deleteActionPlanItem(itemId: string, clientId: string) {
  await requireAdmin();
  await prisma.actionPlanItem.delete({ where: { id: itemId } });
  revalidatePath(`/clients/${clientId}`);
}
