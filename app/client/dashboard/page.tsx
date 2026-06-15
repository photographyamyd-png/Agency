import Link from "next/link";
import { requireClient } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { KpiCard } from "@/components/ui/kpi-card";
import { StatHighlight } from "@/components/ui/stat-highlight";
import { SectionTitle } from "@/components/ui/section-band";

export default async function ClientDashboardPage() {
  const session = await requireClient();
  const clientId = session.user.clientId!;

  const [client, latestReport, keywords, recentEvents] = await Promise.all([
    prisma.client.findUnique({
      where: { id: clientId },
      include: { brandProfile: true },
    }),
    prisma.weeklyReport.findFirst({
      where: { clientId },
      orderBy: { createdAt: "desc" },
    }),
    prisma.keyword.findMany({
      where: { clientId },
      include: {
        rankSnapshots: { orderBy: { capturedAt: "desc" }, take: 2 },
      },
      take: 5,
    }),
    prisma.systemEvent.findMany({
      where: { clientId },
      orderBy: { createdAt: "desc" },
      take: 8,
    }),
  ]);

  const highlights = (latestReport?.highlights as string[] | null) ?? [];

  const bestRankWin = keywords
    .map((kw) => {
      const [cur, prev] = kw.rankSnapshots;
      if (cur?.rank != null && prev?.rank != null && prev.rank > cur.rank) {
        return { term: kw.term, from: prev.rank, to: cur.rank, delta: prev.rank - cur.rank };
      }
      return null;
    })
    .filter(Boolean)
    .sort((a, b) => (b?.delta ?? 0) - (a?.delta ?? 0))[0];

  const avgRank =
    keywords.length > 0
      ? Math.round(
          keywords.reduce((s, kw) => s + (kw.rankSnapshots[0]?.rank ?? 0), 0) /
            keywords.filter((kw) => kw.rankSnapshots[0]?.rank != null).length || 0
        )
      : null;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          {client?.legalBusinessName ?? "Your dashboard"}
        </h1>
        <p className="mt-1 text-sm text-muted">
          Track your SEO progress and project status
        </p>
      </div>

      {bestRankWin && (
        <StatHighlight
          stat={`#${bestRankWin.from} → #${bestRankWin.to}`}
          label={`${bestRankWin.term} — your biggest rank win`}
          className="text-left sm:text-center"
        />
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <KpiCard
          title="Avg. keyword position"
          value={avgRank != null && !Number.isNaN(avgRank) ? `#${avgRank}` : "—"}
        />
        <KpiCard
          title="Keywords tracked"
          value={String(keywords.length)}
        />
      </div>

      {highlights.length > 0 && (
        <section className="rounded-xl border border-border-bright bg-surface-raised p-6 shadow-lg shadow-black/20">
          <SectionTitle>Latest wins</SectionTitle>
          <ul className="mt-4 space-y-2">
            {highlights.map((item, i) => (
              <li key={i} className="text-sm text-muted border-l-2 border-accent pl-3">
                {item}
              </li>
            ))}
          </ul>
        </section>
      )}

      {keywords.length > 0 && (
        <section className="rounded-xl border border-border-bright bg-surface-raised p-6 shadow-lg shadow-black/20">
          <h2 className="text-sm font-medium border-l-4 border-accent pl-3">Keyword rankings</h2>
          <ul className="mt-4 space-y-3">
            {keywords.map((kw) => {
              const current = kw.rankSnapshots[0]?.rank;
              const previous = kw.rankSnapshots[1]?.rank;
              const delta =
                current != null && previous != null ? previous - current : null;
              return (
                <li
                  key={kw.id}
                  className="flex items-center justify-between text-sm border-b border-border-bright pb-2 last:border-0"
                >
                  <span>{kw.term}</span>
                  <span className="tabular-nums font-medium text-accent-bright">
                    {current != null ? `#${current}` : "—"}
                    {delta != null && delta > 0 && (
                      <span className="ml-2 text-success">+{delta}</span>
                    )}
                  </span>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {recentEvents.length > 0 && (
        <section className="rounded-xl border border-border-bright bg-surface-raised p-6">
          <h2 className="text-sm font-medium border-l-4 border-accent pl-3">Activity</h2>
          <ul className="mt-4 space-y-2">
            {recentEvents.map((e) => (
              <li key={e.id} className="flex justify-between text-sm text-muted">
                <span>{e.type.replace(/_/g, " ").toLowerCase()}</span>
                <span>{new Date(e.createdAt).toLocaleDateString()}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {!client?.brandProfile?.ga4Connected && (
        <section className="rounded-xl border border-dashed border-border-bright bg-band-accent p-6 text-center">
          <p className="text-sm text-muted">
            Connect Google Analytics and Search Console to see live rankings and traffic.
          </p>
          <Link
            href="/client/integrations"
            className="mt-3 inline-block text-sm font-medium text-accent-bright hover:underline"
          >
            Connect integrations →
          </Link>
        </section>
      )}
    </div>
  );
}
