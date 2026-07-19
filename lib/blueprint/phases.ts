export const BLUEPRINT_VERSION = "3.0";

export type BlueprintPhaseId =
  | "discovery"
  | "competitive"
  | "keywords"
  | "architecture"
  | "technical"
  | "onpage"
  | "gbp"
  | "citations"
  | "reviews"
  | "links"
  | "tracking"
  | "monthly_ops";

export interface BlueprintPhase {
  id: BlueprintPhaseId;
  number: number;
  name: string;
  timing: string;
  goal: string;
  tabId: string;
}

export const BLUEPRINT_PHASES: BlueprintPhase[] = [
  { id: "discovery", number: 1, name: "Discovery & Intake", timing: "Week 1", goal: "Lock down client data, access, and baseline", tabId: "intake" },
  { id: "competitive", number: 2, name: "Competitive Research", timing: "Week 1–2", goal: "Reverse-engineer top 3 competitors", tabId: "research" },
  { id: "keywords", number: 3, name: "Keyword & Intent Mapping", timing: "Week 2", goal: "Build full phrase universe by intent tier", tabId: "keywords" },
  { id: "architecture", number: 4, name: "Site Architecture & Planning", timing: "Week 2–3", goal: "Design page structure and URL hierarchy", tabId: "sitemap" },
  { id: "technical", number: 5, name: "Technical Build / Audit", timing: "Week 2–4", goal: "Implement or clean technical foundation", tabId: "sitemap" },
  { id: "onpage", number: 6, name: "On-Page SEO & Content", timing: "Week 3–6", goal: "Write, optimize, and publish all pages", tabId: "onpage" },
  { id: "gbp", number: 7, name: "GBP Optimization", timing: "Week 5–6", goal: "Claim, configure, and launch profile", tabId: "gbp" },
  { id: "citations", number: 8, name: "Citation & NAP Ecosystem", timing: "Week 5–6", goal: "Establish entity consistency everywhere", tabId: "citations" },
  { id: "reviews", number: 9, name: "Review Engine Launch", timing: "Week 6+", goal: "Activate review acquisition and response workflow", tabId: "reviews" },
  { id: "links", number: 10, name: "Link Acquisition", timing: "Month 2+", goal: "Build local and vertical authority", tabId: "links" },
  { id: "tracking", number: 11, name: "Tracking & Dashboards", timing: "Week 3 + ongoing", goal: "Connect every action to measurable outcomes", tabId: "reports" },
  { id: "monthly_ops", number: 12, name: "Monthly Operations", timing: "Ongoing", goal: "Optimize, report, and compound gains", tabId: "reports" },
];

export const CLIENT_WORKSPACE_TABS = [
  { id: "overview", label: "Overview", phases: [] },
  { id: "intake", label: "Intake & Baseline", phases: ["discovery"] },
  { id: "research", label: "Research", phases: ["competitive"] },
  { id: "keywords", label: "Keywords", phases: ["keywords"] },
  { id: "sitemap", label: "Site Map", phases: ["architecture", "technical"] },
  { id: "onpage", label: "On-Page SEO", phases: ["onpage"] },
  { id: "gbp", label: "GBP", phases: ["gbp"] },
  { id: "citations", label: "Citations", phases: ["citations"] },
  { id: "reviews", label: "Reviews", phases: ["reviews"] },
  { id: "links", label: "Links & GEO", phases: ["links"] },
  { id: "reports", label: "Reports & Ops", phases: ["tracking", "monthly_ops"] },
  { id: "vault", label: "Vault", phases: [] },
  { id: "portal", label: "Portal", phases: [] },
] as const;
