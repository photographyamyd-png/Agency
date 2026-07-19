import { BASELINE_AUDIT_ITEMS } from "@/lib/blueprint/phase-1-intake";
import { saveBaselineAuditItem } from "@/lib/actions/baseline-audit";
import { runPageSpeedAction } from "@/lib/actions/pagespeed";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import type { BaselineAuditData } from "@/lib/blueprint/phase-1-intake";

interface BaselineAuditWizardProps {
  clientId: string;
  auditData: BaselineAuditData;
  siteUrl?: string | null;
}

export function BaselineAuditWizard({ clientId, auditData, siteUrl }: BaselineAuditWizardProps) {
  const doneCount = Object.values(auditData).filter((v) => v.status === "done").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted">
          {doneCount} of {BASELINE_AUDIT_ITEMS.length} baseline items complete
        </p>
        <div className="h-2 w-32 rounded-full bg-surface overflow-hidden">
          <div
            className="h-full bg-accent transition-all"
            style={{ width: `${(doneCount / BASELINE_AUDIT_ITEMS.length) * 100}%` }}
          />
        </div>
      </div>

      <ul className="space-y-3">
        {BASELINE_AUDIT_ITEMS.map((item) => {
          const value = auditData[item.key];
          return (
            <li
              key={item.key}
              className="rounded-lg border border-border-bright bg-surface-raised p-4 space-y-3"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium">{item.label}</p>
                  <p className="text-xs text-muted mt-0.5">{item.description}</p>
                  {item.toolUrl && (
                    <a
                      href={item.toolUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-accent-bright hover:underline mt-1 inline-block"
                    >
                      Open free tool →
                    </a>
                  )}
                </div>
                <Badge
                  variant={
                    value?.status === "done"
                      ? "success"
                      : value?.status === "na"
                        ? "muted"
                        : "warning"
                  }
                >
                  {value?.status ?? "pending"}
                </Badge>
              </div>

              <form
                action={async (fd) => {
                  "use server";
                  await saveBaselineAuditItem(
                    clientId,
                    item.key,
                    fd.get("status") as "pending" | "done" | "na",
                    (fd.get("notes") as string) || undefined
                  );
                }}
                className="flex flex-wrap gap-2 items-end"
              >
                <select
                  name="status"
                  defaultValue={value?.status ?? "pending"}
                  className="h-9 rounded-md border border-border bg-background px-3 text-sm"
                >
                  <option value="pending">Pending</option>
                  <option value="done">Done</option>
                  <option value="na">N/A</option>
                </select>
                <Input
                  name="notes"
                  placeholder="Notes"
                  defaultValue={value?.notes ?? ""}
                  className="max-w-xs"
                />
                <Button type="submit" size="sm" variant="outline">
                  Save
                </Button>
              </form>

              {item.key === "pagespeed_baseline" && siteUrl && (
                <form action={runPageSpeedAction} className="flex gap-2">
                  <input type="hidden" name="clientId" value={clientId} />
                  <input type="hidden" name="url" value={siteUrl} />
                  <Button type="submit" size="sm" variant="outline">
                    Run PageSpeed on {siteUrl}
                  </Button>
                </form>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
