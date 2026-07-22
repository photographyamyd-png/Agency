import { prisma } from "@/lib/prisma";
import type { BaselineSnapshot } from "./baseline-snapshot";

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

export type VsBaseline = {
  sessionsDelta: number | null;
  sessionsPercent: number | null;
  baselineSessions: number | null;
  currentSessions: number | null;
  rankImprovements: number;
  rankMessages: string[];
};

export async function computeRankHighlights(
  clientId: string
): Promise<RankHighlight[]> {
  const baselineReport = await prisma.baselineReport.findUnique({
    where: { clientId },
  });
  const snapshot = baselineReport?.dataJson as unknown as BaselineSnapshot | null;
  const baselineRanks = snapshot?.rankings?.map ?? {};

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

    // Prefer kickoff baseline when present; else adjacent snapshot
    const fromRank = baselineRank ?? previous;
    if (current == null || fromRank == null) continue;

    const delta = fromRank - current;
    if (delta <= 0) continue;

    const vsLabel = baselineRank != null ? "kickoff baseline" : "last period";
    highlights.push({
      keyword: kw.term,
      previousRank: fromRank,
      currentRank: current,
      delta,
      message: `Your keyword "${kw.term}" improved from #${fromRank} to #${current} vs ${vsLabel} (+${delta} positions)`,
    });
  }

  return highlights.sort((a, b) => b.delta - a.delta).slice(0, 5);
}

export async function computeTrafficHighlight(
  clientId: string
): Promise<TrafficHighlight | null> {
  const baselineReport = await prisma.baselineReport.findUnique({
    where: { clientId },
  });
  const snapshot = baselineReport?.dataJson as unknown as BaselineSnapshot | null;
  const baselineSessions = snapshot?.traffic?.sessions ?? null;

  const latest = await prisma.metricSnapshot.findFirst({
    where: { clientId },
    orderBy: { capturedAt: "desc" },
  });

  if (baselineSessions != null && latest?.sessions != null && baselineSessions > 0) {
    const cur = latest.sessions;
    const percentChange = Math.round(
      ((cur - baselineSessions) / baselineSessions) * 100
    );
    if (percentChange === 0) return null;
    const direction = percentChange > 0 ? "grew" : "declined";
    return {
      previousSessions: baselineSessions,
      currentSessions: cur,
      percentChange,
      message: `Organic sessions ${direction} ${Math.abs(percentChange)}% vs kickoff baseline (${baselineSessions} → ${cur})`,
    };
  }

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

export async function computeVsBaseline(clientId: string): Promise<VsBaseline | null> {
  const baselineReport = await prisma.baselineReport.findUnique({
    where: { clientId },
  });
  if (!baselineReport) return null;

  const snapshot = baselineReport.dataJson as unknown as BaselineSnapshot;
  const baselineSessions = snapshot.traffic?.sessions ?? null;
  const baselineRanks = snapshot.rankings?.map ?? {};

  const latest = await prisma.metricSnapshot.findFirst({
    where: { clientId },
    orderBy: { capturedAt: "desc" },
  });
  const currentSessions = latest?.sessions ?? null;

  let sessionsDelta: number | null = null;
  let sessionsPercent: number | null = null;
  if (baselineSessions != null && currentSessions != null) {
    sessionsDelta = currentSessions - baselineSessions;
    sessionsPercent =
      baselineSessions > 0
        ? Math.round((sessionsDelta / baselineSessions) * 100)
        : null;
  }

  const keywords = await prisma.keyword.findMany({
    where: { clientId },
    include: {
      rankSnapshots: { orderBy: { capturedAt: "desc" }, take: 1 },
    },
  });

  const rankMessages: string[] = [];
  for (const kw of keywords) {
    const current = kw.rankSnapshots[0]?.rank;
    const from = baselineRanks[kw.term];
    if (current == null || from == null) continue;
    const delta = from - current;
    if (delta > 0) {
      rankMessages.push(`"${kw.term}" #${from} → #${current} (+${delta})`);
    }
  }

  return {
    sessionsDelta,
    sessionsPercent,
    baselineSessions,
    currentSessions,
    rankImprovements: rankMessages.length,
    rankMessages: rankMessages.slice(0, 5),
  };
}

export async function buildHighlightMessages(clientId: string): Promise<string[]> {
  const rankHighlights = await computeRankHighlights(clientId);
  const traffic = await computeTrafficHighlight(clientId);

  const messages = rankHighlights.map((h) => h.message);
  if (traffic) messages.push(traffic.message);
  return messages;
}
