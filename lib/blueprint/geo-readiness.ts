import { GEO_READINESS_CHECKLIST } from "./geo-checklist";

export type GeoReadinessItemKey =
  (typeof GEO_READINESS_CHECKLIST)[number]["key"];

export type GeoReadinessItemStatus = "pending" | "done" | "na";

export interface GeoReadinessItemValue {
  status: GeoReadinessItemStatus;
  notes?: string;
  completedAt?: string;
}

export type GeoReadinessData = Record<GeoReadinessItemKey, GeoReadinessItemValue>;

export function emptyGeoReadiness(): GeoReadinessData {
  return Object.fromEntries(
    GEO_READINESS_CHECKLIST.map((item) => [
      item.key,
      { status: "pending" as const },
    ])
  ) as GeoReadinessData;
}
