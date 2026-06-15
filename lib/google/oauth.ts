import { google } from "googleapis";
import type { IntegrationService } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { decrypt, encrypt, isEncryptionConfigured } from "@/lib/crypto/encryption";
import { getGoogleRedirectUri } from "./constants";

export function createOAuth2Client() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    throw new Error("Google OAuth is not configured");
  }
  return new google.auth.OAuth2(
    clientId,
    clientSecret,
    getGoogleRedirectUri()
  );
}

export function getAuthorizationUrl(scopes: string[], state: string) {
  const client = createOAuth2Client();
  return client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: scopes,
    state,
  });
}

export async function exchangeCodeForTokens(code: string) {
  const client = createOAuth2Client();
  const { tokens } = await client.getToken(code);
  return tokens;
}

export async function getAuthenticatedClient(integrationId: string) {
  const integration = await prisma.clientIntegration.findUnique({
    where: { id: integrationId },
  });
  if (!integration?.refreshTokenEnc && !integration?.accessTokenEnc) {
    throw new Error("Integration has no tokens");
  }

  const oauth2 = createOAuth2Client();

  const accessToken = integration.accessTokenEnc
    ? decrypt(integration.accessTokenEnc)
    : undefined;
  const refreshToken = integration.refreshTokenEnc
    ? decrypt(integration.refreshTokenEnc)
    : undefined;

  oauth2.setCredentials({
    access_token: accessToken,
    refresh_token: refreshToken,
    expiry_date: integration.tokenExpiresAt?.getTime(),
  });

  oauth2.on("tokens", async (tokens) => {
    if (!isEncryptionConfigured()) return;
    await prisma.clientIntegration.update({
      where: { id: integrationId },
      data: {
        ...(tokens.access_token
          ? { accessTokenEnc: encrypt(tokens.access_token) }
          : {}),
        ...(tokens.refresh_token
          ? { refreshTokenEnc: encrypt(tokens.refresh_token) }
          : {}),
        ...(tokens.expiry_date
          ? { tokenExpiresAt: new Date(tokens.expiry_date) }
          : {}),
        status: "CONNECTED",
      },
    });
  });

  return { oauth2, integration };
}

export async function getIntegrationClient(
  clientId: string,
  service: IntegrationService
) {
  const integration = await prisma.clientIntegration.findUnique({
    where: { clientId_service: { clientId, service } },
  });
  if (!integration || integration.status !== "CONNECTED") {
    return null;
  }
  return getAuthenticatedClient(integration.id);
}

export async function listGa4Properties(integrationId: string) {
  const { oauth2 } = await getAuthenticatedClient(integrationId);
  const admin = google.analyticsadmin({ version: "v1beta", auth: oauth2 });
  const res = await admin.accountSummaries.list();
  const properties: { id: string; name: string; account: string }[] = [];

  for (const account of res.data.accountSummaries ?? []) {
    for (const prop of account.propertySummaries ?? []) {
      if (prop.property && prop.displayName) {
        properties.push({
          id: prop.property,
          name: prop.displayName,
          account: account.displayName ?? account.account ?? "",
        });
      }
    }
  }
  return properties;
}

export async function listGscSites(integrationId: string) {
  const { oauth2 } = await getAuthenticatedClient(integrationId);
  const gsc = google.searchconsole({ version: "v1", auth: oauth2 });
  const res = await gsc.sites.list();
  return (res.data.siteEntry ?? [])
    .filter((s) => s.siteUrl)
    .map((s) => ({
      siteUrl: s.siteUrl!,
      permissionLevel: s.permissionLevel ?? "unknown",
    }));
}

export async function listGbpLocations(integrationId: string) {
  const { oauth2 } = await getAuthenticatedClient(integrationId);
  const accountMgmt = google.mybusinessaccountmanagement({
    version: "v1",
    auth: oauth2,
  });
  const businessInfo = google.mybusinessbusinessinformation({
    version: "v1",
    auth: oauth2,
  });

  const accountsRes = await accountMgmt.accounts.list();
  const locations: { id: string; name: string; address: string }[] = [];

  for (const account of accountsRes.data.accounts ?? []) {
    if (!account.name) continue;
    try {
      const locRes = await businessInfo.accounts.locations.list({
        parent: account.name,
        readMask: "name,title,storefrontAddress",
      });
      for (const loc of locRes.data.locations ?? []) {
        if (loc.name && loc.title) {
          const addr = loc.storefrontAddress
            ? [
                loc.storefrontAddress.addressLines?.join(" "),
                loc.storefrontAddress.locality,
              ]
                .filter(Boolean)
                .join(", ")
            : "";
          locations.push({ id: loc.name, name: loc.title, address: addr });
        }
      }
    } catch {
      // account may have no locations or insufficient permissions
    }
  }
  return locations;
}
