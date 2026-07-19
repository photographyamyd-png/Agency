"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/session";

export async function getLocalLinks(clientId: string) {
  await requireAdmin();
  return prisma.localLinkRecord.findMany({
    where: { clientId },
    orderBy: { createdAt: "desc" },
  });
}

export async function createLocalLink(formData: FormData) {
  await requireAdmin();
  const clientId = formData.get("clientId") as string;
  await prisma.localLinkRecord.create({
    data: {
      clientId,
      sourceType: formData.get("sourceType") as string,
      sourceName: formData.get("sourceName") as string,
      url: (formData.get("url") as string) || null,
      status: (formData.get("status") as string) || "PROSPECT",
      outreachNotes: (formData.get("outreachNotes") as string) || null,
    },
  });
  revalidatePath(`/clients/${clientId}`);
}

export async function updateLocalLinkStatus(id: string, status: string) {
  await requireAdmin();
  const link = await prisma.localLinkRecord.update({
    where: { id },
    data: {
      status,
      acquiredAt: status === "ACQUIRED" ? new Date() : undefined,
    },
  });
  revalidatePath(`/clients/${link.clientId}`);
}

export async function getContentCalendar(clientId: string) {
  await requireAdmin();
  return prisma.contentCalendarItem.findMany({
    where: { clientId },
    include: { targetKeyword: true },
    orderBy: { publishedAt: "desc" },
  });
}

export async function createContentItem(formData: FormData) {
  await requireAdmin();
  const clientId = formData.get("clientId") as string;
  await prisma.contentCalendarItem.create({
    data: {
      clientId,
      title: formData.get("title") as string,
      type: (formData.get("type") as string) || "BLOG",
      status: "PLANNED",
      targetKeywordId: (formData.get("targetKeywordId") as string) || null,
    },
  });
  revalidatePath(`/clients/${clientId}`);
}

export async function updateContentStatus(id: string, status: string) {
  await requireAdmin();
  const item = await prisma.contentCalendarItem.update({
    where: { id },
    data: {
      status,
      publishedAt: status === "PUBLISHED" ? new Date() : undefined,
    },
  });
  revalidatePath(`/clients/${item.clientId}`);
}
