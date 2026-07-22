import Link from "next/link";
import type { ClientWorkspaceData } from "@/lib/data/client-workspace";
import {
  computeWorkflowState,
  getCurrentWorkflowStep,
  workflowSummary,
} from "@/lib/blueprint/workflow";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SectionGuide } from "@/components/clients/section-guide";
import { cn } from "@/lib/utils";
import { CheckCircle2, Circle, Lock } from "lucide-react";

interface BlueprintWorkflowGuideProps {
  client: ClientWorkspaceData;
  activeTab: string;
  compact?: boolean;
}

export function BlueprintWorkflowGuide({
  client,
  activeTab,
  compact = false,
}: BlueprintWorkflowGuideProps) {
  const { complete, total, current } = workflowSummary(client);
  const steps = computeWorkflowState(client);
  const activeStep = getCurrentWorkflowStep(client);

  if (compact) {
    if (!activeStep) {
      return (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4 flex items-center justify-between gap-4">
          <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
            All 12 blueprint phases complete — focus on monthly ops
          </p>
          <Button size="sm" variant="outline" asChild>
            <Link href={`/clients/${client.id}?tab=reports`}>Monthly ops</Link>
          </Button>
        </div>
      );
    }

    return (
      <div className="rounded-xl border border-accent/40 bg-accent/5 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs text-muted uppercase tracking-wide">Current step</p>
          <p className="text-sm font-medium mt-0.5">
            Phase {activeStep.number} of {total}: {activeStep.name}
          </p>
          <p className="text-xs text-muted mt-1">{activeStep.nextActions[0]}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Badge variant="muted">{complete}/{total} done</Badge>
          {activeTab !== activeStep.tabId && (
            <Button size="sm" asChild>
              <Link href={`/clients/${client.id}?tab=${activeStep.tabId}`}>
                Continue →
              </Link>
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border-bright bg-surface-raised p-6 space-y-4">
      <SectionGuide guideId="overview.workflow" />
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h3 className="text-sm font-medium">Blueprint delivery path</h3>
          <p className="text-xs text-muted mt-1">
            Phases unlock in order. Complete each step before the next opens.
          </p>
        </div>
        <Badge variant="muted" className="shrink-0 tabular-nums">
          {complete} / {total} phases complete
        </Badge>
      </div>

      {current && (
        <div className="rounded-lg border border-accent/30 bg-accent/5 p-4">
          <p className="text-xs font-medium text-accent-bright">Do this now</p>
          <p className="text-sm font-medium mt-1">
            Phase {current.number}: {current.name}
          </p>
          <p className="text-xs text-muted mt-1">{current.goal}</p>
          <ul className="mt-3 space-y-1">
            {current.nextActions.map((action) => (
              <li key={action} className="text-sm text-muted flex items-start gap-2">
                <span className="text-accent-bright mt-0.5">→</span>
                {action}
              </li>
            ))}
          </ul>
          {activeTab !== current.tabId && (
            <Button size="sm" className="mt-4" asChild>
              <Link href={`/clients/${client.id}?tab=${current.tabId}`}>
                Go to Phase {current.number}
              </Link>
            </Button>
          )}
        </div>
      )}

      <ol className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {steps.map((step) => (
          <li key={step.phaseId}>
            <Link
              href={
                step.status === "locked"
                  ? `#`
                  : `/clients/${client.id}?tab=${step.tabId}`
              }
              className={cn(
                "flex items-start gap-2 rounded-lg border p-3 text-sm transition-colors",
                step.status === "complete" &&
                  "border-emerald-500/20 bg-emerald-500/5 opacity-80",
                step.status === "current" &&
                  "border-accent bg-accent/5 ring-1 ring-accent/30",
                step.status === "locked" &&
                  "border-border-bright opacity-50 cursor-not-allowed pointer-events-none",
                step.status === "upcoming" &&
                  "border-border-bright hover:border-accent/30 hover:bg-surface"
              )}
              aria-disabled={step.status === "locked"}
            >
              {step.status === "complete" ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
              ) : step.status === "locked" ? (
                <Lock className="h-4 w-4 text-muted shrink-0 mt-0.5" />
              ) : (
                <Circle
                  className={cn(
                    "h-4 w-4 shrink-0 mt-0.5",
                    step.status === "current" ? "text-accent-bright fill-accent/20" : "text-muted"
                  )}
                />
              )}
              <span>
                <span className="font-medium block">
                  {step.number}. {step.name}
                </span>
                <span className="text-xs text-muted">{step.timing}</span>
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}
