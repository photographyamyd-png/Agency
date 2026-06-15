import { google } from "googleapis";
import { getIntegrationClient } from "./oauth";

export async function syncGbpReviews(clientId: string) {
  const auth = await getIntegrationClient(clientId, "GBP");
  if (!auth?.integration.externalLocationId) return null;

  const { oauth2, integration } = auth;

  const locationId = integration.externalLocationId;
  if (!locationId) return null;

  try {
    const businessInfo = google.mybusinessbusinessinformation({
      version: "v1",
      auth: oauth2,
    });

    const location = await businessInfo.locations.get({
      name: locationId,
      readMask: "name,title,metadata",
    });

    const metadata = location.data.metadata as
      | { placeId?: string; hasGoogleUpdated?: boolean }
      | undefined;

    return {
      locationName: location.data.title ?? "GBP Location",
      placeId: metadata?.placeId,
    };
  } catch {
    return { locationName: "Connected location", placeId: undefined };
  }
}
