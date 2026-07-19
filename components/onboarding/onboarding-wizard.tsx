"use client";

import { useMemo, useRef, useState } from "react";
import {
  advanceOnboardingAccess,
  advanceOnboardingAgreement,
  advanceOnboardingPackages,
  advanceOnboardingProfile,
} from "@/lib/actions/onboarding";
import type { AccessHandoffItem, AccessHandoffMode } from "@/lib/onboarding/stages";
import {
  CLIENT_VISIBLE_STAGES,
  STAGE_LABELS,
} from "@/lib/onboarding/stages";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { formatCurrency } from "@/lib/format";
import type { OnboardingStage } from "@prisma/client";

type QuestionField = {
  id: string;
  type: string;
  label: string;
  required?: boolean;
  options?: { value: string; label: string }[];
  placeholder?: string;
};

type PackageCard = {
  id: string;
  name: string;
  category: string;
  priceMin: number;
  priceMax: number;
  unit: "monthly" | "flat";
  scopeIncluded: string;
};

type ProposalView = {
  id: string;
  status: string;
  scopeIncluded: string | null;
  lineItems: { id: string; description: string; total: number }[];
  retainerTerms: unknown;
};

type AccessView = {
  id: string;
  label: string;
  systemType: string;
  status: string;
};

export type OnboardingWizardProps = {
  token: string;
  contactName: string;
  businessName: string;
  initialStage: OnboardingStage;
  fields: QuestionField[];
  packages: PackageCard[];
  proposal: ProposalView | null;
  agreementTerms: string | null;
  agencyEmail: string | null;
  accessItems: AccessView[];
  encryptionReady: boolean;
  initialResponses: Record<string, unknown>;
  initialSelectedPackages: string[];
};

