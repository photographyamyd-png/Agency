"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { prisma } from "@/lib/prisma";
import {
  authenticateClientUser,
  createMagicLink,
  hashPassword,
  verifyPassword,
} from "@/lib/auth/client";
import { sendTemplatedEmail } from "@/lib/email/gmail";
import { emitSystemEvent } from "@/lib/events/emit";
import { SYSTEM_EVENT_TYPES } from "@/lib/events/types";

export async function clientPasswordLogin(
  _prev: { error?: string } | null,
  formData: FormData
): Promise<{ error?: string } | null> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  const user = await authenticateClientUser(email, password);
  if (!user) {
    return { error: "Invalid email or password" };
  }

  try {
    await signIn("client-credentials", {
      email: user.email,
      clientId: user.clientId,
      redirectTo: "/client/dashboard",
    });
  } catch (err) {
    if (err instanceof AuthError && err.type === "CredentialsSignin") {
      return { error: "Invalid email or password" };
    }
    throw err;
  }

  return null;
}

export async function requestMagicLink(
  _prev: { error?: string; sent?: boolean } | null,
  formData: FormData
): Promise<{ error?: string; sent?: boolean } | null> {
  const email = String(formData.get("email") ?? "").toLowerCase();
  if (!email) return { error: "Email is required" };

  const token = await createMagicLink(email);
  if (!token) return { sent: true };

  const base = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
  const magicUrl = `${base.replace(/\/$/, "")}/client/login/verify?token=${token}`;

  await sendTemplatedEmail({
    to: email,
    subject: "Your client portal login link",
    bodyTemplate:
      "Hi,\n\nClick the link below to sign in to your client portal. This link expires in 1 hour.\n\n{{magicUrl}}\n\nIf you did not request this, you can ignore this email.",
    vars: { magicUrl },
  });

  return { sent: true };
}

export async function verifyMagicLinkToken(token: string) {
  const { consumeMagicLink } = await import("@/lib/auth/client");
  const user = await consumeMagicLink(token);
  if (!user) return { error: "Invalid or expired link" };

  await emitSystemEvent({
    type: SYSTEM_EVENT_TYPES.PORTAL_LOGIN,
    clientId: user.clientId,
    payload: { method: "magic_link" },
  });

  try {
    await signIn("client-credentials", {
      email: user.email,
      clientId: user.clientId,
      magicAuth: "1",
      redirectTo: "/client/dashboard",
    });
  } catch {
    return { error: "Unable to sign in" };
  }

  return { success: true };
}

export async function changeClientPassword(
  _prev: { error?: string; success?: boolean } | null,
  formData: FormData
): Promise<{ error?: string; success?: boolean } | null> {
  const { requireClient } = await import("@/lib/auth/session");
  const session = await requireClient();
  const clientId = session.user.clientId!;

  const currentPassword = String(formData.get("currentPassword") ?? "");
  const newPassword = String(formData.get("newPassword") ?? "");

  if (!currentPassword || !newPassword) {
    return { error: "Both fields are required" };
  }
  if (newPassword.length < 8) {
    return { error: "New password must be at least 8 characters" };
  }

  const portalUser = await prisma.clientPortalUser.findUnique({
    where: { clientId },
  });
  if (!portalUser) {
    return { error: "Portal account not found" };
  }

  const valid = await verifyPassword(currentPassword, portalUser.passwordHash);
  if (!valid) {
    return { error: "Current password is incorrect" };
  }

  const passwordHash = await hashPassword(newPassword);
  await prisma.clientPortalUser.update({
    where: { clientId },
    data: { passwordHash },
  });

  return { success: true };
}

export async function inviteClientPortalUser(input: {
  clientId: string;
  email: string;
  password: string;
}) {
  const { requireAdmin } = await import("@/lib/auth/session");
  await requireAdmin();

  const hash = await hashPassword(input.password);

  await prisma.clientPortalUser.upsert({
    where: { clientId: input.clientId },
    create: {
      clientId: input.clientId,
      email: input.email.toLowerCase(),
      passwordHash: hash,
    },
    update: {
      email: input.email.toLowerCase(),
      passwordHash: hash,
    },
  });

  const base = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
  await sendTemplatedEmail({
    to: input.email,
    subject: "Welcome to your client portal",
    bodyTemplate:
      "Your client portal account is ready.\n\nSign in at: {{loginUrl}}\n\nEmail: {{email}}\nTemporary password: {{password}}\n\nPlease change your password after signing in.",
    vars: {
      loginUrl: `${base}/client/login`,
      email: input.email,
      password: input.password,
    },
    clientId: input.clientId,
  });
}
