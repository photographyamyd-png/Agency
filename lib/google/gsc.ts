import { google } from "googleapis";
import { getIntegrationClient } from "./oauth";

export type GscQueryRow = {
  query: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
};

export async function fetchGscQueryAnalytics(
  clientId: string,
  periodStart: Date,
  periodEnd: Date,
  rowLimit = 50
): Promise<GscQueryRow[]> {
  const auth = await getIntegrationClient(clientId, "GOOGLE_SEARCH_CONSOLE");
  if (!auth?.integration.externalSiteUrl) return [];

  const gsc = google.searchconsole({ version: "v1", auth: auth.oauth2 });
  const formatDate = (d: Date) => d.toISOString().slice(0, 10);

  const res = await gsc.searchanalytics.query({
    siteUrl: auth.integration.externalSiteUrl,
    requestBody: {
      startDate: formatDate(periodStart),
      endDate: formatDate(periodEnd),
      dimensions: ["query"],
      rowLimit,
    },
  });

  return (res.data.rows ?? []).map((row) => ({
    query: row.keys?.[0] ?? "",
    clicks: row.clicks ?? 0,
    impressions: row.impressions ?? 0,
    ctr: row.ctr ?? 0,
    position: row.position ?? 0,
  }));
}

export async function fetchGscKeywordPosition(
  clientId: string,
  keyword: string,
  periodStart: Date,
  periodEnd: Date
): Promise<GscQueryRow | null> {
  const auth = await getIntegrationClient(clientId, "GOOGLE_SEARCH_CONSOLE");
  if (!auth?.integration.externalSiteUrl) return null;

  const gsc = google.searchconsole({ version: "v1", auth: auth.oauth2 });
  const formatDate = (d: Date) => d.toISOString().slice(0, 10);

  const res = await gsc.searchanalytics.query({
    siteUrl: auth.integration.externalSiteUrl,
    requestBody: {
      startDate: formatDate(periodStart),
      endDate: formatDate(periodEnd),
      dimensions: ["query"],
      dimensionFilterGroups: [
        {
          filters: [
            {
              dimension: "query",
              operator: "equals",
              expression: keyword,
            },
          ],
        },
      ],
      rowLimit: 1,
    },
  });

  const row = res.data.rows?.[0];
  if (!row) return null;

  return {
    query: keyword,
    clicks: row.clicks ?? 0,
    impressions: row.impressions ?? 0,
    ctr: row.ctr ?? 0,
    position: row.position ?? 0,
  };
}