function StageStepper({ current }: { current: OnboardingStage }) {
  const idx = CLIENT_VISIBLE_STAGES.indexOf(current);
  return (
    <ol className="mb-8 flex flex-wrap gap-2">
      {CLIENT_VISIBLE_STAGES.map((stage, i) => {
        const done = idx > i || current === "COMPLETED";
        const active = stage === current;
        return (
          <li
            key={stage}
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              active
                ? "bg-foreground text-background"
                : done
                  ? "bg-emerald-500/15 text-emerald-700"
                  : "bg-muted/40 text-muted"
            }`}
          >
            {i + 1}. {STAGE_LABELS[stage]}
          </li>
        );
      })}
    </ol>
  );
}

function priceLabel(pkg: PackageCard) {
  const range =
    pkg.priceMin === pkg.priceMax
      ? formatCurrency(pkg.priceMin)
      : `${formatCurrency(pkg.priceMin)}–${formatCurrency(pkg.priceMax)}`;
  return pkg.unit === "monthly" ? `${range}/mo` : range;
}

export function OnboardingWizard(props: OnboardingWizardProps) {
  const [stage, setStage] = useState<OnboardingStage>(
    props.initialStage === "COMPLETED" ? "COMPLETED" : props.initialStage
  );
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [selectedPackages, setSelectedPackages] = useState<string[]>(
    props.initialSelectedPackages
  );
  const proposal = props.proposal;
  const accessItems = props.accessItems;
  const [handoffs, setHandoffs] = useState<
    Record<string, { mode: AccessHandoffMode; inviteNotes: string; url: string; username: string; password: string; notes: string }>
  >(() => {
    const init: Record<
      string,
      {
        mode: AccessHandoffMode;
        inviteNotes: string;
        url: string;
        username: string;
        password: string;
        notes: string;
      }
    > = {};
    for (const item of props.accessItems) {
      init[item.id] = {
        mode: "invite",
        inviteNotes: "",
        url: "",
        username: "",
        password: "",
        notes: "",
      };
    }
    return init;
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [drawing, setDrawing] = useState(false);

  const total = useMemo(
    () => proposal?.lineItems.reduce((s, i) => s + i.total, 0) ?? 0,
    [proposal]
  );

  if (stage === "COMPLETED") {
    return (
      <div className="rounded-xl border border-border bg-background p-8 text-center">
        <h2 className="text-xl font-semibold">You&apos;re all set, {props.contactName}!</h2>
        <p className="mt-3 text-sm text-muted">
          We have your profile, signed agreement, and access notes. Our team will
          verify everything and reach out about next steps for {props.businessName}.
        </p>
      </div>
    );
  }

  async function submitProfile(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError(null);
    const form = e.currentTarget;
    const formData = new FormData(form);
    const responses: Record<string, unknown> = { ...props.initialResponses };

    for (const field of props.fields) {
      if (field.type === "checkboxes") {
        responses[field.id] = formData.getAll(field.id).map(String);
      } else {
        const val = formData.get(field.id);
        if (val != null && val !== "") responses[field.id] = String(val);
      }
    }

    const result = await advanceOnboardingProfile(props.token, responses);
    setPending(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    setStage(result.nextStage ?? "PACKAGES");
  }

  async function submitPackages() {
    setPending(true);
    setError(null);
    const result = await advanceOnboardingPackages(props.token, selectedPackages);
    setPending(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    // Refresh proposal from server via full page for agreement accuracy
    window.location.reload();
  }

  function startDraw(e: React.MouseEvent | React.TouchEvent) {
    setDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = "touches" in e ? e.touches[0]!.clientX - rect.left : e.clientX - rect.left;
    const y = "touches" in e ? e.touches[0]!.clientY - rect.top : e.clientY - rect.top;
    ctx.beginPath();
    ctx.moveTo(x, y);
  }

  function draw(e: React.MouseEvent | React.TouchEvent) {
    if (!drawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = "touches" in e ? e.touches[0]!.clientX - rect.left : e.clientX - rect.left;
    const y = "touches" in e ? e.touches[0]!.clientY - rect.top : e.clientY - rect.top;
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#000";
    ctx.lineTo(x, y);
    ctx.stroke();
  }

  function clearSig() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.getContext("2d")?.clearRect(0, 0, canvas.width, canvas.height);
  }

  async function submitAgreement() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setPending(true);
    setError(null);
    const result = await advanceOnboardingAgreement(
      props.token,
      canvas.toDataURL("image/png")
    );
    setPending(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    window.location.reload();
  }

  async function submitAccess() {
    setPending(true);
    setError(null);
    const items: AccessHandoffItem[] = accessItems.map((a) => {
      const h = handoffs[a.id] ?? {
        mode: "invite" as const,
        inviteNotes: "",
        url: "",
        username: "",
        password: "",
        notes: "",
      };
      return {
        accessItemId: a.id,
        mode: h.mode,
        inviteNotes: h.inviteNotes,
        url: h.url,
        username: h.username,
        password: h.password,
        notes: h.notes,
      };
    });
    const result = await advanceOnboardingAccess(props.token, items);
    setPending(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    setStage("COMPLETED");
  }

  function togglePackage(id: string) {
    setSelectedPackages((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  function updateHandoff(
    id: string,
    patch: Partial<(typeof handoffs)[string]>
  ) {
    setHandoffs((prev) => ({
      ...prev,
      [id]: { ...prev[id]!, ...patch },
    }));
  }

  return (
    <div className="rounded-xl border border-border bg-background p-6">
      <StageStepper current={stage} />

      {stage === "PROFILE" && (
        <form onSubmit={submitProfile} className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold">Your business profile</h2>
            <p className="text-sm text-muted mt-1">
              Contacts, location, website, socials, and goals so we can start work.
            </p>
          </div>
          {props.fields.map((field) => {
            const initial = props.initialResponses[field.id];
            const defaultVal =
              initial == null || Array.isArray(initial) ? "" : String(initial);
            return (
              <div key={field.id} className="space-y-2">
                <label htmlFor={field.id} className="text-sm font-medium">
                  {field.label}
                  {field.required && <span className="text-danger"> *</span>}
                </label>
                {field.type === "text" && (
                  <Input
                    id={field.id}
                    name={field.id}
                    required={field.required}
                    placeholder={field.placeholder}
                    defaultValue={
                      field.id === "primaryContactName" && !defaultVal
                        ? props.contactName
                        : defaultVal
                    }
                  />
                )}
                {field.type === "textarea" && (
                  <Textarea
                    id={field.id}
                    name={field.id}
                    required={field.required}
                    rows={3}
                    placeholder={field.placeholder}
                    defaultValue={defaultVal}
                  />
                )}
                {field.type === "checkboxes" && field.options && (
                  <div className="flex flex-wrap gap-4">
                    {field.options.map((opt) => (
                      <label key={opt.value} className="flex items-center gap-2 text-sm">
                        <Checkbox
                          name={field.id}
                          value={opt.value}
                          defaultChecked={
                            Array.isArray(initial) &&
                            initial.map(String).includes(opt.value)
                          }
                        />
                        {opt.label}
                      </label>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
          {error && <p className="text-sm text-danger">{error}</p>}
          <Button type="submit" disabled={pending}>
            {pending ? "Saving..." : "Continue to packages"}
          </Button>
        </form>
      )}

      {stage === "PACKAGES" && (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold">Choose your services</h2>
            <p className="text-sm text-muted mt-1">
              Select one or more packages. You&apos;ll review pricing and sign next.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {props.packages.map((pkg) => {
              const selected = selectedPackages.includes(pkg.id);
              return (
                <button
                  key={pkg.id}
                  type="button"
                  onClick={() => togglePackage(pkg.id)}
                  className={`rounded-xl border p-4 text-left transition ${
                    selected
                      ? "border-foreground bg-foreground/5"
                      : "border-border hover:border-foreground/40"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-muted">
                        {pkg.category}
                      </p>
                      <p className="font-semibold mt-0.5">{pkg.name}</p>
                    </div>
                    <span className="text-sm font-medium whitespace-nowrap">
                      {priceLabel(pkg)}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-muted">{pkg.scopeIncluded}</p>
                  <p className="mt-3 text-xs font-medium">
                    {selected ? "Selected" : "Tap to select"}
                  </p>
                </button>
              );
            })}
          </div>
          {error && <p className="text-sm text-danger">{error}</p>}
          <Button
            type="button"
            disabled={pending || selectedPackages.length === 0}
            onClick={submitPackages}
          >
            {pending ? "Creating proposal..." : "Continue to agreement"}
          </Button>
        </div>
      )}

      {stage === "AGREEMENT" && (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold">Review & sign</h2>
            <p className="text-sm text-muted mt-1">
              Confirm scope and terms for {props.businessName}, then sign below.
            </p>
          </div>
          {proposal?.scopeIncluded && (
            <div className="rounded-lg border border-border p-4 text-sm whitespace-pre-wrap">
              {proposal.scopeIncluded}
            </div>
          )}
          {proposal && (
            <ul className="text-sm space-y-1">
              {proposal.lineItems.map((item) => (
                <li key={item.id} className="flex justify-between gap-4">
                  <span>{item.description}</span>
                  <span>{formatCurrency(item.total)}</span>
                </li>
              ))}
              <li className="flex justify-between font-medium border-t pt-2">
                <span>Total (selected line items)</span>
                <span>{formatCurrency(total)}</span>
              </li>
            </ul>
          )}
          {props.agreementTerms && (
            <div className="max-h-48 overflow-y-auto rounded-lg border border-border bg-muted/20 p-4 text-xs whitespace-pre-wrap text-muted">
              {props.agreementTerms}
            </div>
          )}
          <div className="space-y-3">
            <p className="text-sm text-muted">
              Sign below to accept this proposal
              {props.agencyEmail ? ` with ${props.agencyEmail}` : ""}.
            </p>
            <canvas
              ref={canvasRef}
              width={400}
              height={150}
              className="border border-border rounded-lg bg-white w-full touch-none cursor-crosshair"
              onMouseDown={startDraw}
              onMouseMove={draw}
              onMouseUp={() => setDrawing(false)}
              onMouseLeave={() => setDrawing(false)}
              onTouchStart={startDraw}
              onTouchMove={draw}
              onTouchEnd={() => setDrawing(false)}
            />
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={clearSig}>
                Clear
              </Button>
              <Button type="button" disabled={pending} onClick={submitAgreement}>
                {pending ? "Signing..." : "Sign & continue"}
              </Button>
            </div>
          </div>
          {error && <p className="text-sm text-danger">{error}</p>}
        </div>
      )}

      {stage === "ACCESS" && (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold">Share access</h2>
            <p className="text-sm text-muted mt-1">
              Prefer inviting our email
              {props.agencyEmail ? (
                <>
                  {" "}
                  (<span className="font-medium text-foreground">{props.agencyEmail}</span>)
                </>
              ) : null}{" "}
              where possible. Passwords are encrypted and never emailed.
            </p>
            {!props.encryptionReady && (
              <p className="mt-2 text-xs text-amber-700 bg-amber-500/10 rounded-md p-2">
                Credential storage is not configured on the agency side. Use
                &ldquo;Shared invite&rdquo; or &ldquo;N/A&rdquo; for now.
              </p>
            )}
          </div>
          {accessItems.length === 0 && (
            <p className="text-sm text-muted">
              No access items yet — continue to finish onboarding.
            </p>
          )}
          <div className="space-y-4">
            {accessItems.map((item) => {
              const h = handoffs[item.id];
              if (!h) return null;
              return (
                <div
                  key={item.id}
                  className="rounded-lg border border-border p-4 space-y-3"
                >
                  <p className="text-sm font-medium">{item.label}</p>
                  <div className="flex flex-wrap gap-3 text-sm">
                    {(
                      [
                        ["invite", "Shared invite"],
                        ["credentials", "Credentials"],
                        ["na", "N/A"],
                      ] as const
                    ).map(([mode, label]) => (
                      <label key={mode} className="flex items-center gap-1.5">
                        <input
                          type="radio"
                          name={`mode-${item.id}`}
                          checked={h.mode === mode}
                          onChange={() => updateHandoff(item.id, { mode })}
                          disabled={mode === "credentials" && !props.encryptionReady}
                        />
                        {label}
                      </label>
                    ))}
                  </div>
                  {h.mode === "invite" && (
                    <Input
                      placeholder="e.g. Invited agency@… as Editor in GA4"
                      value={h.inviteNotes}
                      onChange={(e) =>
                        updateHandoff(item.id, { inviteNotes: e.target.value })
                      }
                    />
                  )}
                  {h.mode === "credentials" && (
                    <div className="grid gap-2 sm:grid-cols-2">
                      <Input
                        placeholder="URL"
                        value={h.url}
                        onChange={(e) =>
                          updateHandoff(item.id, { url: e.target.value })
                        }
                      />
                      <Input
                        placeholder="Username / email"
                        value={h.username}
                        onChange={(e) =>
                          updateHandoff(item.id, { username: e.target.value })
                        }
                      />
                      <Input
                        type="password"
                        placeholder="Password"
                        value={h.password}
                        onChange={(e) =>
                          updateHandoff(item.id, { password: e.target.value })
                        }
                      />
                      <Input
                        placeholder="Notes (optional)"
                        value={h.notes}
                        onChange={(e) =>
                          updateHandoff(item.id, { notes: e.target.value })
                        }
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          {error && <p className="text-sm text-danger">{error}</p>}
          <Button type="button" disabled={pending} onClick={submitAccess}>
            {pending ? "Submitting..." : "Finish onboarding"}
          </Button>
        </div>
      )}
    </div>
  );
}
