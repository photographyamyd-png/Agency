import type { MaintenanceChecklist, MaintenanceChecklistItem } from "@prisma/client";
import { updateMaintenanceItem } from "@/lib/actions/maintenance";
import { QA_CHECKLIST_ITEMS } from "@/lib/blueprint/monthly-sops";
import { getMonthlySopPlaybook } from "@/lib/blueprint/checklist-playbooks";
import { ChecklistPlaybookDetails } from "@/components/clients/checklist-playbook";
import { SectionGuide } from "@/components/clients/section-guide";
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
    return (
      <div className="space-y-3">
        <SectionGuide guideId="reports.maintenance" />
        <p className="text-sm text-muted">Monthly maintenance checklist will auto-generate on the 1st.</p>
      </div>
    );
  }

  const done = checklist.items.filter((i) => i.status === "DONE").length;

  return (
    <div className="space-y-6">
      <SectionGuide guideId="reports.maintenance" />
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted">
          {checklist.periodMonth}/{checklist.periodYear} — {done}/{checklist.items.length} complete
        </span>
        {checklist.completedAt && (
          <Badge variant="success">Month complete</Badge>
        )}
      </div>

      <ul className="space-y-2">
        {checklist.items.map((item) => {
          const playbook = getMonthlySopPlaybook(item.label);
          return (
            <li
              key={item.id}
              className="rounded-lg border border-border-bright bg-surface-raised px-4 py-3 text-sm space-y-2"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <Badge variant="muted" className="mr-2 text-xs">{item.category}</Badge>
                  <span className={item.status === "DONE" ? "line-through text-muted" : ""}>{item.label}</span>
                </div>
                {item.status !== "DONE" && (
                  <form action={async () => { "use server"; await updateMaintenanceItem(item.id, "DONE"); }}>
                    <Button type="submit" size="sm" variant="outline" className="h-7">Done</Button>
                  </form>
                )}
              </div>
              {playbook && <ChecklistPlaybookDetails playbook={playbook} />}
            </li>
          );
        })}
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
