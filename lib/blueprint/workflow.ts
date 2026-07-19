import type { ClientWorkspaceData } from "@/lib/data/client-workspace";
import { BASELINE_AUDIT_ITEMS, emptyBaselineAudit } from "./phase-1-intake";
import { baselineAuditDataSchema } from "@/lib/validation/blueprint";
import { BLUEPRINT_PHASES, type BlueprintPhaseId } from "./phases";
import { computePhaseProgress } from "./phase-progress";

export type WorkflowStepStatus = "complete" | "current" | "locked" | "upcoming";

export interface WorkflowStep {
  phaseId: BlueprintPhaseId;
  number: number;
  name: string;
  tabId: string;
  goal: string;
  timing: string;
  status: WorkflowStepStatus;
  progress: number;
  nextActions: string[];
  blockedBy?: string;
}

const ALWAYS_OPEN_TABS = new Set(["overview", "vault", "portal"]);

function isPhaseComplete(
  phaseId: BlueprintPhaseId,
  client: ClientWorkspaceData,
  progress: Record<BlueprintPhaseId, number>
): boolean {
  const auditRaw = client.baselineAudits[0]?.dataJson;
  const auditParsed = baselineAuditDataSchema.safeParse(auditRaw ?? emptyBaselineAudit());
  const audit = auditParsed.success ? auditParsed.data : emptyBaselineAudit();
  const auditDone = Object.values(audit).filter(
    (v) => v.status === "done" || v.status === "na"
  ).length;

  const intel = client.brandProfile?.businessIntelJson as Record<string, string> | null;
  const intelFilled = intel ? Object.values(intel).filter(Boolean).length : 0;

  const allPages = client.pages.flatMap((p) => [p, ...p.children]);
  const goldenLocked = (client.brandProfile?.goldenNapJson as { locked?: boolean } | null)?.locked;

  switch (phaseId) {
    case "discovery":
      return auditDone >= Math.ceil(BASELINE_AUDIT_ITEMS.length * 0.8) && intelFilled >= 3;
    case "competitive":
      return client.competitors.length >= 3 && client.geoGridSnapshots.length >= 1;
    case "keywords":
      return client.keywords.length >= 3 && client.keywords.some((k) => k.intent);
    case "architecture":
      return client.pages.length >= 1;
    case "technical":
      return client.techHealthLogs.length >= 1 || progress.technical >= 80;
    case "onpage":
      return progress.onpage >= 50 || allPages.some((p) => p.status === "LIVE");
    case "gbp":
      return client.gbpActivity.length >= 1 || client.brandProfile?.gbpConnected === true;
    case "citations":
      return goldenLocked === true && client.citations.some((c) => c.status === "LIVE");
    case "reviews":
      return Boolean(client.brandProfile?.reviewTargetsJson);
    case "links":
      return client.localLinks.length >= 1 || client.contentItems.length >= 1;
    case "tracking":
      return client.integrations.some((i) => i.status === "CONNECTED");
    case "monthly_ops":
      return (client.maintenanceLogs[0]?.items.filter((i) => i.status === "DONE").length ?? 0) >= 1;
    default:
      return progress[phaseId] >= 80;
  }
}

