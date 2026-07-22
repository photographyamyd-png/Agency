import Link from "next/link";
import type { ClientWorkspaceData } from "@/lib/data/client-workspace";
import { computePhaseProgress } from "@/lib/blueprint/phase-progress";
import { canAccessWorkflowTab } from "@/lib/blueprint/workflow";
import {
  BASELINE_AUDIT_ITEMS,
  emptyBaselineAudit,
} from "@/lib/blueprint/phase-1-intake";
import { baselineAuditDataSchema } from "@/lib/validation/blueprint";
import { ClientPortalInviteForm } from "@/components/clients/portal-invite-form";
import { BaselineAuditWizard } from "@/components/clients/baseline-audit-wizard";
import { BaselineReportPanel } from "@/components/clients/baseline-report-panel";
import { BaselineReportView, VsBaselineView } from "@/components/reports/baseline-report-view";
import type { BaselineSnapshot } from "@/lib/reports/baseline-snapshot";
import type { VsBaseline } from "@/lib/reports/highlights";
import { BusinessIntelForm } from "@/components/clients/business-intel-form";
import { CompetitorAudit } from "@/components/clients/competitor-audit";
import { KeywordManager } from "@/components/clients/keyword-manager";
import { SitemapBuilder } from "@/components/clients/sitemap-builder";
import { OnPageSeoMatrix } from "@/components/clients/on-page-seo-matrix";
import { GoldenNapEditor } from "@/components/clients/golden-nap-editor";
import { CitationTracker } from "@/components/clients/citation-tracker";
import { GbpHub } from "@/components/clients/gbp-hub";
import { ReviewEngine } from "@/components/clients/review-engine";
import { LinksGeoPanel } from "@/components/clients/links-geo-panel";
import { VaultPanel } from "@/components/clients/vault-panel";
import { MaintenancePanel } from "@/components/clients/maintenance-panel";
import { SectionGuide } from "@/components/clients/section-guide";
import { PhaseProgress, QuickReferencePanel } from "@/components/clients/phase-progress";
import { BlueprintWorkflowGuide } from "@/components/clients/blueprint-workflow-guide";
import { WorkflowTabNav } from "@/components/clients/workflow-tab-nav";
import { OnboardingProgressPanel } from "@/components/clients/onboarding-progress-panel";
import { Button } from "@/components/ui/button";
import { StatHighlight } from "@/components/ui/stat-highlight";
import { Badge } from "@/components/ui/badge";

interface ClientWorkspaceTabsProps {
  client: ClientWorkspaceData;
  activeTab: string;
  browseMode?: boolean;
}

