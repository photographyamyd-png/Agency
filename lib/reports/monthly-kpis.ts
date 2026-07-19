import { prisma } from "@/lib/prisma";
import { fetchGa4ChannelBreakdown, fetchGa4TopPages } from "@/lib/google/ga4";

export interface MonthlyKpiCategories {
  leadGeneration: Record<string, number | string>;
  gbpPerformance: Record<string, number | string>;
  organicRankings: Record<string, number | string>;
  contentTraffic: Record<string, number | string>;
  reviewsReputation: Record<string, number | string>;
  authorityBuilding: Record<string, number | string>;
  technicalHealth: Record<string, number | string>;
}

function periodLastMonth() {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const end = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
  return { start, end };
}

export async function gatherMonthlyKpis(clientId: string): Promise<MonthlyKpiCategories> {
  const { start, end } = periodLastMonth();

  const [
    metricSnapshots,
    keywords,
    reviewSnapshots,
    citations,
    localLinks,
    techHealth,
    contentItems,
    gbpPosts,
    gbpSyncs,
    integrations,
  ] = await Promise.all([
    prisma.metricSnapshot.findMany({
      where: { clientId },
      orderBy: { capturedAt: "desc" },
      take: 30,
    }),
    prisma.keyword.findMany({
      where: { clientId },
      include: { rankSnapshots: { orderBy: { capturedAt: "desc" }, take: 2 } },
    }),
    prisma.reviewSnapshot.findMany({
      where: { clientId },
      orderBy: { capturedAt: "desc" },
      take: 5,
    }),
    prisma.citationRecord.findMany({ where: { clientId } }),
    prisma.localLinkRecord.findMany({
      where: { clientId, status: "ACQUIRED" },
    }),
    prisma.technicalHealthLog.findFirst({
      where: { clientId },
      orderBy: { capturedAt: "desc" },
    }),
    prisma.contentCalendarItem.findMany({
      where: { clientId, status: "PUBLISHED" },
    }),
    prisma.gBPActivityLog.count({
      where: { clientId, type: "POST", postedAt: { gte: start, lte: end } },
    }),
    prisma.gBPActivityLog.findMany({
      where: { clientId, type: "SYNC" },
      orderBy: { postedAt: "desc" },
      take: 1,
    }),
    prisma.clientIntegration.findMany({ where: { clientId } }),
  ]);

  const ga4Connected = integrations.some(
    (i) => i.service === "GA4" && i.status === "CONNECTED"
  );

  let channelBreakdown: Record<string, number> | null = null;
  let topPages: { path: string; pageviews: number }[] = [];

  if (ga4Connected) {
    try {
      [channelBreakdown, topPages] = await Promise.all([
        fetchGa4ChannelBreakdown(clientId, start, end),
        fetchGa4TopPages(clientId, start, end, 5),
      ]);
    } catch {
      // fall back to stored snapshots
    }
  }

  const rankImprovements = keywords.filter((kw) => {
    const [cur, prev] = kw.rankSnapshots;
    return cur?.rank != null && prev?.rank != null && prev.rank > cur.rank;
  }).length;

  const liveCitations = citations.filter((c) => c.status === "LIVE").length;
  const latestReview = reviewSnapshots[0];
  const prevReview = reviewSnapshots[1];

  const monthSnapshots = metricSnapshots.filter((m) => {
    const d = new Date(m.capturedAt);
    return d >= start && d <= end;
  });

  const sessions = monthSnapshots.reduce((s, m) => s + (m.sessions ?? 0), 0);
  const conversions = monthSnapshots.reduce((s, m) => s + (m.conversions ?? 0), 0);

  const newReviewsThisMonth =
    latestReview && prevReview && latestReview.count != null && prevReview.count != null
      ? Math.max(0, latestReview.count - prevReview.count)
      : "N/A";

  const topPageLabel =
    topPages.length > 0
      ? topPages.map((p) => `${p.path} (${p.pageviews})`).join(", ")
      : contentItems.length > 0
        ? `${contentItems.length} published items tracked`
        : "Connect GA4 for top pages";

  return {
    leadGeneration: {
      sessions: sessions || monthSnapshots[0]?.sessions || 0,
      conversions: conversions || monthSnapshots[0]?.conversions || 0,
      organicSessions: channelBreakdown?.["Organic Search"] ?? "Connect GA4",
      directSessions: channelBreakdown?.["Direct"] ?? "Connect GA4",
      referralSessions: channelBreakdown?.["Referral"] ?? "Connect GA4",
    },
    gbpPerformance: {
      postsThisMonth: gbpPosts,
      lastSync: gbpSyncs[0]?.content ?? "Not synced",
      profileViews: "Check GBP dashboard for profile views",
    },
    organicRankings: {
      keywordsTracked: keywords.length,
      rankImprovements,
      totalClicks: keywords.reduce(
        (s, k) => s + (k.rankSnapshots[0]?.clicks ?? 0),
        0
      ),
      totalImpressions: keywords.reduce(
        (s, k) => s + (k.rankSnapshots[0]?.impressions ?? 0),
        0
      ),
    },
    contentTraffic: {
      publishedItems: contentItems.length,
      topPages: topPageLabel,
    },
    reviewsReputation: {
      latestRating: latestReview?.rating?.toFixed(1) ?? "N/A",
      latestCount: latestReview?.count ?? "N/A",
      newReviewsThisMonth,
      platform: latestReview?.platform ?? "Google",
    },
    authorityBuilding: {
      liveCitations,
      acquiredLinks: localLinks.length,
    },
    technicalHealth: {
      lcp: techHealth?.lcp?.toFixed(2) ?? "Not measured",
      inp: techHealth?.inp?.toFixed(0) ?? "Not measured",
      cls: techHealth?.cls?.toFixed(3) ?? "Not measured",
      brokenLinks: techHealth?.brokenLinksCount ?? 0,
    },
  };
}
