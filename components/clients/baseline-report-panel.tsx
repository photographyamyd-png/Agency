import type { BaselineReport } from "@prisma/client";
import {
  generateBaselineReportAction,
  sendBaselineReportAction,
} from "@/lib/actions/baseline-report";
import type { BaselineSnapshot } from "@/lib/reports/baseline-snapshot";
import { SectionGuide } from "@/components/clients/section-guide";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface BaselineReportPanelProps {
  clientId: string;
  report: BaselineReport | null;
  ready: boolean;
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-border bg-surface px-3 py-2">
      <p className="text-[10px] uppercase tracking-wide text-muted">{label}</p>
      <p className="text-sm font-medium mt-0.5">{value}</p>
    </div>
  );
}

export function BaselineReportPanel({
  clientId,
  report,
  ready,
}: BaselineReportPanelProps) {
  const snapshot = report?.dataJson as unknown as BaselineSnapshot | null;
  const highlights = (report?.highlights as string[] | null) ?? [];

  let statusLabel = "Not created";
  let statusVariant: "muted" | "warning" | "success" = "muted";
  if (report?.sentAt) {
    statusLabel = `Sent ${new Date(report.sentAt).toLocaleDateString()}`;
    statusVariant = "success";
  } else if (report) {
    statusLabel = `Generated ${new Date(report.createdAt).toLocaleDateString()}`;
    statusVariant = "warning";
  } else if (ready) {
    statusLabel = "Ready to generate";
    statusVariant = "warning";
  }

  return (
    <section className="rounded-xl border border-border-bright bg-surface-raised p-5 space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-medium">Baseline starting report</h3>
          <p className="text-xs text-muted mt-0.5">
            Freeze kickoff metrics so monthly reports can show progress vs day one.
          </p>
        </div>
        <Badge variant={statusVariant}>{statusLabel}</Badge>
      </div>

      <SectionGuide guideId="intake.baselineReport" />

      <div className="flex flex-wrap gap-2">
        {!report && (
          <form
            action={async () => {
              "use server";
              await generateBaselineReportAction(clientId);
            }}
          >
            <Button type="submit" size="sm">
              Generate baseline report
            </Button>
          </form>
        )}
        {report && !report.sentAt && (
          <>
            <form
              action={async () => {
                "use server";
                await sendBaselineReportAction(clientId);
              }}
            >
              <Button type="submit" size="sm">
                Send to client
              </Button>
            </form>
            <form
              action={async () => {
                "use server";
                await generateBaselineReportAction(clientId, true);
              }}
            >
              <Button type="submit" size="sm" variant="outline">
                Regenerate
              </Button>
            </form>
          </>
        )}
        {report?.sentAt && (
          <form
            action={async () => {
              "use server";
              await generateBaselineReportAction(clientId, true);
            }}
          >
            <Button type="submit" size="sm" variant="outline">
              Regenerate (resets sent)
            </Button>
          </form>
        )}
      </div>

      {!report && !ready && (
        <p className="text-xs text-muted">
          Auto-generates when the client has a site URL, connected Google data or PageSpeed,
          and the intake checklist is ≥50% done (or onboarding Access is complete). You can
          also generate manually anytime.
        </p>
      )}

      {report && snapshot && (
        <details className="text-sm">
          <summary className="cursor-pointer text-accent-bright hover:underline text-xs">
            Preview kickoff snapshot
          </summary>
          <div className="mt-3 space-y-3">
            {report.summary && (
              <p className="text-muted text-xs">{report.summary}</p>
            )}
            {highlights.length > 0 && (
              <ul className="space-y-1">
                {highlights.map((h) => (
                  <li key={h} className="text-xs text-accent">
                    • {h}
                  </li>
                ))}
              </ul>
            )}
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
              <Metric
                label="Sessions"
                value={
                  snapshot.traffic.sessions != null
                    ? String(snapshot.traffic.sessions)
                    : snapshot.traffic.note ?? "—"
                }
              />
              <Metric
                label="Keywords ranked"
                value={String(Object.keys(snapshot.rankings.map).length)}
              />
              <Metric
                label="Citations live"
                value={`${snapshot.citations.live}/${snapshot.citations.total}`}
              />
              <Metric
                label="Reviews"
                value={
                  snapshot.reviews.rating != null
                    ? `${snapshot.reviews.rating.toFixed(1)}★ (${snapshot.reviews.count ?? 0})`
                    : snapshot.reviews.note ?? "—"
                }
              />
              <Metric
                label="LCP"
                value={
                  snapshot.technical.lcp != null
                    ? `${snapshot.technical.lcp.toFixed(2)}s`
                    : snapshot.technical.note ?? "—"
                }
              />
              <Metric
                label="Intake checklist"
                value={`${snapshot.intake.checklistPercent}%`}
              />
              <Metric
                label="Links acquired"
                value={String(snapshot.links.acquired)}
              />
              <Metric
                label="Coverage"
                value={[
                  snapshot.coverage.ga4 && "GA4",
                  snapshot.coverage.gsc && "GSC",
                  snapshot.coverage.gbp && "GBP",
                  snapshot.coverage.pagespeed && "PSI",
                ]
                  .filter(Boolean)
                  .join(", ") || "None"}
              />
            </div>
          </div>
        </details>
      )}
    </section>
  );
}
