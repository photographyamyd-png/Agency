import { google } from "googleapis";
import { getIntegrationClient } from "./oauth";

export interface GbpSyncResult {
  locationName: string;
  placeId?: string;
  rating?: number | null;
  reviewCount?: number | null;
}

async function fetchPlaceReviewStats(placeId: string) {
  const apiKey =
    process.env.GOOGLE_PLACES_API_KEY ?? process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) return { rating: null, reviewCount: null };

  try {
    const res = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${encodeURIComponent(placeId)}&fields=rating,user_ratings_total&key=${apiKey}`
    );
    const data = (await res.json()) as {
      result?: { rating?: number; user_ratings_total?: number };
      status?: string;
    };
    if (data.status !== "OK" || !data.result) {
      return { rating: null, reviewCount: null };
    }
    return {
      rating: data.result.rating ?? null,
      reviewCount: data.result.user_ratings_total ?? null,
    };
  } catch {
    return { rating: null, reviewCount: null };
  }
}

export async function syncGbpReviews(clientId: string): Promise<GbpSyncResult | null> {
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

    const placeId = metadata?.placeId;
    const reviewStats = placeId
      ? await fetchPlaceReviewStats(placeId)
      : { rating: null, reviewCount: null };

    return {
      locationName: location.data.title ?? "GBP Location",
      placeId,
      rating: reviewStats.rating,
      reviewCount: reviewStats.reviewCount,
    };
  } catch {
    return { locationName: "Connected location", placeId: undefined };
  }
}
