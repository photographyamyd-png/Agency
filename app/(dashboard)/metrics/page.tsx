import Link from "next/link";
import { getCrossClientMetrics } from "@/lib/data/dashboard";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { KpiCard } from "@/components/ui/kpi-card";
import { Badge } from "@/components/ui/badge";
import { TrafficChart } from "@/components/metrics/traffic-chart";

export const dynamic = "force-dynamic";

export default async function MetricsPage() {
  const metrics = await getCrossClientMetrics();

  return (
    <DashboardShell
      title="Metrics"
      description="Cross-client SEO and traffic analytics"
    >
      <div className="space-y-8">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <KpiCard title="Active Clients" value={String(metrics.clientCount)} />
          <KpiCard title="GA4 Connected" value={String(metrics.integrationCounts.ga4)} />
          <KpiCard title="GSC Connected" value={String(metrics.integrationCounts.gsc)} />
          <KpiCard title="GBP Connected" value={String(metrics.integrationCounts.gbp)} />
        </div>

        {metrics.rankWins.length > 0 && (
          <section className="rounded-lg border border-border p-5">
            <h2 className="text-sm font-medium mb-4">Recent rank improvements</h2>
            <ul className="space-y-3">
              {metrics.rankWins.slice(0, 8).map((w, i) => (
                <li key={i} className="flex items-center justify-between text-sm">
                  <div>
                    <span className="font-medium">{w.client}</span>
                    <span className="text-muted"> — {w.keyword}</span>
                  </div>
                  <Badge variant="success">
                    #{w.from} → #{w.to} (+{w.delta})
                  </Badge>
                </li>
              ))}
            </ul>
          </section>
        )}

        {metrics.trafficByClient.length > 0 ? (
          <section className="rounded-lg border border-border p-5">
            <h2 className="text-sm font-medium mb-4">Sessions by client (latest sync)</h2>
            <TrafficChart data={metrics.trafficByClient} />
          </section>
        ) : (
          <p className="text-sm text-muted text-center py-12 border border-dashed border-border rounded-lg">
            Connect client integrations to see traffic data.{" "}
            <Link href="/clients" className="text-accent hover:underline">
              View clients →
            </Link>
          </p>
        )}
      </div>
    </DashboardShell>
  );
}
