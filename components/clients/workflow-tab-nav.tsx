import Link from "next/link";
import { CLIENT_WORKSPACE_TABS } from "@/lib/blueprint/phases";
import { computeWorkflowState } from "@/lib/blueprint/workflow";
import type { ClientWorkspaceData } from "@/lib/data/client-workspace";
import { cn } from "@/lib/utils";
import { Check, Lock } from "lucide-react";

interface WorkflowTabNavProps {
  clientId: string;
  client: ClientWorkspaceData;
  activeTab: string;
  browseMode?: boolean;
}

export function WorkflowTabNav({ clientId, client, activeTab, browseMode = false }: WorkflowTabNavProps) {
  const steps = computeWorkflowState(client);

  function tabPhaseStatus(tabId: string): "complete" | "current" | "locked" | "neutral" {
    const tabPhases = steps.filter((s) => s.tabId === tabId);
    if (tabPhases.length === 0) return "neutral";
    if (tabPhases.every((s) => s.status === "complete")) return "complete";
    if (tabPhases.some((s) => s.status === "current")) return "current";
    if (tabPhases.some((s) => s.status === "locked")) return "locked";
    return "neutral";
  }

  const browseQuery = browseMode ? "&browse=1" : "";

  return (
    <nav className="flex flex-wrap gap-1 border-b border-border-bright pb-px">
      {CLIENT_WORKSPACE_TABS.map(({ id, label }) => {
        const phaseStatus = browseMode ? "neutral" : tabPhaseStatus(id);
        const isLocked = !browseMode && phaseStatus === "locked";
        const isCurrent = phaseStatus === "current";
        const isComplete = phaseStatus === "complete";

        return (
          <Link
            key={id}
            href={
              isLocked
                ? `/clients/${clientId}?tab=overview`
                : `/clients/${clientId}?tab=${id}${browseQuery}`
            }
            title={
              isLocked
                ? "Complete earlier blueprint phases to unlock"
                : undefined
            }
            className={cn(
              "rounded-t-md px-3 py-2 text-xs sm:text-sm font-medium transition-colors inline-flex items-center gap-1.5",
              activeTab === id
                ? "bg-surface-raised text-accent-bright border border-border-bright border-b-transparent -mb-px"
                : isLocked
                  ? "text-muted/50 cursor-not-allowed"
                  : "text-muted hover:text-foreground",
              isCurrent && activeTab !== id && "ring-1 ring-accent/40 ring-inset rounded-md"
            )}
            aria-disabled={isLocked}
          >
            {isComplete && <Check className="h-3 w-3 text-emerald-500" />}
            {isLocked && <Lock className="h-3 w-3" />}
            {isCurrent && activeTab !== id && (
              <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
            )}
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
