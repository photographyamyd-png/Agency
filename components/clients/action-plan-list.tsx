import type { ActionPlanItem } from "@prisma/client";
import { updateActionPlanItem, deleteActionPlanItem } from "@/lib/actions/action-plan";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ActionPlanListProps {
  clientId: string;
  items: ActionPlanItem[];
}

const PRIORITY_VARIANT: Record<string, "danger" | "warning" | "muted" | "success"> = {
  URGENT: "danger",
  QUICK_WIN: "success",
  MEDIUM: "warning",
  LONG_TERM: "muted",
};

export function ActionPlanList({ clientId, items }: ActionPlanListProps) {
  if (items.length === 0) {
    return (
      <p className="text-sm text-muted">
        No action plan items yet — use &quot;Generate action plan&quot; after competitor research.
      </p>
    );
  }

  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li
          key={item.id}
          className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border-bright bg-surface-raised px-4 py-3 text-sm"
        >
          <div className="space-y-1 min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant={PRIORITY_VARIANT[item.priority] ?? "muted"} className="text-xs">
                {item.priority.replace(/_/g, " ")}
              </Badge>
              <Badge variant={item.status === "DONE" ? "success" : "muted"} className="text-xs">
                {item.status}
              </Badge>
            </div>
            <p className={item.status === "DONE" ? "line-through text-muted" : "font-medium"}>
              {item.title}
            </p>
            {item.description && (
              <p className="text-xs text-muted truncate">{item.description}</p>
            )}
          </div>
          <div className="flex gap-2 shrink-0">
            {item.status !== "DONE" && (
              <form
                action={async () => {
                  "use server";
                  await updateActionPlanItem(item.id, "DONE", clientId);
                }}
              >
                <Button type="submit" size="sm" variant="outline" className="h-7">
                  Done
                </Button>
              </form>
            )}
            <form
              action={async () => {
                "use server";
                await deleteActionPlanItem(item.id, clientId);
              }}
            >
              <Button type="submit" size="sm" variant="outline" className="h-7 text-muted">
                Remove
              </Button>
            </form>
          </div>
        </li>
      ))}
    </ul>
  );
}