function nextActionsForPhase(
  phaseId: BlueprintPhaseId,
  client: ClientWorkspaceData
): string[] {
  const auditRaw = client.baselineAudits[0]?.dataJson;
  const auditParsed = baselineAuditDataSchema.safeParse(auditRaw ?? emptyBaselineAudit());
  const audit = auditParsed.success ? auditParsed.data : emptyBaselineAudit();
  const pendingAudit = BASELINE_AUDIT_ITEMS.filter(
    (item) => audit[item.key]?.status === "pending"
  ).map((item) => item.label);

  switch (phaseId) {
    case "discovery":
      return pendingAudit.length > 0
        ? [`Complete baseline: ${pendingAudit[0]}`, "Fill in business intelligence form"]
        : ["Fill in business intelligence form", "Complete remaining baseline audit items"];
    case "competitive":
      if (client.competitors.length < 3) {
        return [`Add ${3 - client.competitors.length} more map-pack competitor(s)`, "Capture geo-grid snapshot"];
      }
      return ["Capture geo-grid snapshot", "Generate action plan from research"];
    case "keywords":
      return client.keywords.length === 0
        ? ["Add primary keyword from discovery", "Tag each keyword with intent tier"]
        : ["Assign keywords to pages", "Import from GSC after integrations connect"];
    case "architecture":
      return client.pages.length === 0
        ? ["Seed sitemap from template", "Add city and service pages"]
        : ["Add missing page types", "Set page status as you build"];
    case "technical":
      return ["Run PageSpeed audit", "Complete technical checklist on Site Map tab"];
    case "onpage":
      return ["Check off on-page SEO items per page", "Add schema markup to key pages"];
    case "gbp":
      return ["Complete GBP governance checklist", "Log first GBP post"];
    case "citations":
      return goldenNapLocked(client)
        ? ["Submit Tier 1 citations", "Mark directories as LIVE when verified"]
        : ["Lock Golden Record NAP first", "Then submit Tier 1 directories"];
    case "reviews":
      return ["Set review link and monthly target", "Configure request template"];
    case "links":
      return ["Add local link prospects", "Plan content calendar item"];
    case "tracking":
      return ["Connect GA4, GSC, and GBP under Integrations", "Confirm conversion tracking in baseline"];
    case "monthly_ops":
      return ["Work through monthly SOP checklist", "Send monthly report to client"];
    default:
      return ["Continue this phase"];
  }
}

function goldenNapLocked(client: ClientWorkspaceData): boolean {
  return (client.brandProfile?.goldenNapJson as { locked?: boolean } | null)?.locked === true;
}

export function computeWorkflowState(client: ClientWorkspaceData): WorkflowStep[] {
  const progress = computePhaseProgress(client);
  const steps: WorkflowStep[] = [];
  let previousComplete = true;

  for (const phase of BLUEPRINT_PHASES) {
    const complete = isPhaseComplete(phase.id, client, progress);
    let status: WorkflowStepStatus;

    if (complete) {
      status = "complete";
    } else if (!previousComplete) {
      status = "locked";
    } else if (!steps.some((s) => s.status === "current")) {
      status = "current";
    } else {
      status = "upcoming";
    }

    const priorPhase = BLUEPRINT_PHASES.find((p) => p.number === phase.number - 1);
    steps.push({
      phaseId: phase.id,
      number: phase.number,
      name: phase.name,
      tabId: phase.tabId,
      goal: phase.goal,
      timing: phase.timing,
      status,
      progress: progress[phase.id],
      nextActions: nextActionsForPhase(phase.id, client),
      blockedBy:
        status === "locked" && priorPhase
          ? `Complete Phase ${priorPhase.number}: ${priorPhase.name}`
          : undefined,
    });

    previousComplete = complete;
  }

  return steps;
}

export function getCurrentWorkflowStep(client: ClientWorkspaceData): WorkflowStep | null {
  return computeWorkflowState(client).find((s) => s.status === "current") ?? null;
}

export function getCurrentWorkflowTab(client: ClientWorkspaceData): string {
  const current = getCurrentWorkflowStep(client);
  if (current) return current.tabId;
  const firstIncomplete = computeWorkflowState(client).find((s) => s.status !== "complete");
  return firstIncomplete?.tabId ?? "overview";
}

export function canAccessWorkflowTab(
  client: ClientWorkspaceData,
  tabId: string
): { allowed: boolean; reason?: string; redirectTab?: string } {
  if (ALWAYS_OPEN_TABS.has(tabId)) {
    return { allowed: true };
  }

  const steps = computeWorkflowState(client);
  const stepForTab = steps.find((s) => s.tabId === tabId);
  if (!stepForTab) return { allowed: true };

  const tabSteps = steps.filter((s) => s.tabId === tabId);
  const anyLocked = tabSteps.some((s) => s.status === "locked");
  if (anyLocked) {
    const current = getCurrentWorkflowStep(client);
    return {
      allowed: false,
      reason: tabSteps.find((s) => s.blockedBy)?.blockedBy ?? "Complete earlier phases first",
      redirectTab: current?.tabId ?? "intake",
    };
  }

  return { allowed: true };
}

export function workflowSummary(client: ClientWorkspaceData) {
  const steps = computeWorkflowState(client);
  const complete = steps.filter((s) => s.status === "complete").length;
  const current = steps.find((s) => s.status === "current");
  return { steps, complete, total: steps.length, current };
}
