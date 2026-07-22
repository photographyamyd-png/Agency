import { prisma } from "@/lib/prisma";
import {
  BASELINE_AUDIT_ITEMS,
  emptyBaselineAudit,
  type BaselineAuditData,
} from "@/lib/blueprint/phase-1-intake";
import { baselineAuditDataSchema } from "@/lib/validation/blueprint";

export interface BaselineSnapshot {
  capturedAt: string;
  coverage: {
    ga4: boolean;
    gsc: boolean;
    gbp: boolean;
    pagespeed: boolean;
    siteUrl: string | null;
  };
  traffic: {
    sessions: number | null;
    users: number | null;
    pageviews: number | null;
    conversions: number | null;
    note: string | null;
  };
  rankings: {
    keywordsTracked: number;
    map: Record<string, number>;
    note: string | null;
  };
  technical: {
    lcp: number | null;
    inp: number | null;
    cls: number | null;
    pagespeedScores: unknown;
    note: string | null;
  };
  citations: {
    total: number;
    live: number;
    submitted: number;
    notStarted: number;
    needsUpdate: number;
  };
  reviews: {
    platform: string | null;
    rating: number | null;
    count: number | null;
    note: string | null;
  };
  links: {
    prospects: number;
    outreach: number;
    acquired: number;
    rejected: number;
  };
  gbp: {
    lastSync: string | null;
    recentPosts: number;
    note: string | null;
  };
  intake: {
    checklistDone: number;
    checklistTotal: number;
    checklistPercent: number;
    notes: { key: string; label: string; notes: string }[];
  };
  business: {
    serviceLines: string | null;
    targetCities: string | null;
    avgJobValue: string | null;
    reputation: string | null;
  };
}

function notConnected(reason: string) {
  return reason;
}

export async function gatherBaselineSnapshot(
  clientId: string
): Promise<BaselineSnapshot> {
  const [
    client,
    metric,
    keywords,
    techHealth,
    citations,
    review,
    localLinks,
    gbpSyncs,
    gbpPosts,
    audit,
    integrations,
  ] = await Promise.all([
    prisma.client.findUnique({
      where: { id: clientId },
      include: { brandProfile: true },
    }),
    prisma.metricSnapshot.findFirst({
      where: { clientId },
      orderBy: { capturedAt: "desc" },
    }),
    prisma.keyword.findMany({
      where: { clientId },
      include: {
        rankSnapshots: { orderBy: { capturedAt: "desc" }, take: 1 },
      },
    }),
    prisma.technicalHealthLog.findFirst({
      where: { clientId },
      orderBy: { capturedAt: "desc" },
    }),
    prisma.citationRecord.findMany({ where: { clientId } }),
    prisma.reviewSnapshot.findFirst({
      where: { clientId },
      orderBy: { capturedAt: "desc" },
    }),
    prisma.localLinkRecord.findMany({ where: { clientId } }),
    prisma.gBPActivityLog.findMany({
      where: { clientId, type: "SYNC" },
      orderBy: { postedAt: "desc" },
      take: 1,
    }),
    prisma.gBPActivityLog.count({
      where: {
        clientId,
        type: "POST",
        postedAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
      },
    }),
    prisma.baselineAudit.findFirst({
      where: { clientId },
      orderBy: { capturedAt: "desc" },
    }),
    prisma.clientIntegration.findMany({ where: { clientId } }),
  ]);

  const ga4 = integrations.some((i) => i.service === "GA4" && i.status === "CONNECTED");
  const gsc = integrations.some(
    (i) => i.service === "GOOGLE_SEARCH_CONSOLE" && i.status === "CONNECTED"
  );
  const gbp = integrations.some((i) => i.service === "GBP" && i.status === "CONNECTED");
  const siteUrl =
    client?.brandProfile?.existingSiteUrl ?? client?.brandProfile?.domain ?? null;

  const rankMap: Record<string, number> = {};
  for (const kw of keywords) {
    const rank = kw.rankSnapshots[0]?.rank;
    if (rank != null) rankMap[kw.term] = rank;
  }

  const parsedAudit = audit
    ? baselineAuditDataSchema.safeParse(audit.dataJson)
    : null;
  const checklist: BaselineAuditData = parsedAudit?.success
    ? parsedAudit.data
    : emptyBaselineAudit();

  const checklistDone = Object.values(checklist).filter(
    (v) => v.status === "done" || v.status === "na"
  ).length;
  const checklistTotal = BASELINE_AUDIT_ITEMS.length;
  const notes = BASELINE_AUDIT_ITEMS.filter((item) => checklist[item.key]?.notes)
    .map((item) => ({
      key: item.key,
      label: item.label,
      notes: checklist[item.key].notes!,
    }));

  const intel = (client?.brandProfile?.businessIntelJson ?? {}) as Record<
    string,
    string
  >;

  return {
    capturedAt: new Date().toISOString(),
    coverage: {
      ga4,
      gsc,
      gbp,
      pagespeed: !!techHealth,
      siteUrl,
    },
    traffic: {
      sessions: metric?.sessions ?? null,
      users: metric?.users ?? null,
      pageviews: metric?.pageviews ?? null,
      conversions: metric?.conversions ?? null,
      note: metric
        ? null
        : notConnected(ga4 ? "Awaiting first GA4 sync" : "GA4 not connected"),
    },
    rankings: {
      keywordsTracked: keywords.length,
      map: rankMap,
      note:
        Object.keys(rankMap).length > 0
          ? null
          : notConnected(gsc ? "Awaiting first GSC rank sync" : "GSC not connected"),
    },
    technical: {
      lcp: techHealth?.lcp ?? null,
      inp: techHealth?.inp ?? null,
      cls: techHealth?.cls ?? null,
      pagespeedScores: techHealth?.pagespeedScores ?? null,
      note: techHealth ? null : notConnected("PageSpeed not measured yet"),
    },
    citations: {
      total: citations.length,
      live: citations.filter((c) => c.status === "LIVE").length,
      submitted: citations.filter((c) => c.status === "SUBMITTED").length,
      notStarted: citations.filter((c) => c.status === "NOT_STARTED").length,
      needsUpdate: citations.filter((c) => c.status === "NEEDS_UPDATE").length,
    },
    reviews: {
      platform: review?.platform ?? null,
      rating: review?.rating ?? null,
      count: review?.count ?? null,
      note: review ? null : notConnected("No review snapshot yet"),
    },
    links: {
      prospects: localLinks.filter((l) => l.status === "PROSPECT").length,
      outreach: localLinks.filter((l) => l.status === "OUTREACH").length,
      acquired: localLinks.filter((l) => l.status === "ACQUIRED").length,
      rejected: localLinks.filter((l) => l.status === "REJECTED").length,
    },
    gbp: {
      lastSync: gbpSyncs[0]?.content ?? gbpSyncs[0]?.postedAt?.toISOString() ?? null,
      recentPosts: gbpPosts,
      note: gbp || gbpSyncs[0] ? null : notConnected("GBP not connected"),
    },
    intake: {
      checklistDone,
      checklistTotal,
      checklistPercent: Math.round((checklistDone / checklistTotal) * 100),
      notes,
    },
    business: {
      serviceLines: intel.serviceLines ?? null,
      targetCities: intel.targetCities ?? null,
      avgJobValue: intel.avgJobValue ?? null,
      reputation: intel.reputation ?? null,
    },
  };
}

