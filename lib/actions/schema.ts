"use server";

import { revalidatePath } from "next/cache";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/session";
import { SCHEMA_TEMPLATES } from "@/lib/blueprint/schema-templates";

export async function getSchemaMarkups(pageNodeId: string) {
  await requireAdmin();
  return prisma.schemaMarkup.findMany({
    where: { pageNodeId },
    orderBy: { type: "asc" },
  });
}

export async function createSchemaFromTemplate(
  pageNodeId: string,
  schemaType: string
) {
  await requireAdmin();
  const template = SCHEMA_TEMPLATES.find((t) => t.type === schemaType);
  if (!template) return;

  const page = await prisma.pageNode.findUnique({ where: { id: pageNodeId } });
  if (!page) return;

  await prisma.schemaMarkup.create({
    data: {
      pageNodeId,
      type: schemaType,
      jsonLd: template.template as Prisma.InputJsonValue,
      validated: false,
    },
  });

  revalidatePath(`/clients/${page.clientId}`);
}

export async function updateSchemaJsonLd(id: string, jsonLd: unknown) {
  await requireAdmin();
  const schema = await prisma.schemaMarkup.update({
    where: { id },
    data: { jsonLd: jsonLd as Prisma.InputJsonValue },
    include: { pageNode: true },
  });
  revalidatePath(`/clients/${schema.pageNode.clientId}`);
}

export async function checkNapConsistency(clientId: string, schemaJsonLd: Record<string, unknown>) {
  const profile = await prisma.brandProfile.findUnique({ where: { clientId } });
  const golden = profile?.goldenNapJson as {
    businessName?: string;
    phone?: string;
    streetAddress?: string;
  } | null;

  if (!golden?.businessName) return { consistent: null, warnings: ["Golden Record NAP not established"] };

  const warnings: string[] = [];
  const schemaName = schemaJsonLd.name as string | undefined;
  const schemaPhone = schemaJsonLd.telephone as string | undefined;

  if (schemaName && schemaName !== golden.businessName) {
    warnings.push(`Name mismatch: schema "${schemaName}" vs Golden Record "${golden.businessName}"`);
  }
  if (schemaPhone && golden.phone && schemaPhone !== golden.phone) {
    warnings.push(`Phone mismatch: schema "${schemaPhone}" vs Golden Record "${golden.phone}"`);
  }

  return { consistent: warnings.length === 0, warnings };
}
