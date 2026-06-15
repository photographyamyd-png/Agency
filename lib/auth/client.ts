import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";
import { prisma } from "@/lib/prisma";

const BCRYPT_ROUNDS = 12;
const MAX_FAILURES = 5;
const LOCKOUT_MINUTES = 15;
const MAGIC_LINK_TTL_HOURS = 1;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, BCRYPT_ROUNDS);
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function hashToken(token: string): Promise<string> {
  return bcrypt.hash(token, BCRYPT_ROUNDS);
}

export async function verifyToken(
  token: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(token, hash);
}

export async function authenticateClientUser(
  email: string,
  password: string
) {
  const user = await prisma.clientPortalUser.findUnique({
    where: { email: email.toLowerCase() },
    include: { client: true },
  });

  if (!user) return null;

  if (user.lockedUntil && user.lockedUntil > new Date()) {
    return null;
  }

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) {
    const failures = user.loginFailures + 1;
    await prisma.clientPortalUser.update({
      where: { id: user.id },
      data: {
        loginFailures: failures,
        lockedUntil:
          failures >= MAX_FAILURES
            ? new Date(Date.now() + LOCKOUT_MINUTES * 60 * 1000)
            : null,
      },
    });
    return null;
  }

  await prisma.clientPortalUser.update({
    where: { id: user.id },
    data: {
      lastLoginAt: new Date(),
      loginFailures: 0,
      lockedUntil: null,
    },
  });

  return user;
}

export async function createMagicLink(email: string): Promise<string | null> {
  const user = await prisma.clientPortalUser.findUnique({
    where: { email: email.toLowerCase() },
  });
  if (!user) return null;

  const rawToken = randomBytes(32).toString("hex");
  const tokenHash = await hashToken(rawToken);

  await prisma.clientPortalMagicLink.create({
    data: {
      email: email.toLowerCase(),
      tokenHash,
      expiresAt: new Date(Date.now() + MAGIC_LINK_TTL_HOURS * 60 * 60 * 1000),
    },
  });

  return rawToken;
}

export async function consumeMagicLink(rawToken: string) {
  const links = await prisma.clientPortalMagicLink.findMany({
    where: {
      usedAt: null,
      expiresAt: { gt: new Date() },
    },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  for (const link of links) {
    const match = await verifyToken(rawToken, link.tokenHash);
    if (!match) continue;

    await prisma.clientPortalMagicLink.update({
      where: { id: link.id },
      data: { usedAt: new Date() },
    });

    return prisma.clientPortalUser.findUnique({
      where: { email: link.email },
      include: { client: true },
    });
  }

  return null;
}
