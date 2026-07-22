import type { BaselineSnapshot } from "@/lib/reports/baseline-snapshot";
import type { VsBaseline } from "@/lib/reports/highlights";

interface BaselineReportViewProps {
  summary: string | null;
  highlights: string[];
  snapshot: BaselineSnapshot;
  createdAt: Date;
  sentAt?: Date | null;
  compact?: boolean;
}

function Cell({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-border px-3 py-2">
      <p className="text-[10px] uppercase tracking-wide text-muted">{label}</p>
      <p className="text-sm font-medium mt-0.5">{value}</p>
    </div>
  );
}

export function BaselineReportView({
  summary,
  highlights,
  snapshot,
  createdAt,
  sentAt,
  compact,
}: BaselineReportViewProps) {
  return (
    <div className="rounded-lg border border-border p-4 space-y-3">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="text-sm font-medium">
          Baseline · {new Date(createdAt).toLocaleDateString()}
        </p>
        {sentAt && (
          <p className="text-xs text-muted">
            Sent {new Date(sentAt).toLocaleDateString()}
          </p>
        )}
      </div>
      {summary && <p className="text-sm text-muted">{summary}</p>}
      {highlights.length > 0 && (
        <ul className="space-y-1">
          {highlights.map((h) => (
            <li key={h} className="text-sm text-accent">
              • {h}
            </li>
          ))}
        </ul>
      )}
      {!compact && (
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4 pt-1">
          <Cell
            label="Sessions"
            value={
              snapshot.traffic.sessions != null
                ? String(snapshot.traffic.sessions)
                : snapshot.traffic.note ?? "—"
            }
          />
          <Cell
            label="Keywords"
            value={String(Object.keys(snapshot.rankings.map).length)}
          />
          <Cell
            label="Citations live"
            value={`${snapshot.citations.live}/${snapshot.citations.total}`}
          />
          <Cell
            label="Reviews"
            value={
              snapshot.reviews.rating != null
                ? `${snapshot.reviews.rating.toFixed(1)}★`
                : "—"
            }
          />
        </div>
      )}
    </div>
  );
}

export function VsBaselineView({ vs }: { vs: VsBaseline }) {
  return (
    <div className="mt-3 rounded-md border border-border bg-surface px-3 py-2 space-y-1">
      <p className="text-xs font-medium uppercase tracking-wide text-muted">
        vs kickoff baseline
      </p>
      {vs.sessionsPercent != null && (
        <p className="text-sm">
          Sessions {vs.sessionsPercent >= 0 ? "+" : ""}
          {vs.sessionsPercent}% ({vs.baselineSessions ?? "—"} → {vs.currentSessions ?? "—"})
        </p>
      )}
      <p className="text-sm">
        {vs.rankImprovements} keyword{vs.rankImprovements === 1 ? "" : "s"} improved
      </p>
      {vs.rankMessages.map((m) => (
        <p key={m} className="text-xs text-accent">
          {m}
        </p>
      ))}
    </div>
  );
}