export function ClientWorkspaceTabs({ client, activeTab, browseMode = false }: ClientWorkspaceTabsProps) {
  const tabIds = ["overview", "intake", "research", "keywords", "sitemap", "onpage", "gbp", "citations", "reviews", "links", "reports", "vault", "portal"];
  const tab = tabIds.includes(activeTab) ? activeTab : "overview";

  const access = browseMode ? { allowed: true } : canAccessWorkflowTab(client, tab);
  const effectiveTab = access.allowed ? tab : "overview";

  const phaseCompletion = computePhaseProgress(client);

  const rankWin = client.keywords.find((kw) => {
    const [cur, prev] = kw.rankSnapshots;
    return cur?.rank != null && prev?.rank != null && prev.rank > cur.rank;
  });

  const auditRaw = client.baselineAudits[0]?.dataJson;
  const auditParsed = baselineAuditDataSchema.safeParse(auditRaw ?? emptyBaselineAudit());
  const auditData = auditParsed.success ? auditParsed.data : emptyBaselineAudit();

  const intel = (client.brandProfile?.businessIntelJson as Record<string, string>) ?? {};
  const siteUrl = client.brandProfile?.existingSiteUrl ?? client.brandProfile?.domain
    ? `https://${client.brandProfile.domain}`
    : null;

  const checklistDone = Object.values(auditData).filter(
    (v) => v.status === "done" || v.status === "na"
  ).length;
  const hasGoogle = client.integrations.some(
    (i) =>
      i.status === "CONNECTED" &&
      (i.service === "GA4" ||
        i.service === "GOOGLE_SEARCH_CONSOLE" ||
        i.service === "GBP")
  );
  const hasPagespeed = client.techHealthLogs.length > 0;
  const session = client.onboardingSessions[0];
  const stages = Array.isArray(session?.completedStages)
    ? (session.completedStages as string[])
    : [];
  const accessDone =
    session?.status === "COMPLETED" ||
    stages.includes("ACCESS") ||
    stages.includes("COMPLETED");
  const hasSite =
    !!(client.brandProfile?.existingSiteUrl || client.brandProfile?.domain);
  const baselineReady =
    hasSite &&
    (hasGoogle || hasPagespeed) &&
    (checklistDone / BASELINE_AUDIT_ITEMS.length >= 0.5 || accessDone);

  const flatPages = client.pages.flatMap((p) => [p, ...p.children]);

  return (
    <div className="space-y-6">
      <BlueprintWorkflowGuide client={client} activeTab={effectiveTab} compact />

      {!access.allowed && tab !== "overview" && (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <p className="text-sm text-muted">
            <span className="font-medium text-foreground">This phase is locked.</span>{" "}
            {access.reason}
          </p>
          {access.redirectTab && (
            <Button size="sm" asChild>
              <Link href={`/clients/${client.id}?tab=${access.redirectTab}`}>
                Go to current step
              </Link>
            </Button>
          )}
        </div>
      )}

      <WorkflowTabNav clientId={client.id} client={client} activeTab={effectiveTab} browseMode={browseMode} />

      {effectiveTab === "overview" && (
        <div className="space-y-6">
          <OnboardingProgressPanel client={client} />
          <BlueprintWorkflowGuide client={client} activeTab={effectiveTab} />
          <PhaseProgress phaseCompletion={phaseCompletion} />
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-xl border border-border-bright bg-surface-raised p-6 space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted">Status</span>
                <Badge variant="muted">{client.status}</Badge>
              </div>
              <p className="text-sm text-muted">
                {client.integrations.filter((i) => i.status === "CONNECTED").length} integrations ·{" "}
                {client.keywords.length} keywords · {client.citations.filter((c) => c.status === "LIVE").length} live citations
              </p>
            </div>
            {rankWin && (
              <StatHighlight
                stat={`#${rankWin.rankSnapshots[1]!.rank} → #${rankWin.rankSnapshots[0]!.rank}`}
                label={`${rankWin.term} rank improvement`}
              />
            )}
          </div>
          <QuickReferencePanel />
        </div>
      )}

      {access.allowed && effectiveTab === "intake" && (
        <div className="space-y-8">
          <OnboardingProgressPanel client={client} />
          <BaselineReportPanel
            clientId={client.id}
            report={client.baselineReport}
            ready={baselineReady}
          />
          <BusinessIntelForm clientId={client.id} data={intel} />
          <BaselineAuditWizard clientId={client.id} auditData={auditData} siteUrl={siteUrl} />
        </div>
      )}

      {access.allowed && effectiveTab === "research" && (
        <CompetitorAudit
          clientId={client.id}
          competitors={client.competitors}
          geoGridSnapshots={client.geoGridSnapshots}
          actionPlanItems={client.actionPlanItems}
        />
      )}

      {access.allowed && effectiveTab === "keywords" && (
        <KeywordManager
          clientId={client.id}
          keywords={client.keywords}
          serviceArea={(client.brandProfile?.serviceAreas as string[])?.[0] ?? ""}
          primarySeed={client.brandProfile?.primaryKeyword}
          pages={flatPages}
        />
      )}

      {access.allowed && effectiveTab === "sitemap" && (
        <SitemapBuilder
          clientId={client.id}
          pages={client.pages}
          techHealthLogs={client.techHealthLogs}
          siteUrl={siteUrl}
        />
      )}

      {access.allowed && effectiveTab === "onpage" && (
        <OnPageSeoMatrix
          clientId={client.id}
          pages={client.pages}
          siteChecklistRaw={client.brandProfile?.siteSeoChecklistJson}
        />
      )}

      {access.allowed && effectiveTab === "gbp" && (
        <GbpHub
          clientId={client.id}
          gbpActivity={client.gbpActivity}
          gbpConnected={client.brandProfile?.gbpConnected ?? false}
          siteUrl={siteUrl}
        />
      )}

      {access.allowed && effectiveTab === "citations" && (
        <div className="space-y-8">
          <GoldenNapEditor
            clientId={client.id}
            goldenNap={(client.brandProfile?.goldenNapJson as Record<string, unknown>) ?? null}
          />
          <CitationTracker clientId={client.id} citations={client.citations} />
        </div>
      )}

      {access.allowed && effectiveTab === "reviews" && (
        <ReviewEngine
          clientId={client.id}
          reviewSnapshots={client.reviewSnapshots}
          reviewTargets={(client.brandProfile?.reviewTargetsJson as Record<string, unknown>) ?? null}
        />
      )}

      {access.allowed && effectiveTab === "links" && (
        <LinksGeoPanel
          clientId={client.id}
          localLinks={client.localLinks}
          contentItems={client.contentItems}
          geoReadinessRaw={client.brandProfile?.geoReadinessJson}
        />
      )}

      {access.allowed && effectiveTab === "reports" && (
        <div className="space-y-8">
          <SectionGuide guideId="reports.tab" />
          <MaintenancePanel checklist={client.maintenanceLogs[0] ?? null} />

          <section className="space-y-3">
            <h3 className="text-sm font-medium">Baseline starting report</h3>
            <SectionGuide guideId="reports.baseline" />
            {client.baselineReport ? (
              <BaselineReportView
                summary={client.baselineReport.summary}
                highlights={(client.baselineReport.highlights as string[]) ?? []}
                snapshot={client.baselineReport.dataJson as unknown as BaselineSnapshot}
                createdAt={client.baselineReport.createdAt}
                sentAt={client.baselineReport.sentAt}
              />
            ) : (
              <p className="text-sm text-muted">
                No baseline yet — generate one from Intake & Baseline.
              </p>
            )}
          </section>

          <section>
            <h3 className="text-sm font-medium mb-3">Monthly Reports</h3>
            <SectionGuide guideId="reports.monthly" />
            <ul className="space-y-3">
              {client.monthlyReports.map((r) => {
                const data = r.dataJson as {
                  highlights?: string[];
                  vsBaseline?: VsBaseline | null;
                } | null;
                return (
                  <li key={r.id} className="rounded-xl border border-border-bright bg-surface-raised p-4 text-sm">
                    <p className="font-medium">
                      {new Date(r.periodStart).toLocaleDateString()} –{" "}
                      {new Date(r.periodEnd).toLocaleDateString()}
                    </p>
                    {r.summary && <p className="mt-1 text-muted">{r.summary}</p>}
                    {data?.vsBaseline && <VsBaselineView vs={data.vsBaseline} />}
                  </li>
                );
              })}
              {client.monthlyReports.length === 0 && (
                <p className="text-sm text-muted">No monthly reports yet.</p>
              )}
            </ul>
          </section>

          <section>
            <h3 className="text-sm font-medium mb-3">Weekly Reports</h3>
            <SectionGuide guideId="reports.weekly" />
            <ul className="space-y-3">
              {client.weeklyReports.map((r) => {
                const highlights = (r.highlights as string[] | null) ?? [];
                return (
                  <li key={r.id} className="rounded-xl border border-border-bright bg-surface-raised p-4 text-sm">
                    <p className="font-medium">Week of {new Date(r.periodStart).toLocaleDateString()}</p>
                    {highlights[0] && <p className="mt-1 text-muted">{highlights[0]}</p>}
                  </li>
                );
              })}
              {client.weeklyReports.length === 0 && (
                <p className="text-sm text-muted">No reports yet.</p>
              )}
            </ul>
          </section>
        </div>
      )}

      {effectiveTab === "vault" && (
        <VaultPanel clientId={client.id} entries={client.vaultEntries} />
      )}

      {effectiveTab === "portal" && (
        <div className="rounded-xl border border-border-bright bg-surface-raised p-6 max-w-lg space-y-4">
          <SectionGuide guideId="portal.tab" />
          {client.portalUser ? (
            <p className="text-sm text-muted">
              Portal user: <span className="text-foreground">{client.portalUser.email}</span>
            </p>
          ) : (
            <p className="text-sm text-muted">No portal account yet.</p>
          )}
          <ClientPortalInviteForm clientId={client.id} />
        </div>
      )}
    </div>
  );
}
