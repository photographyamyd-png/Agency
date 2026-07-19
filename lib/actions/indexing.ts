"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/session";
import { submitUrlForIndexing, isIndexingApiConfigured } from "@/lib/google/indexing";

export async function submitPageForIndexing(pageNodeId: string) {
  await requireAdmin();

  const page = await prisma.pageNode.findUnique({
    where: { id: pageNodeId },
    include: { client: { include: { brandProfile: true } } },
  });
  if (!page) throw new Error("Page not found");

  const baseUrl =
    page.client.brandProfile?.existingSiteUrl ??
    (page.client.brandProfile?.domain
      ? `https://${page.client.brandProfile.domain}`
      : null);

  if (!baseUrl) {
    await prisma.pageNode.update({
      where: { id: pageNodeId },
      data: { indexStatus: "ERROR" },
    });
    throw new Error("Client site URL not configured");
  }

  const slug = page.slug.startsWith("/") ? page.slug : `/${page.slug}`;
  const url = slug === "/" ? baseUrl.replace(/\/$/, "") : `${baseUrl.replace(/\/$/, "")}${slug}`;

  const now = new Date();
  let indexStatus = "SUBMITTED";

  if (isIndexingApiConfigured()) {
    const result = await submitUrlForIndexing(url);
    if (!result.ok) {
      indexStatus = "ERROR";
    }
  }

  await prisma.pageNode.update({
    where: { id: pageNodeId },
    data: {
      indexSubmittedAt: now,
      indexStatus,
      indexConfirmedAt: indexStatus === "SUBMITTED" && !isIndexingApiConfigured() ? null : undefined,
    },
  });

  revalidatePath(`/clients/${page.clientId}`);
  return { url, indexStatus, apiUsed: isIndexingApiConfigured() };
}

export async function markPageIndexed(pageNodeId: string) {
  await requireAdmin();
  const page = await prisma.pageNode.update({
    where: { id: pageNodeId },
    data: {
      indexStatus: "INDEXED",
      indexConfirmedAt: new Date(),
    },
  });
  revalidatePath(`/clients/${page.clientId}`);
}
