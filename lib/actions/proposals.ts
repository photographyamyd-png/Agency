"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { randomBytes } from "crypto";
import type { ProposalStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/session";
import { PRICING_PACKAGES } from "@/lib/blueprint/pricing-packages";
import { emitSystemEvent } from "@/lib/events/emit";

export async function getProposals() {
  await requireAdmin();
  return prisma.proposal.findMany({
    orderBy: { updatedAt: "desc" },
    include: {
      client: { select: { id: true, legalBusinessName: true } },
      lineItems: true,
      _count: { select: { lineItems: true } },
    },
  });
}

export async function getProposal(id: string) {
  await requireAdmin();
  return prisma.proposal.findUnique({
    where: { id },
    include: {
      client: true,
      lineItems: true,
    },
  });
}

export async function createProposalFromPackage(
  clientId: string,
  packageId: string
) {
  await requireAdmin();

  const pkg = PRICING_PACKAGES.find((p) => p.id === packageId);
  if (!pkg) throw new Error("Package not found");

  const proposal = await prisma.proposal.create({
    data: {
      clientId,
      scopeIncluded: pkg.scopeIncluded,
      lineItems: {
        create: pkg.lineItems.map((item) => ({
          description: item.description,
          quantity: 1,
          unitPrice: item.unitPrice,
          total: item.unitPrice,
        })),
      },
    },
  });

  revalidatePath("/proposals");
  redirect(`/proposals/${proposal.id}`);
}

export async function createProposal(formData: FormData) {
  await requireAdmin();
  const clientId = formData.get("clientId") as string;
  const packageId = formData.get("packageId") as string;
  if (!clientId || !packageId) return;
  await createProposalFromPackage(clientId, packageId);
}

export async function updateProposalStatus(id: string, status: ProposalStatus) {
  await requireAdmin();
  const data: { status: ProposalStatus; signToken?: string; signTokenExpiresAt?: Date } = { status };

  if (status === "SENT") {
    data.signToken = randomBytes(32).toString("hex");
    data.signTokenExpiresAt = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
  }

  const proposal = await prisma.proposal.update({
    where: { id },
    data,
    include: { client: true },
  });

  if (status === "SENT") {
    await emitSystemEvent({
      type: "CLIENT_CREATED",
      clientId: proposal.clientId,
      payload: { action: "proposal_sent", proposalId: id },
    });
  }

  revalidatePath("/proposals");
  revalidatePath(`/proposals/${id}`);
}

export async function sendProposalAction(formData: FormData) {
  const id = formData.get("id") as string;
  if (id) await updateProposalStatus(id, "SENT");
}

export async function signProposal(
  token: string,
  signatureDataUrl: string,
  signedIp?: string
) {
  const proposal = await prisma.proposal.findUnique({
    where: { signToken: token },
  });

  if (!proposal || !proposal.signTokenExpiresAt || proposal.signTokenExpiresAt < new Date()) {
    return { error: "Invalid or expired signing link" };
  }

  await prisma.proposal.update({
    where: { id: proposal.id },
    data: {
      status: "SIGNED",
      signatureDataUrl,
      signedAt: new Date(),
      signedIp: signedIp ?? null,
      signToken: null,
      signTokenExpiresAt: null,
    },
  });

  await emitSystemEvent({
    type: "CLIENT_CREATED",
    clientId: proposal.clientId,
    payload: { action: "proposal_signed", proposalId: proposal.id },
  });

  return { success: true };
}

export async function getProposalBySignToken(token: string) {
  return prisma.proposal.findUnique({
    where: { signToken: token },
    include: {
      client: { select: { legalBusinessName: true } },
      lineItems: true,
    },
  });
}

export async function getClientsForProposal() {
  await requireAdmin();
  return prisma.client.findMany({
    orderBy: { legalBusinessName: "asc" },
    select: { id: true, legalBusinessName: true },
  });
}
