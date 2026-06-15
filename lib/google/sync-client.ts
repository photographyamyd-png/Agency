import { prisma } from "@/lib/prisma";
import { emitSystemEvent } from "@/lib/events/emit";
import { SYSTEM_EVENT_TYPES } from "@/lib/events/types";
import { fetchGa4Metrics, fetchGa4RealtimeSessions } from "./ga4";
import { fetchGscKeywordPosition, fetchGscQueryAnalytics } from "./gsc";

function daysAgo(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(0, 0, 0, 0);
  return d;
}

export async function syncClientGoogleData(clientId: string) {
  const periodEnd = new Date();
  periodEnd.setHours(23, 59, 59, 999);
  const periodStart = daysAgo(7);

  const client = await prisma.client.findUnique({
    where: { id: clientId },
    include: {
      keywords: true,
      brandProfile: true,
      integrations: true,
    },
  });
  if (!client) return { error: "Client not found" };

  const ga4Integration = client.integrations.find((i) => i.service === "GA4");
  const gscIntegration = client.integrations.find(
    (i) => i.service === "GOOGLE_SEARCH_CONSOLE"
  );

  const results: string[] = [];

  if (ga4Integration?.status === "CONNECTED" && ga4Integration.externalPropertyId) {
    try {
      const metrics = await fetchGa4Metrics(clientId, periodStart, periodEnd);
      if (metrics) {
        await prisma.metricSnapshot.create({
          data: {
            clientId,
            periodStart,
            periodEnd,
            granularity: "WEEKLY",
            ...metrics,
          },
        });

        await prisma.brandProfile.update({
          where: { clientId },
          data: { ga4Connected: true, ga4PropertyId: ga4Integration.externalPropertyId },
        });

        const realtime = await fetchGa4RealtimeSessions(clientId);
        if (realtime > 0) {
          await prisma.accessChecklistItem.updateMany({
            where: {
              clientId,
              systemType: "GA4",
              label: { contains: "Verify realtime" },
            },
            data: { status: "TESTED", testedAt: new Date() },
          });
        }

        await prisma.clientIntegration.update({
          where: { id: ga4Integration.id },
          data: { lastSyncedAt: new Date(), lastError: null },
        });

        await emitSystemEvent({
          type: SYSTEM_EVENT_TYPES.METRICS_SYNCED,
          clientId,
          payload: metrics,
        });
        results.push("GA4 synced");
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "GA4 sync failed";
      await prisma.clientIntegration.update({
        where: { id: ga4Integration.id },
        data: { lastError: msg, status: "ERROR" },
      });
      results.push(`GA4 error: ${msg}`);
    }
  }

  if (gscIntegration?.status === "CONNECTED" && gscIntegration.externalSiteUrl) {
    try {
      const keywords =
        client.keywords.length > 0
          ? client.keywords
          : await seedKeywordsFromGsc(clientId, periodStart, periodEnd);

      for (const keyword of keywords) {
        const row = await fetchGscKeywordPosition(
          clientId,
          keyword.term,
          periodStart,
          periodEnd
        );
        if (!row) continue;

        await prisma.rankSnapshot.create({
          data: {
            keywordId: keyword.id,
            rank: Math.round(row.position),
            source: "GSC",
            clicks: row.clicks,
            impressions: row.impressions,
            ctr: row.ctr,
          },
        });
      }

      await prisma.brandProfile.update({
        where: { clientId },
        data: {
          gscConnected: true,
          gscSiteUrl: gscIntegration.externalSiteUrl,
        },
      });

      await prisma.clientIntegration.update({
        where: { id: gscIntegration.id },
        data: { lastSyncedAt: new Date(), lastError: null },
      });

      await emitSystemEvent({
        type: SYSTEM_EVENT_TYPES.RANK_UPDATED,
        clientId,
        payload: { keywordCount: keywords.length },
      });

      const baseline = await prisma.baselineAudit.findFirst({
        where: { clientId },
        orderBy: { capturedAt: "asc" },
      });
      if (!baseline) {
        const rankings: Record<string, number> = {};
        for (const kw of keywords) {
          const snap = await prisma.rankSnapshot.findFirst({
            where: { keywordId: kw.id },
            orderBy: { capturedAt: "asc" },
          });
          if (snap?.rank) rankings[kw.term] = snap.rank;
        }
        await prisma.baselineAudit.create({
          data: {
            clientId,
            dataJson: { rankings, capturedAt: new Date().toISOString() },
          },
        });
      }

      results.push("GSC synced");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "GSC sync failed";
      await prisma.clientIntegration.update({
        where: { id: gscIntegration.id },
        data: { lastError: msg, status: "ERROR" },
      });
      results.push(`GSC error: ${msg}`);
    }
  }

  const gbpIntegration = client.integrations.find((i) => i.service === "GBP");
  if (gbpIntegration?.status === "CONNECTED" && gbpIntegration.externalLocationId) {
    try {
      const { syncGbpReviews } = await import("./gbp");
      const gbpData = await syncGbpReviews(clientId);
      if (gbpData) {
        await prisma.reviewSnapshot.create({
          data: {
            clientId,
            platform: "Google Business Profile",
            rating: null,
            count: null,
          },
        });
        await prisma.gBPActivityLog.create({
          data: {
            clientId,
            type: "SYNC",
            content: `GBP location synced: ${gbpData.locationName}`,
          },
        });
        await prisma.brandProfile.update({
          where: { clientId },
          data: { gbpConnected: true },
        });
        await prisma.clientIntegration.update({
          where: { id: gbpIntegration.id },
          data: { lastSyncedAt: new Date(), lastError: null },
        });
        results.push("GBP synced");
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "GBP sync failed";
      await prisma.clientIntegration.update({
        where: { id: gbpIntegration.id },
        data: { lastError: msg },
      });
      results.push(`GBP error: ${msg}`);
    }
  }

  return { results };
}

async function seedKeywordsFromGsc(
  clientId: string,
  periodStart: Date,
  periodEnd: Date
) {
  const top = await fetchGscQueryAnalytics(clientId, periodStart, periodEnd, 10);
  const created = [];
  for (const row of top.slice(0, 5)) {
    if (!row.query) continue;
    const kw = await prisma.keyword.create({
      data: { clientId, term: row.query },
    });
    created.push(kw);
  }
  return created;
}

export async function syncAllConnectedClients() {
  const integrations = await prisma.clientIntegration.findMany({
    where: { status: "CONNECTED" },
    select: { clientId: true },
    distinct: ["clientId"],
  });

  const summary = [];
  for (const { clientId } of integrations) {
    const result = await syncClientGoogleData(clientId);
    summary.push({ clientId, ...result });
  }
  return summary;
}
