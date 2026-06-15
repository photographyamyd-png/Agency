"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { IntegrationService } from "@prisma/client";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { encrypt, isEncryptionConfigured } from "@/lib/crypto/encryption";
import {
  listGa4Properties,
  listGscSites,
  listGbpLocations,
} from "@/lib/google/oauth";
import { syncClientGoogleData } from "@/lib/google/sync-client";
import { emitSystemEvent } from "@/lib/events/emit";
import { SYSTEM_EVENT_TYPES } from "@/lib/events/types";

async function assertClientAccess(clientId: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  if (session.user.role === "admin") return session;
  if (session.user.role === "client" && session.user.clientId === clientId) {
    return session;
  }
  throw new Error("Forbidden");
}

export async function getIntegrationsForClient(clientId: string) {
  await assertClientAccess(clientId);
  return prisma.clientIntegration.findMany({ where: { clientId } });
}

export async function getPendingIntegration(clientId: string, service: IntegrationService) {
  await assertClientAccess(clientId);
  return prisma.clientIntegration.findUnique({
    where: { clientId_service: { clientId, service } },
  });
}

export async function listPropertiesForClient(
  clientId: string,
  service: IntegrationService
) {
  await assertClientAccess(clientId);
  const integration = await prisma.clientIntegration.findUnique({
    where: { clientId_service: { clientId, service } },
  });
  if (!integration?.accessTokenEnc) return [];

  if (service === "GA4") {
    return listGa4Properties(integration.id);
  }
  if (service === "GOOGLE_SEARCH_CONSOLE") {
    return listGscSites(integration.id);
  }
  if (service === "GBP") {
    return listGbpLocations(integration.id);
  }
  return [];
}

export async function selectIntegrationProperty(formData: FormData) {
  const clientId = String(formData.get("clientId") ?? "");
  const service = String(formData.get("service") ?? "") as IntegrationService;
  const propertyId = String(formData.get("propertyId") ?? "");
  const returnPath = String(formData.get("returnPath") ?? "/client/integrations");

  await assertClientAccess(clientId);

  if (!propertyId) return;

  let data: Record<string, unknown> = { status: "CONNECTED" as const };

  if (service === "GA4") {
    data = { externalPropertyId: propertyId, status: "CONNECTED" };
  } else if (service === "GOOGLE_SEARCH_CONSOLE") {
    data = { externalSiteUrl: propertyId, status: "CONNECTED" };
  } else if (service === "GBP") {
    data = { externalLocationId: propertyId, status: "CONNECTED" };
  }

  await prisma.clientIntegration.update({
    where: { clientId_service: { clientId, service } },
    data,
  });

  if (service === "GA4") {
    await prisma.brandProfile.update({
      where: { clientId },
      data: { ga4Connected: true, ga4PropertyId: propertyId },
    });
    await emitSystemEvent({
      type: SYSTEM_EVENT_TYPES.GA4_CONNECTED,
      clientId,
      payload: { propertyId },
    });
  } else if (service === "GOOGLE_SEARCH_CONSOLE") {
    await prisma.brandProfile.update({
      where: { clientId },
      data: { gscConnected: true, gscSiteUrl: propertyId },
    });
    await emitSystemEvent({
      type: SYSTEM_EVENT_TYPES.GSC_CONNECTED,
      clientId,
      payload: { siteUrl: propertyId },
    });
  } else if (service === "GBP") {
    await prisma.brandProfile.update({
      where: { clientId },
      data: { gbpConnected: true },
    });
    await emitSystemEvent({
      type: SYSTEM_EVENT_TYPES.GBP_CONNECTED,
      clientId,
      payload: { locationId: propertyId },
    });
  }

  try {
    await syncClientGoogleData(clientId);
  } catch {
    // non-fatal
  }

  revalidatePath(returnPath);
  revalidatePath(`/clients/${clientId}`);
  redirect(returnPath);
}

export async function connectManualIntegration(formData: FormData) {
  const clientId = String(formData.get("clientId") ?? "");
  const service = String(formData.get("service") ?? "") as IntegrationService;
  const value = String(formData.get("value") ?? "").trim();
  const returnPath = String(formData.get("returnPath") ?? "/client/integrations");

  await assertClientAccess(clientId);
  if (!value) return;

  let createData: Record<string, string> = {};
  if (service === "GA4") {
    createData = {
      externalPropertyId: value.startsWith("properties/")
        ? value
        : `properties/${value}`,
    };
  } else if (service === "GOOGLE_SEARCH_CONSOLE") {
    createData = { externalSiteUrl: value };
  } else if (service === "GBP") {
    createData = { externalLocationId: value };
  }

  await prisma.clientIntegration.upsert({
    where: { clientId_service: { clientId, service } },
    create: {
      clientId,
      service,
      connectionMethod: "MANUAL",
      status: "CONNECTED",
      ...createData,
    },
    update: {
      connectionMethod: "MANUAL",
      status: "CONNECTED",
      ...createData,
    },
  });

  if (service === "GA4") {
    await prisma.brandProfile.update({
      where: { clientId },
      data: {
        ga4Connected: true,
        ga4PropertyId: createData.externalPropertyId,
      },
    });
  } else if (service === "GOOGLE_SEARCH_CONSOLE") {
    await prisma.brandProfile.update({
      where: { clientId },
      data: { gscConnected: true, gscSiteUrl: createData.externalSiteUrl },
    });
  } else if (service === "GBP") {
    await prisma.brandProfile.update({
      where: { clientId },
      data: { gbpConnected: true },
    });
  }

  revalidatePath(returnPath);
  redirect(returnPath);
}

export async function forceSyncClient(clientId: string) {
  await assertClientAccess(clientId);
  const result = await syncClientGoogleData(clientId);
  revalidatePath("/client/dashboard");
  revalidatePath("/client/integrations");
  revalidatePath(`/clients/${clientId}`);
  return result;
}

export async function saveOAuthTokens(input: {
  clientId: string;
  service: IntegrationService;
  accessToken?: string | null;
  refreshToken?: string | null;
  expiryDate?: number | null;
}) {
  if (!isEncryptionConfigured()) {
    throw new Error("ENCRYPTION_KEY required to store OAuth tokens");
  }

  await prisma.clientIntegration.upsert({
    where: {
      clientId_service: { clientId: input.clientId, service: input.service },
    },
    create: {
      clientId: input.clientId,
      service: input.service,
      connectionMethod: "OAUTH",
      status: "PENDING",
      accessTokenEnc: input.accessToken ? encrypt(input.accessToken) : null,
      refreshTokenEnc: input.refreshToken ? encrypt(input.refreshToken) : null,
      tokenExpiresAt: input.expiryDate ? new Date(input.expiryDate) : null,
    },
    update: {
      connectionMethod: "OAUTH",
      status: "PENDING",
      accessTokenEnc: input.accessToken ? encrypt(input.accessToken) : undefined,
      refreshTokenEnc: input.refreshToken ? encrypt(input.refreshToken) : undefined,
      tokenExpiresAt: input.expiryDate ? new Date(input.expiryDate) : undefined,
      lastError: null,
    },
  });
}

export async function getOAuthStartUrl(
  clientId: string,
  service: IntegrationService,
  returnPath: string
) {
  await assertClientAccess(clientId);
  const { getAuthorizationUrl } = await import("@/lib/google/oauth");
  const { signOAuthState, GOOGLE_SCOPES } = await import("@/lib/google/constants");
  const state = signOAuthState({ clientId, service, returnPath });
  return getAuthorizationUrl(GOOGLE_SCOPES[service], state);
}
