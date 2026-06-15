import { google } from "googleapis";
import { getIntegrationClient } from "./oauth";

export async function fetchGa4Metrics(
  clientId: string,
  periodStart: Date,
  periodEnd: Date
) {
  const auth = await getIntegrationClient(clientId, "GA4");
  if (!auth) return null;

  const { oauth2, integration } = auth;
  if (!integration.externalPropertyId) return null;

  const analytics = google.analyticsdata({ version: "v1beta", auth: oauth2 });
  const formatDate = (d: Date) => d.toISOString().slice(0, 10);

  const res = await analytics.properties.runReport({
    property: integration.externalPropertyId,
    requestBody: {
      dateRanges: [
        {
          startDate: formatDate(periodStart),
          endDate: formatDate(periodEnd),
        },
      ],
      metrics: [
        { name: "sessions" },
        { name: "totalUsers" },
        { name: "screenPageViews" },
        { name: "conversions" },
      ],
    },
  });

  const row = res.data.totals?.[0]?.metricValues ?? [];
  const parse = (i: number) => parseInt(row[i]?.value ?? "0", 10) || 0;

  return {
    sessions: parse(0),
    users: parse(1),
    pageviews: parse(2),
    conversions: parse(3),
  };
}

export async function fetchGa4RealtimeSessions(clientId: string) {
  const auth = await getIntegrationClient(clientId, "GA4");
  if (!auth?.integration.externalPropertyId) return 0;

  const analytics = google.analyticsdata({
    version: "v1beta",
    auth: auth.oauth2,
  });

  const res = await analytics.properties.runRealtimeReport({
    property: auth.integration.externalPropertyId,
    requestBody: {
      metrics: [{ name: "activeUsers" }],
    },
  });

  return parseInt(
    res.data.rows?.[0]?.metricValues?.[0]?.value ?? "0",
    10
  );
}
