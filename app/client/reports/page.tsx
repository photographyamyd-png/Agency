import { requireClient } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import {
  BaselineReportView,
  VsBaselineView,
} from "@/components/reports/baseline-report-view";
import type { BaselineSnapshot } from "@/lib/reports/baseline-snapshot";
import type { VsBaseline } from "@/lib/reports/highlights";

export default async function ClientReportsPage() {
  const session = await requireClient();
  const clientId = session.user.clientId!;

  const [reports, monthly, baseline] = await Promise.all([
    prisma.weeklyReport.findMany({
      where: { clientId },
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
    prisma.monthlyReport.findMany({
      where: { clientId },
      orderBy: { createdAt: "desc" },
      take: 12,
    }),
    prisma.baselineReport.findUnique({ where: { clientId } }),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Reports</h1>
        <p className="mt-1 text-sm text-muted">
          Kickoff baseline plus weekly and monthly SEO progress reports
        </p>
      </div>

      <section className="space-y-3">
        <h2 className="text-sm font-medium">Baseline starting report</h2>
        {baseline ? (
          <BaselineReportView
            summary={baseline.summary}
            highlights={(baseline.highlights as string[]) ?? []}
            snapshot={baseline.dataJson as unknown as BaselineSnapshot}
            createdAt={baseline.createdAt}
            sentAt={baseline.sentAt}
          />
        ) : (
          <p className="text-sm text-muted rounded-xl border border-dashed border-border p-8 text-center">
            Your kickoff baseline will appear here once it is captured.
          </p>
        )}
      </section>

      <section>
        <h2 className="text-sm font-medium mb-4">Weekly reports</h2>
        {reports.length === 0 ? (
          <p className="text-sm text-muted rounded-xl border border-dashed border-border p-8 text-center">
            No weekly reports yet — they appear here after your first sync.
          </p>
        ) : (
          <ul className="space-y-3">
            {reports.map((r) => (
              <li key={r.id} className="rounded-lg border border-border p-4">
                <p className="text-sm font-medium">
                  {new Date(r.periodStart).toLocaleDateString()} –{" "}
                  {new Date(r.periodEnd).toLocaleDateString()}
                </p>
                {r.summary && (
                  <p className="mt-2 text-sm text-muted">{r.summary}</p>
                )}
                {Array.isArray(r.highlights) && (r.highlights as string[]).length > 0 && (
                  <ul className="mt-3 space-y-1">
                    {(r.highlights as string[]).map((h, i) => (
                      <li key={i} className="text-sm text-accent">
                        {h}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="text-sm font-medium mb-4">Monthly reports</h2>
        {monthly.length === 0 ? (
          <p className="text-sm text-muted">No monthly reports yet.</p>
        ) : (
          <ul className="space-y-3">
            {monthly.map((r) => {
              const data = r.dataJson as {
                highlights?: string[];
                vsBaseline?: VsBaseline | null;
              } | null;
              return (
                <li key={r.id} className="rounded-lg border border-border p-4">
                  <p className="text-sm font-medium">
                    {new Date(r.periodStart).toLocaleDateString()} –{" "}
                    {new Date(r.periodEnd).toLocaleDateString()}
                  </p>
                  {r.summary && (
                    <p className="mt-2 text-sm text-muted">{r.summary}</p>
                  )}
                  {data?.vsBaseline && <VsBaselineView vs={data.vsBaseline} />}
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
