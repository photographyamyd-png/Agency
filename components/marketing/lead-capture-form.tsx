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
    "border-zinc-200 bg-white text-[#0c0c12] placeholder:text-zinc-400",
    !isPanel && "border-border-bright bg-surface/60 text-foreground backdrop-blur-sm"
  );

  return (
    <form
      action={action}
      className={cn(
        "h-full",
        isPanel ? "rounded-xl bg-white p-8 lg:p-10" : "mkt-glass p-8 sm:p-10"
      )}
    >
      <div className="mb-8">
        <p className={cn("mkt-eyebrow", isPanel && "text-indigo-600")}>Free quote</p>
        <h3
          className={cn(
            "mt-3 font-display text-2xl font-bold tracking-tight",
            isPanel ? "text-[#0c0c12]" : "text-foreground"
          )}
        >
          Tell me about your business
        </h3>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Business name" htmlFor="businessName" light={isPanel}>
          <Input id="businessName" name="businessName" required placeholder="Joe's Plumbing" className={fieldClass} />
        </Field>
        <Field label="Your name" htmlFor="contactName" light={isPanel}>
          <Input id="contactName" name="contactName" required placeholder="Jane Smith" className={fieldClass} />
        </Field>
        <Field label="Email" htmlFor="email" light={isPanel}>
          <Input id="email" name="email" type="email" required placeholder="you@business.com" className={fieldClass} />
        </Field>
        <Field label="Phone" htmlFor="phone" light={isPanel}>
          <Input id="phone" name="phone" type="tel" placeholder="(555) 123-4567" className={fieldClass} />
        </Field>
      </div>

      <div className="mt-5">
        <Field label="Current website (optional)" htmlFor="website" light={isPanel}>
          <Input id="website" name="website" placeholder="https://example.com" className={fieldClass} />
        </Field>
      </div>

      <fieldset className="mt-6 space-y-3">
        <legend className={cn("text-sm", isPanel ? "text-zinc-500" : "text-muted")}>
          What do you need?
        </legend>
        <div className="flex flex-wrap gap-2">
          {SERVICE_OPTIONS.map(({ value, label }) => (
            <label
              key={value}
              className={cn(
                "flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm transition-colors has-[:checked]:border-indigo-500 has-[:checked]:bg-indigo-50 has-[:checked]:text-indigo-700",
                isPanel
                  ? "border-zinc-200 text-[#0c0c12]"
                  : "border-border-bright text-foreground has-[:checked]:bg-accent-muted has-[:checked]:text-accent-bright"
              )}
            >
              <Checkbox name="interestedIn" value={value} />
              {label}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="mt-6">
        <Field label="Your goals" htmlFor="problemSummary" light={isPanel}>
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
        className="mkt-btn-accent mt-8 h-12 w-full rounded-md sm:w-auto sm:px-8 disabled:opacity-60"
      >
        {pending ? "Sending..." : "Send my free trade business quote"}
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
  light,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
  light?: boolean;
}) {
  return (
    <div className="space-y-2">
      <label htmlFor={htmlFor} className={cn("text-sm", light ? "text-zinc-500" : "text-muted")}>
        {label}
      </label>
      {children}
    </div>
  );
}
