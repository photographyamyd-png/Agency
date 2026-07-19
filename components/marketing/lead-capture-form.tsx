"use client";

import { useActionState } from "react";
import { submitWebsiteLead } from "@/lib/actions/marketing";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { MARKETING_COPY } from "@/lib/agency/marketing-copy";

const SERVICE_OPTIONS = [
  { value: "WEBSITE", label: "New website" },
  { value: "SEO_RETAINER", label: "Local SEO / Google Maps" },
  { value: "BOTH", label: "Website + SEO" },
];

export function LeadCaptureForm({ variant = "default" }: { variant?: "default" | "panel" }) {
  const [state, action, pending] = useActionState(submitWebsiteLead, null);
  const isPanel = variant === "panel";

  const fieldClass = cn(
    isPanel
      ? "border-white/15 bg-white/5 text-white placeholder:text-white/40"
      : "border-[var(--mkt-border)] bg-white text-[var(--mkt-text)] placeholder:text-[var(--mkt-muted)]"
  );

  return (
    <form
      action={action}
      className={cn("h-full", !isPanel && "mkt-float-card p-8 sm:p-10")}
    >
      {/* Parent contact section owns headings when panel */}
      {!isPanel && (
        <div className="mb-8">
          <p className="mkt-eyebrow">Free quote</p>
          <h3 className="mt-3 font-display text-2xl font-bold tracking-tight text-[var(--mkt-text)]">
            Tell me about your business
          </h3>
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Business name" htmlFor="businessName" panel={isPanel}>
          <Input
            id="businessName"
            name="businessName"
            required
            placeholder="Joe's Plumbing"
            className={fieldClass}
          />
        </Field>
        <Field label="Your name" htmlFor="contactName" panel={isPanel}>
          <Input
            id="contactName"
            name="contactName"
            required
            placeholder="Jane Smith"
            className={fieldClass}
          />
        </Field>
        <Field label="Email" htmlFor="email" panel={isPanel}>
          <Input
            id="email"
            name="email"
            type="email"
            required
            placeholder="you@business.com"
            className={fieldClass}
          />
        </Field>
        <Field label="Phone" htmlFor="phone" panel={isPanel}>
          <Input
            id="phone"
            name="phone"
            type="tel"
            placeholder="(555) 123-4567"
            className={fieldClass}
          />
        </Field>
      </div>

      <div className="mt-5">
        <Field label="Current website (optional)" htmlFor="website" panel={isPanel}>
          <Input
            id="website"
            name="website"
            placeholder="https://example.com"
            className={fieldClass}
          />
        </Field>
      </div>

      <div className="mt-5">
        <Field label="Monthly revenue" htmlFor="budgetRange" panel={isPanel}>
          <select
            id="budgetRange"
            name="budgetRange"
            defaultValue=""
            className={cn(
              "flex h-10 w-full rounded-md border px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--mkt-accent)]",
              fieldClass,
              isPanel && "border-white/15 bg-white/5 text-white"
            )}
          >
            <option value="" disabled>
              Select a range
            </option>
            {MARKETING_COPY.revenueBands.map((band) => (
              <option key={band.value} value={band.label}>
                {band.label}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <fieldset className="mt-6 space-y-3">
        <legend className={cn("text-sm", isPanel ? "text-white/50" : "text-[var(--mkt-muted)]")}>
          What do you need?
        </legend>
        <div className="flex flex-wrap gap-2">
          {SERVICE_OPTIONS.map(({ value, label }) => (
            <label
              key={value}
              className={cn(
                "flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm transition-colors has-[:checked]:border-[var(--mkt-accent)] has-[:checked]:bg-[var(--mkt-accent-soft)]",
                isPanel
                  ? "border-white/15 text-white has-[:checked]:text-[var(--mkt-accent-bright)]"
                  : "border-[var(--mkt-border)] text-[var(--mkt-text)] has-[:checked]:text-[var(--mkt-accent)]"
              )}
            >
              <Checkbox name="interestedIn" value={value} />
              {label}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="mt-6">
        <Field label="Your goals" htmlFor="problemSummary" panel={isPanel}>
          <Textarea
            id="problemSummary"
            name="problemSummary"
            rows={4}
            placeholder="More calls from Google, show up on Maps..."
            className={fieldClass}
          />
        </Field>
      </div>

      {state?.error && <p className="mt-4 text-sm text-danger">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="mkt-btn-accent mt-8 h-12 w-full sm:w-auto sm:px-8 disabled:opacity-60"
      >
        {pending ? "Sending..." : MARKETING_COPY.ctaPrimary}
        {!pending && (
          <span className="mkt-btn-accent-icon">
            <ArrowRight className="h-3.5 w-3.5" />
          </span>
        )}
      </button>
      <p className={cn("mt-3 text-xs", isPanel ? "text-white/45" : "text-[var(--mkt-muted)]")}>
        {MARKETING_COPY.ctaHint} — I&apos;ll tell you straight if I can help.
      </p>
    </form>
  );
}

function Field({
  label,
  htmlFor,
  children,
  panel,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
  panel?: boolean;
}) {
  return (
    <div className="space-y-2">
      <label
        htmlFor={htmlFor}
        className={cn("text-sm", panel ? "text-white/50" : "text-[var(--mkt-muted)]")}
      >
        {label}
      </label>
      {children}
    </div>
  );
}
