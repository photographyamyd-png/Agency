"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/session";
import { encrypt, decrypt, isEncryptionConfigured } from "@/lib/crypto/encryption";

export async function getVaultEntries(clientId: string) {
  await requireAdmin();
  return prisma.credentialVaultEntry.findMany({
    where: { clientId, revoked: false },
    orderBy: { label: "asc" },
    select: {
      id: true,
      label: true,
      url: true,
      lastAccessedAt: true,
      createdAt: true,
      revoked: true,
    },
  });
}

export async function createVaultEntry(formData: FormData): Promise<void> {
  await requireAdmin();
  if (!isEncryptionConfigured()) {
    return;
  }

  const clientId = formData.get("clientId") as string;
  const label = formData.get("label") as string;
  const url = (formData.get("url") as string) || null;
  const username = (formData.get("username") as string) || null;
  const password = (formData.get("password") as string) || null;
  const notes = (formData.get("notes") as string) || null;

  await prisma.credentialVaultEntry.create({
    data: {
      clientId,
      label,
      url,
      usernameEnc: username ? encrypt(username) : null,
      passwordEnc: password ? encrypt(password) : null,
      notesEnc: notes ? encrypt(notes) : null,
    },
  });

  revalidatePath(`/clients/${clientId}`);
}

export async function revealVaultEntry(entryId: string) {
  await requireAdmin();
  if (!isEncryptionConfigured()) {
    return { error: "ENCRYPTION_KEY not configured" };
  }

  const entry = await prisma.credentialVaultEntry.findUnique({
    where: { id: entryId },
  });
  if (!entry || entry.revoked) return { error: "Entry not found" };

  await prisma.vaultAccessLog.create({
    data: { entryId, action: "DECRYPT" },
  });

  await prisma.credentialVaultEntry.update({
    where: { id: entryId },
    data: { lastAccessedAt: new Date() },
  });

  return {
    label: entry.label,
    url: entry.url,
    username: entry.usernameEnc ? decrypt(entry.usernameEnc) : null,
    password: entry.passwordEnc ? decrypt(entry.passwordEnc) : null,
    notes: entry.notesEnc ? decrypt(entry.notesEnc) : null,
  };
}

export async function revokeVaultEntry(entryId: string) {
  await requireAdmin();
  const entry = await prisma.credentialVaultEntry.update({
    where: { id: entryId },
    data: { revoked: true },
  });
  revalidatePath(`/clients/${entry.clientId}`);
}
