import type { MaintenanceChecklist, MaintenanceChecklistItem } from "@prisma/client";
import { updateMaintenanceItem } from "@/lib/actions/maintenance";
import { QA_CHECKLIST_ITEMS } from "@/lib/blueprint/monthly-sops";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type ChecklistWithItems = MaintenanceChecklist & {
  items: MaintenanceChecklistItem[];
};

interface MaintenancePanelProps {
  checklist: ChecklistWithItems | null;
}

export function MaintenancePanel({ checklist }: MaintenancePanelProps) {
  if (!checklist) {
    return <p className="text-sm text-muted">Monthly maintenance checklist will auto-generate on the 1st.</p>;
  }

  const done = checklist.items.filter((i) => i.status === "DONE").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted">
          {checklist.periodMonth}/{checklist.periodYear} — {done}/{checklist.items.length} complete
        </span>
        {checklist.completedAt && (
          <Badge variant="success">Month complete</Badge>
        )}
      </div>

      <ul className="space-y-2">
        {checklist.items.map((item) => (
          <li key={item.id} className="flex items-center justify-between rounded-lg border border-border-bright bg-surface-raised px-4 py-3 text-sm">
            <div>
              <Badge variant="muted" className="mr-2 text-xs">{item.category}</Badge>
              <span className={item.status === "DONE" ? "line-through text-muted" : ""}>{item.label}</span>
            </div>
            {item.status !== "DONE" && (
              <form action={async () => { "use server"; await updateMaintenanceItem(item.id, "DONE"); }}>
                <Button type="submit" size="sm" variant="outline" className="h-7">Done</Button>
              </form>
            )}
          </li>
        ))}
      </ul>

      <section className="space-y-2">
        <h3 className="text-sm font-medium">QA Checklist (§13.2)</h3>
        <ul className="space-y-1">
          {QA_CHECKLIST_ITEMS.map((item) => (
            <li key={item} className="text-sm text-muted flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-border-bright" />
              {item}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
