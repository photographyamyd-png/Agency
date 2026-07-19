import type { ClientWorkspaceData } from "@/lib/data/client-workspace";
import { BASELINE_AUDIT_ITEMS, emptyBaselineAudit } from "./phase-1-intake";
import { baselineAuditDataSchema } from "@/lib/validation/blueprint";
import type { BlueprintPhaseId } from "./phases";

export function computePhaseProgress(client: ClientWorkspaceData): Record<BlueprintPhaseId, number> {
  const auditRaw = client.baselineAudits[0]?.dataJson;
  const auditParsed = baselineAuditDataSchema.safeParse(auditRaw ?? emptyBaselineAudit());
  const audit = auditParsed.success ? auditParsed.data : emptyBaselineAudit();
  const auditDone = Object.values(audit).filter((v) => v.status === "done" || v.status === "na").length;
  const auditPct = Math.round((auditDone / BASELINE_AUDIT_ITEMS.length) * 100);

  const intel = client.brandProfile?.businessIntelJson as Record<string, string> | null;
  const intelFilled = intel ? Object.values(intel).filter(Boolean).length : 0;
  const discoveryPct = Math.min(100, Math.round(auditPct * 0.7 + Math.min(intelFilled, 10) * 3));

  const competitorsPct = Math.min(100, Math.round((client.competitors.length / 3) * 100));
  const geoPct = client.geoGridSnapshots.length > 0 ? 100 : 0;
  const competitivePct = Math.round((competitorsPct + geoPct) / 2);

  const keywordsWithIntent = client.keywords.filter((k) => k.intent).length;
  const keywordsPct = client.keywords.length
    ? Math.round((keywordsWithIntent / client.keywords.length) * 100)
    : 0;

  const allPages = client.pages.flatMap((p) => [p, ...p.children]);
  const pagesLive = allPages.filter((p) => p.status === "LIVE").length;
  const architecturePct = allPages.length ? Math.round((allPages.length > 0 ? 50 : 0) + (pagesLive / allPages.length) * 50) : 0;

  const techPct = client.techHealthLogs.length > 0 ? 80 : 0;
  const technicalPct = Math.round((architecturePct + techPct) / 2);

  const seoDone = allPages.reduce(
    (sum, p) => sum + p.seoItems.filter((i) => i.status === "DONE").length,
    0
  );
  const seoTotal = allPages.reduce((sum, p) => sum + p.seoItems.length, 0);
  const onpagePct = seoTotal ? Math.round((seoDone / seoTotal) * 100) : 0;

  const gbpPct = client.brandProfile?.gbpConnected ? 60 : 0;
  const gbpPostsPct = Math.min(100, client.gbpActivity.length * 10);
  const gbpFinal = Math.round((gbpPct + gbpPostsPct) / 2);

  const citationsLive = client.citations.filter((c) => c.status === "LIVE").length;
  const citationsPct = client.citations.length
    ? Math.round((citationsLive / client.citations.length) * 100)
    : 0;

  const goldenLocked = (client.brandProfile?.goldenNapJson as { locked?: boolean } | null)?.locked;
  const citationsFinal = goldenLocked ? citationsPct : Math.min(citationsPct, 50);

  const reviewTargets = client.brandProfile?.reviewTargetsJson;
  const reviewsPct = reviewTargets ? 70 : 20;

  const linksAcquired = client.localLinks.filter((l) => l.status === "ACQUIRED").length;
  const linksPct = Math.min(100, linksAcquired * 25);

  const integrationsConnected = client.integrations.filter((i) => i.status === "CONNECTED").length;
  const trackingPct = Math.min(100, integrationsConnected * 33);

  const maintDone = client.maintenanceLogs[0]?.items.filter((i) => i.status === "DONE").length ?? 0;
  const maintTotal = client.maintenanceLogs[0]?.items.length ?? 1;
  const monthlyPct = Math.round((maintDone / maintTotal) * 100);

  return {
    discovery: discoveryPct,
    competitive: competitivePct,
    keywords: keywordsPct,
    architecture: architecturePct,
    technical: technicalPct,
    onpage: onpagePct,
    gbp: gbpFinal,
    citations: citationsFinal,
    reviews: reviewsPct,
    links: linksPct,
    tracking: trackingPct,
    monthly_ops: monthlyPct,
  };
}