export function buildBaselineHighlights(snapshot: BaselineSnapshot): string[] {
  const highlights: string[] = [];

  if (snapshot.traffic.sessions != null) {
    highlights.push(
      `Kickoff traffic: ${snapshot.traffic.sessions} sessions, ${snapshot.traffic.pageviews ?? 0} pageviews`
    );
  } else if (snapshot.traffic.note) {
    highlights.push(`Traffic baseline: ${snapshot.traffic.note}`);
  }

  const ranked = Object.entries(snapshot.rankings.map);
  if (ranked.length > 0) {
    const sample = ranked
      .slice(0, 3)
      .map(([term, rank]) => `"${term}" #${rank}`)
      .join(", ");
    highlights.push(
      `${snapshot.rankings.keywordsTracked} keywords tracked at kickoff (${sample})`
    );
  } else if (snapshot.rankings.note) {
    highlights.push(`Rankings baseline: ${snapshot.rankings.note}`);
  }

  if (snapshot.technical.lcp != null) {
    highlights.push(
      `PageSpeed baseline LCP ${snapshot.technical.lcp.toFixed(2)}s` +
        (snapshot.technical.cls != null
          ? `, CLS ${snapshot.technical.cls.toFixed(3)}`
          : "")
    );
  }

  highlights.push(
    `Citations at kickoff: ${snapshot.citations.live} live of ${snapshot.citations.total}`
  );

  if (snapshot.reviews.rating != null && snapshot.reviews.count != null) {
    highlights.push(
      `Reviews: ${snapshot.reviews.rating.toFixed(1)}★ from ${snapshot.reviews.count} reviews` +
        (snapshot.reviews.platform ? ` (${snapshot.reviews.platform})` : "")
    );
  }

  highlights.push(
    `Intake checklist ${snapshot.intake.checklistPercent}% complete (${snapshot.intake.checklistDone}/${snapshot.intake.checklistTotal})`
  );

  return highlights.slice(0, 8);
}

export function buildBaselineSummary(snapshot: BaselineSnapshot): string {
  const parts: string[] = ["Kickoff SEO baseline captured."];
  if (snapshot.traffic.sessions != null) {
    parts.push(`${snapshot.traffic.sessions} sessions.`);
  }
  if (Object.keys(snapshot.rankings.map).length > 0) {
    parts.push(`${Object.keys(snapshot.rankings.map).length} ranked keywords frozen.`);
  }
  parts.push(
    `${snapshot.citations.live}/${snapshot.citations.total} citations live.`
  );
  return parts.join(" ");
}
