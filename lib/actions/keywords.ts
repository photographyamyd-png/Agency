"use server";

import { revalidatePath } from "next/cache";
import type { KeywordIntent } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/session";
import { emitKeywordChanged } from "@/lib/keywords";

export async function getKeywords(clientId: string) {
  await requireAdmin();
  return prisma.keyword.findMany({
    where: { clientId },
    include: {
      pages: { select: { id: true, name: true, slug: true } },
      rankSnapshots: { orderBy: { capturedAt: "desc" }, take: 2 },
    },
    orderBy: { term: "asc" },
  });
}

export async function createKeyword(formData: FormData) {
  await requireAdmin();
  const clientId = formData.get("clientId") as string;
  const term = formData.get("term") as string;
  const intent = (formData.get("intent") as KeywordIntent) || null;

  if (!clientId || !term) return;

  const keyword = await prisma.keyword.create({
    data: { clientId, term, intent },
  });

  await emitKeywordChanged(clientId, keyword.id, "created", term);
  revalidatePath(`/clients/${clientId}`);
}

export async function updateKeywordIntent(keywordId: string, intent: KeywordIntent) {
  await requireAdmin();
  const keyword = await prisma.keyword.update({
    where: { id: keywordId },
    data: { intent },
  });
  await emitKeywordChanged(keyword.clientId, keywordId, "updated", keyword.term);
  revalidatePath(`/clients/${keyword.clientId}`);
}

export async function deleteKeyword(keywordId: string) {
  await requireAdmin();
  const keyword = await prisma.keyword.findUnique({ where: { id: keywordId } });
  if (!keyword) return;
  await prisma.keyword.delete({ where: { id: keywordId } });
  await emitKeywordChanged(keyword.clientId, keywordId, "deleted", keyword.term);
  revalidatePath(`/clients/${keyword.clientId}`);
}

export async function assignKeywordToPage(keywordId: string, pageNodeId: string | null) {
  await requireAdmin();
  const keyword = await prisma.keyword.findUnique({
    where: { id: keywordId },
    include: { pages: true },
  });
  if (!keyword) return;

  if (pageNodeId) {
    await prisma.pageNode.update({
      where: { id: pageNodeId },
      data: { primaryKeywordId: keywordId },
    });
  }

  await emitKeywordChanged(keyword.clientId, keywordId, "updated", keyword.term);
  revalidatePath(`/clients/${keyword.clientId}`);
}
