import Link from "next/link";
import {
  CLIENT_VISIBLE_STAGES,
  STAGE_LABELS,
  parseCompletedStages,
} from "@/lib/onboarding/stages";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SectionGuide } from "@/components/clients/section-guide";
import { formatCurrency } from "@/lib/format";
import type { OnboardingStage, OnboardingSessionStatus, ProposalStatus } from "@prisma/client";

/** Narrow props so this panel builds without the full client-workspace module. */
export type OnboardingProgressClient = {
  id: string;
  status: string;
  primaryContactName: string | null;
  primaryContactPhone: string | null;
  billingName: string | null;
  billingEmail: string | null;
  technicalContactName: string | null;
  technicalContactEmail: string | null;
  brandProfile: {
    existingSiteUrl: string | null;
    domain: string | null;
    currentHost: string | null;
    currentRegistrar: string | null;
    socialLinks: unknown;
  } | null;
  accessItems: {
    id: string;
    label: string;
    status: string;
  }[];
  vaultEntries: { id: string }[];
  onboardingSessions: {
    status: OnboardingSessionStatus;
    currentStage: OnboardingStage;
    completedStages: unknown;
    completedAt: Date | null;
  }[];
  proposals: {
    id: string;
    status: ProposalStatus;
    signedAt: Date | null;
    lineItems: { total: unknown }[];
  }[];
};

export function OnboardingProgressPanel({
  client,
}: {
  client: OnboardingProgressClient;
}) {
  const session = client.onboardingSessions[0];
  const signedProposal = client.proposals.find((p) => p.status === "SIGNED");
  const latestProposal = signedProposal ?? client.proposals[0];
  const missingAccess = client.accessItems.filter(
    (a) => a.status === "REQUESTED" || a.status === "NOT_REQUESTED"
  );
  const receivedAccess = client.accessItems.filter(
    (a) => a.status === "RECEIVED" || a.status === "TESTED"
  );
  const socials =
    (client.brandProfile?.socialLinks as Record<string, string> | null) ?? {};
  const socialCount = Object.keys(socials).filter((k) => socials[k]).length;

  const completed = session
    ? parseCompletedStages(session.completedStages)
    : [];
  const currentStage = session?.currentStage ?? null;

  return (
    <div className="rounded-xl border border-border-bright bg-surface-raised p-6 space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-semibold">Client onboarding</h3>
        <Badge variant="muted">{client.status}</Badge>
      </div>
      <SectionGuide guideId="intake.onboarding" />

      {!session ? (
        <p className="text-sm text-muted">
          No onboarding session linked yet. Send onboarding from the lead
          record when ready.
        </p>
      ) : (
        <div className="space-y-3">
          <ol className="flex flex-wrap gap-2">
            {CLIENT_VISIBLE_STAGES.map((stage) => {
              const done =
                completed.includes(stage) ||
                session.status === "COMPLETED" ||
                currentStage === "COMPLETED";
              const active = currentStage === stage;
              return (
                <li
                  key={stage}
                  className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    active
                      ? "bg-foreground text-background"
                      : done
                        ? "bg-emerald-500/15 text-emerald-700"
                        : "bg-muted/40 text-muted"
                  }`}
                >
                  {STAGE_LABELS[stage]}
                </li>
              );
            })}
          </ol>
          <p className="text-xs text-muted">
            Session {session.status.toLowerCase()}
            {session.completedAt
              ? ` · finished ${session.completedAt.toLocaleDateString()}`
              : ""}
          </p>
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2 text-sm">
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-wide text-muted">Contacts</p>
          <p>
            {client.primaryContactName ?? client.billingName ?? "—"}
            {client.primaryContactPhone
              ? ` · ${client.primaryContactPhone}`
              : ""}
          </p>
          <p className="text-muted">{client.billingEmail ?? "No billing email"}</p>
          {client.technicalContactEmail && (
            <p className="text-muted">
              Tech: {client.technicalContactName ?? client.technicalContactEmail}
            </p>
          )}
        </div>
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-wide text-muted">Web & social</p>
          <p>
            {client.brandProfile?.existingSiteUrl ??
              client.brandProfile?.domain ??
              "No site URL"}
          </p>
          <p className="text-muted">
            Host: {client.brandProfile?.currentHost ?? "—"} · Registrar:{" "}
            {client.brandProfile?.currentRegistrar ?? "—"}
          </p>
          <p className="text-muted">{socialCount} social link(s)</p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 text-sm">
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-wide text-muted">Agreement</p>
          {latestProposal ? (
            <>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant={latestProposal.status === "SIGNED" ? "success" : "muted"}>
                  {latestProposal.status}
                </Badge>
                {latestProposal.signedAt && (
                  <span className="text-muted">
                    {latestProposal.signedAt.toLocaleDateString()}
                  </span>
                )}
              </div>
              <p className="text-muted">
                {latestProposal.lineItems.length} line item(s) ·{" "}
                {formatCurrency(
                  latestProposal.lineItems.reduce(
                    (s, i) => s + Number(i.total),
                    0
                  )
                )}
              </p>
              <Button size="sm" variant="outline" asChild className="mt-1">
                <Link href={`/proposals/${latestProposal.id}`}>View proposal</Link>
              </Button>
            </>
          ) : (
            <p className="text-muted">No proposal yet</p>
          )}
        </div>
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-wide text-muted">Access & vault</p>
          <p>
            {receivedAccess.length} received · {missingAccess.length} outstanding
          </p>
          <p className="text-muted">
            {client.vaultEntries.length} encrypted credential(s)
          </p>
          {missingAccess.length > 0 && (
            <ul className="mt-1 text-xs text-amber-800 space-y-0.5">
              {missingAccess.slice(0, 5).map((a) => (
                <li key={a.id}>• {a.label}</li>
              ))}
              {missingAccess.length > 5 && (
                <li>…and {missingAccess.length - 5} more</li>
              )}
            </ul>
          )}
          <Button size="sm" variant="outline" asChild className="mt-1">
            <Link href={`/clients/${client.id}?tab=vault`}>Open vault</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
