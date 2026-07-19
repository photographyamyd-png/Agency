import { saveGeoReadinessItem } from "@/lib/actions/site-checklist";
import { GEO_READINESS_CHECKLIST } from "@/lib/blueprint/geo-checklist";
import type { GeoReadinessData } from "@/lib/blueprint/geo-readiness";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface GeoReadinessPanelProps {
  clientId: string;
  data: GeoReadinessData;
}

export function GeoReadinessPanel({ clientId, data }: GeoReadinessPanelProps) {
  const doneCount = Object.values(data).filter((v) => v.status === "done").length;

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">GEO / AI Readiness (§11)</h3>
        <p className="text-xs text-muted">
          {doneCount}/{GEO_READINESS_CHECKLIST.length} complete
        </p>
      </div>
      <ul className="space-y-2">
        {GEO_READINESS_CHECKLIST.map((item) => {
          const value = data[item.key];
          return (
            <li
              key={item.key}
              className="rounded-lg border border-border-bright bg-surface-raised p-3 text-sm space-y-2"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-medium">{item.label}</p>
                  <p className="text-xs text-muted mt-0.5">{item.description}</p>
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
                  await saveGeoReadinessItem(
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
                  className="h-8 text-xs rounded border border-border px-2"
                >
                  <option value="pending">Pending</option>
                  <option value="done">Done</option>
                  <option value="na">N/A</option>
                </select>
                <input
                  name="notes"
                  defaultValue={value?.notes ?? ""}
                  placeholder="Notes"
                  className="h-8 flex-1 min-w-[120px] text-xs rounded border border-border px-2"
                />
                <Button type="submit" size="sm" variant="outline" className="h-8">
                  Save
                </Button>
              </form>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
