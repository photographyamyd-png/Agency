"use client";

import { useActionState } from "react";
import { submitWebsiteLead } from "@/lib/actions/marketing";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const SERVICE_OPTIONS = [
  { value: "WEBSITE", label: "New website" },
  { value: "SEO_RETAINER", label: "Local SEO / Google Maps" },
  { value: "BOTH", label: "Website + SEO" },
];

export function LeadCaptureForm({ variant = "default" }: { variant?: "default" | "panel" }) {
  const [state, action, pending] = useActionState(submitWebsiteLead, null);
  const isPanel = variant === "panel";

  const fieldClass = cn(
    "rounded-sm border-[var(--mkt-border)] bg-white text-[var(--mkt-text)] placeholder:text-[var(--mkt-muted)]",
    isPanel && "border-white/20 bg-white/95"
  );

  return (
    <form
      action={action}
      className={cn(
        "h-full",
        isPanel
          ? "mkt-band-ink p-8 lg:rounded-l-lg lg:p-10"
          : "rounded-lg border border-[var(--mkt-border)] bg-white p-8 sm:p-10"
      )}
    >
      {!isPanel && (
        <div className="mb-8">
          <p className="mkt-eyebrow">Free quote</p>
          <h3 className="mt-3 font-display text-2xl font-bold uppercase tracking-tight">
            Tell us about your business
          </h3>
        </div>
      )}

      {isPanel && (
        <div className="mb-8">
          <p className="mkt-eyebrow mkt-eyebrow-light">Free quote</p>
          <h3 className="mt-3 font-display text-2xl font-bold uppercase tracking-tight text-[var(--mkt-on-dark)]">
            Tell us about your business
          </h3>
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Business name" htmlFor="businessName" dark={isPanel}>
          <Input id="businessName" name="businessName" required placeholder="Joe's Plumbing" className={fieldClass} />
        </Field>
        <Field label="Your name" htmlFor="contactName" dark={isPanel}>
          <Input id="contactName" name="contactName" required placeholder="Jane Smith" className={fieldClass} />
        </Field>
        <Field label="Email" htmlFor="email" dark={isPanel}>
          <Input id="email" name="email" type="email" required placeholder="you@business.com" className={fieldClass} />
        </Field>
        <Field label="Phone" htmlFor="phone" dark={isPanel}>
          <Input id="phone" name="phone" type="tel" placeholder="(555) 123-4567" className={fieldClass} />
        </Field>
      </div>

      <div className="mt-5">
        <Field label="Current website (optional)" htmlFor="website" dark={isPanel}>
          <Input id="website" name="website" placeholder="https://example.com" className={fieldClass} />
        </Field>
      </div>

      <fieldset className="mt-6 space-y-3">
        <legend className={cn("text-sm", isPanel ? "text-[var(--mkt-muted-on-dark)]" : "text-[var(--mkt-muted)]")}>
          What do you need?
        </legend>
        <div className="flex flex-wrap gap-2">
          {SERVICE_OPTIONS.map(({ value, label }) => (
            <label
              key={value}
              className={cn(
                "flex cursor-pointer items-center gap-2 rounded-sm border px-3 py-2 text-sm transition-colors has-[:checked]:border-[var(--mkt-accent)] has-[:checked]:bg-[var(--mkt-accent-soft)]",
                isPanel
                  ? "border-white/20 text-[var(--mkt-on-dark)] has-[:checked]:bg-[var(--mkt-accent)] has-[:checked]:text-white"
                  : "border-[var(--mkt-border)] text-[var(--mkt-text)]"
              )}
            >
              <Checkbox name="interestedIn" value={value} />
              {label}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="mt-6">
        <Field label="Your goals" htmlFor="problemSummary" dark={isPanel}>
          <Textarea
            id="problemSummary"
            name="problemSummary"
            rows={4}
            placeholder="More calls from Google, show up on Maps, new website for my HVAC company..."
            className={fieldClass}
          />
        </Field>
      </div>

      {state?.error && <p className="mt-4 text-sm text-red-400">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="mkt-btn-accent mt-8 h-12 w-full rounded-sm sm:w-auto sm:px-8 disabled:opacity-60"
      >
        {pending ? "Sending..." : "Get my free quote"}
        {!pending && (
          <span className="mkt-btn-accent-icon">
            <ArrowRight className="h-3.5 w-3.5" />
          </span>
        )}
      </button>
    </form>
  );
}

function Field({
  label,
  htmlFor,
  children,
  dark,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
  dark?: boolean;
}) {
  return (
    <div className="space-y-2">
      <label
        htmlFor={htmlFor}
        className={cn("text-sm", dark ? "text-[var(--mkt-muted-on-dark)]" : "text-[var(--mkt-muted)]")}
      >
        {label}
      </label>
      {children}
    </div>
  );
}
