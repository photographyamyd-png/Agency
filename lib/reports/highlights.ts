import { prisma } from "@/lib/prisma";

export type RankHighlight = {
  keyword: string;
  previousRank: number;
  currentRank: number;
  delta: number;
  message: string;
};

export type TrafficHighlight = {
  previousSessions: number;
  currentSessions: number;
  percentChange: number;
  message: string;
};

export async function computeRankHighlights(
  clientId: string
): Promise<RankHighlight[]> {
  const baseline = await prisma.baselineAudit.findFirst({
    where: { clientId },
    orderBy: { capturedAt: "asc" },
  });
  const baselineRanks =
    (baseline?.dataJson as { rankings?: Record<string, number> })?.rankings ??
    {};

  const keywords = await prisma.keyword.findMany({
    where: { clientId },
    include: {
      rankSnapshots: { orderBy: { capturedAt: "desc" }, take: 2 },
    },
  });

  const highlights: RankHighlight[] = [];

  for (const kw of keywords) {
    const current = kw.rankSnapshots[0]?.rank;
    const previous = kw.rankSnapshots[1]?.rank;
    const baselineRank = baselineRanks[kw.term];

    const fromRank = previous ?? baselineRank;
    if (current == null || fromRank == null) continue;

    const delta = fromRank - current;
    if (delta <= 0) continue;

    highlights.push({
      keyword: kw.term,
      previousRank: fromRank,
      currentRank: current,
      delta,
      message: `Your keyword "${kw.term}" improved from #${fromRank} to #${current} on Google (+${delta} positions)`,
    });
  }

  return highlights.sort((a, b) => b.delta - a.delta).slice(0, 5);
}

export async function computeTrafficHighlight(
  clientId: string
): Promise<TrafficHighlight | null> {
  const snapshots = await prisma.metricSnapshot.findMany({
    where: { clientId },
    orderBy: { capturedAt: "desc" },
    take: 2,
  });

  if (snapshots.length < 2) return null;

  const [current, previous] = snapshots;
  const cur = current.sessions ?? 0;
  const prev = previous.sessions ?? 0;
  if (prev === 0) return null;

  const percentChange = Math.round(((cur - prev) / prev) * 100);
  if (percentChange === 0) return null;

  const direction = percentChange > 0 ? "grew" : "declined";
  return {
    previousSessions: prev,
    currentSessions: cur,
    percentChange,
    message: `Organic sessions ${direction} ${Math.abs(percentChange)}% this period (${prev} → ${cur})`,
  };
}

export async function buildHighlightMessages(clientId: string): Promise<string[]> {
  const rankHighlights = await computeRankHighlights(clientId);
  const traffic = await computeTrafficHighlight(clientId);

  const messages = rankHighlights.map((h) => h.message);
  if (traffic) messages.push(traffic.message);
  return messages;
}
