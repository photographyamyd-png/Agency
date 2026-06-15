import { createHmac, timingSafeEqual } from "crypto";
import type { IntegrationService } from "@prisma/client";

export const GOOGLE_SCOPES: Record<IntegrationService, string[]> = {
  GA4: ["https://www.googleapis.com/auth/analytics.readonly"],
  GOOGLE_SEARCH_CONSOLE: [
    "https://www.googleapis.com/auth/webmasters.readonly",
  ],
  GBP: ["https://www.googleapis.com/auth/business.manage"],
};

export function getGoogleRedirectUri() {
  const base = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
  return `${base.replace(/\/$/, "")}/api/integrations/google/callback`;
}

export type OAuthState = {
  clientId: string;
  service: IntegrationService;
  returnPath: string;
};

function getStateSecret() {
  return process.env.NEXTAUTH_SECRET ?? process.env.AUTH_SECRET ?? "dev-secret";
}

export function signOAuthState(state: OAuthState): string {
  const data = Buffer.from(JSON.stringify(state)).toString("base64url");
  const sig = createHmac("sha256", getStateSecret())
    .update(data)
    .digest("base64url");
  return `${data}.${sig}`;
}

export function verifyOAuthState(token: string): OAuthState | null {
  const [data, sig] = token.split(".");
  if (!data || !sig) return null;

  const expected = createHmac("sha256", getStateSecret())
    .update(data)
    .digest("base64url");

  try {
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  } catch {
    return null;
  }

  try {
    return JSON.parse(Buffer.from(data, "base64url").toString()) as OAuthState;
  } catch {
    return null;
  }
}

export function verifyCronSecret(request: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const auth = request.headers.get("authorization");
  return auth === `Bearer ${secret}`;
}
