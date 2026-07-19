import type { OnboardingStage } from "@prisma/client";
import { PRICING_PACKAGES } from "@/lib/blueprint/pricing-packages";

export const ONBOARDING_STAGES: OnboardingStage[] = [
  "PROFILE",
  "PACKAGES",
  "AGREEMENT",
  "ACCESS",
  "COMPLETED",
];

export const STAGE_LABELS: Record<OnboardingStage, string> = {
  PROFILE: "Profile & contacts",
  PACKAGES: "Choose packages",
  AGREEMENT: "Review & sign",
  ACCESS: "Share access",
  COMPLETED: "Complete",
};

export const CLIENT_VISIBLE_STAGES: OnboardingStage[] = [
  "PROFILE",
  "PACKAGES",
  "AGREEMENT",
  "ACCESS",
];

/** Core access systems always requested after profile (rules may add more). */
export const CORE_ACCESS_REQUESTS: {
  systemType:
    | "CMS_ADMIN"
    | "HOSTING"
    | "DOMAIN_REGISTRAR"
    | "DNS"
    | "GA4"
    | "SEARCH_CONSOLE"
    | "GBP"
    | "SOCIAL";
  label: string;
}[] = [
  { systemType: "CMS_ADMIN", label: "Website CMS admin access" },
  { systemType: "HOSTING", label: "Hosting control panel access" },
  { systemType: "DOMAIN_REGISTRAR", label: "Domain registrar access" },
  { systemType: "DNS", label: "DNS management access" },
  { systemType: "GA4", label: "Google Analytics 4 access" },
  { systemType: "SEARCH_CONSOLE", label: "Google Search Console access" },
  { systemType: "GBP", label: "Google Business Profile manager access" },
  { systemType: "SOCIAL", label: "Social media page / business access" },
];

export function parseCompletedStages(raw: unknown): OnboardingStage[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter((s): s is OnboardingStage =>
    ONBOARDING_STAGES.includes(s as OnboardingStage)
  );
}

export function nextStage(current: OnboardingStage): OnboardingStage {
  const idx = ONBOARDING_STAGES.indexOf(current);
  if (idx < 0 || idx >= ONBOARDING_STAGES.length - 1) return "COMPLETED";
  return ONBOARDING_STAGES[idx + 1]!;
}

export function markStageComplete(
  completed: OnboardingStage[],
  stage: OnboardingStage
): OnboardingStage[] {
  if (completed.includes(stage)) return completed;
  return [...completed, stage];
}

/** Map selected package IDs to interestedIn values for onboarding rules. */
export function packagesToInterestedIn(packageIds: string[]): string[] {
  const tags = new Set<string>();
  for (const id of packageIds) {
    const pkg = PRICING_PACKAGES.find((p) => p.id === id);
    if (!pkg) continue;
    if (pkg.category === "Website" || pkg.unit === "flat") tags.add("WEBSITE");
    if (pkg.category === "SEO Retainer") tags.add("SEO_RETAINER");
    if (pkg.category === "Maintenance") tags.add("MAINTENANCE");
  }
  return [...tags];
}

export function clientStatusFromPackages(
  packageIds: string[]
): "ACTIVE_BUILD" | "ACTIVE_RETAINER" {
  const pkgs = packageIds
    .map((id) => PRICING_PACKAGES.find((p) => p.id === id))
    .filter(Boolean);
  const hasFlat = pkgs.some((p) => p!.unit === "flat");
  return hasFlat ? "ACTIVE_BUILD" : "ACTIVE_RETAINER";
}

export type ProfileAnswers = Record<string, unknown>;

export function validateProfileAnswers(answers: ProfileAnswers): string | null {
  const required = [
    "primaryContactName",
    "primaryContactPhone",
    "streetAddress",
    "city",
    "stateProvince",
    "postalCode",
    "industry",
    "goals",
  ];
  for (const key of required) {
    const v = answers[key];
    if (v == null || String(v).trim() === "") {
      return `Please fill in all required fields (${key} is missing)`;
    }
  }
  return null;
}

export function validatePackageSelection(packageIds: string[]): string | null {
  if (!packageIds.length) return "Select at least one package to continue";
  for (const id of packageIds) {
    if (!PRICING_PACKAGES.some((p) => p.id === id)) {
      return `Unknown package: ${id}`;
    }
  }
  return null;
}

export type AccessHandoffMode = "invite" | "credentials" | "na";

export type AccessHandoffItem = {
  accessItemId: string;
  mode: AccessHandoffMode;
  inviteNotes?: string;
  url?: string;
  username?: string;
  password?: string;
  notes?: string;
};

export function validateAccessHandoff(items: AccessHandoffItem[]): string | null {
  for (const item of items) {
    if (!item.accessItemId) return "Invalid access item";
    if (!["invite", "credentials", "na"].includes(item.mode)) {
      return "Invalid access mode";
    }
    if (item.mode === "credentials" && !item.password && !item.username) {
      return "Enter username and/or password for credential handoffs";
    }
    if (item.mode === "invite" && !(item.inviteNotes ?? "").trim()) {
      return "Add a short note for each shared-invite item (e.g. who you invited)";
    }
  }
  return null;
}
