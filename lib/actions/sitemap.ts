"use server";

import { revalidatePath } from "next/cache";
import type { PageType, PageStatus, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/session";
import { DEFAULT_SITEMAP_TEMPLATE } from "@/lib/blueprint/page-templates";
import { ON_PAGE_SEO_CHECKLIST } from "@/lib/blueprint/seo-checklist-keys";

export async function getPageNodes(clientId: string) {
  await requireAdmin();
  return prisma.pageNode.findMany({
    where: { clientId },
    include: {
      primaryKeyword: true,
      seoItems: true,
      schemaItems: true,
      children: { include: { primaryKeyword: true } },
    },
    orderBy: { order: "asc" },
  });
}

export async function seedSitemapFromTemplate(clientId: string) {
  await requireAdmin();
  const existing = await prisma.pageNode.count({ where: { clientId } });
  if (existing > 0) return;

  async function createNode(
    template: (typeof DEFAULT_SITEMAP_TEMPLATE)[0],
    parentId?: string,
    order = 0
  ) {
    const node = await prisma.pageNode.create({
      data: {
        clientId,
        parentId,
        name: template.name,
        slug: template.slug,
        pageType: template.pageType,
        order,
        status: "PLANNED",
      },
    });

    await prisma.sEOChecklistItem.createMany({
      data: ON_PAGE_SEO_CHECKLIST.map((item) => ({
        pageNodeId: node.id,
        category: item.category,
        itemKey: item.itemKey,
        label: item.label,
      })),
      skipDuplicates: true,
    });

    if (template.children) {
      for (let i = 0; i < template.children.length; i++) {
        await createNode(template.children[i]!, node.id, i);
      }
    }
  }

  for (let i = 0; i < DEFAULT_SITEMAP_TEMPLATE.length; i++) {
    await createNode(DEFAULT_SITEMAP_TEMPLATE[i]!, undefined, i);
  }

  revalidatePath(`/clients/${clientId}`);
}

export async function createPageNode(formData: FormData) {
  await requireAdmin();
  const clientId = formData.get("clientId") as string;
  const name = formData.get("name") as string;
  const slug = formData.get("slug") as string;
  const pageType = formData.get("pageType") as PageType;
  const parentId = (formData.get("parentId") as string) || null;

  const node = await prisma.pageNode.create({
    data: { clientId, name, slug, pageType, parentId, status: "PLANNED" },
  });

  await prisma.sEOChecklistItem.createMany({
    data: ON_PAGE_SEO_CHECKLIST.map((item) => ({
      pageNodeId: node.id,
      category: item.category,
      itemKey: item.itemKey,
      label: item.label,
    })),
  });

  revalidatePath(`/clients/${clientId}`);
}

export async function updatePageStatus(pageNodeId: string, status: PageStatus) {
  await requireAdmin();
  const node = await prisma.pageNode.update({
    where: { id: pageNodeId },
    data: { status },
  });
  revalidatePath(`/clients/${node.clientId}`);
}

export async function updateSeoChecklistItem(
  itemId: string,
  status: "PENDING" | "DONE" | "NA",
  value?: Record<string, unknown>
) {
  await requireAdmin();
  const item = await prisma.sEOChecklistItem.update({
    where: { id: itemId },
    data: {
      status,
      value: value ? (value as unknown as Prisma.InputJsonValue) : undefined,
      checkedAt: status === "DONE" ? new Date() : null,
    },
    include: { pageNode: true },
  });
  revalidatePath(`/clients/${item.pageNode.clientId}`);
}

export async function getTechnicalHealthLogs(clientId: string) {
  await requireAdmin();
  return prisma.technicalHealthLog.findMany({
    where: { clientId },
    orderBy: { capturedAt: "desc" },
    take: 10,
  });
}

export async function saveTechnicalAuditNotes(
  clientId: string,
  notes: Record<string, { status: string; notes?: string }>
) {
  await requireAdmin();
  const existing = await prisma.technicalHealthLog.findFirst({
    where: { clientId },
    orderBy: { capturedAt: "desc" },
  });

  const pagespeedScores = notes as Record<string, unknown>;

  if (existing) {
    await prisma.technicalHealthLog.update({
      where: { id: existing.id },
      data: { pagespeedScores: pagespeedScores as unknown as Prisma.InputJsonValue },
    });
  } else {
    await prisma.technicalHealthLog.create({
      data: { clientId, pagespeedScores: pagespeedScores as unknown as Prisma.InputJsonValue },
    });
  }

  revalidatePath(`/clients/${clientId}`);
}
