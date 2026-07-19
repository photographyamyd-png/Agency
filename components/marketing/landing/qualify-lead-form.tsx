"use client";

import { useActionState } from "react";
import { submitWebsiteLead } from "@/lib/actions/marketing";
import { Input } from "@/components/ui/input";
import { ArrowRight } from "lucide-react";
import { MARKETING_COPY } from "@/lib/agency/marketing-copy";
import { cn } from "@/lib/utils";

/** Compact mid-funnel form — qualifies by monthly revenue */
export function QualifyLeadForm({ className }: { className?: string }) {
  const [state, action, pending] = useActionState(submitWebsiteLead, null);

  return (
    <form
      action={action}
      className={cn(
        "space-y-4 rounded-xl border border-[var(--mkt-border)] bg-white p-6 shadow-lg sm:p-8",
        className
      )}
    >
      <input type="hidden" name="formVariant" value="qualify" />
      <input type="hidden" name="interestedIn" value="INTRO_CALL" />

      <p className="text-sm font-semibold text-[var(--mkt-text)]">
        {MARKETING_COPY.strategy.formTitle}
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5 sm:col-span-2">
          <label htmlFor="qualify-contactName" className="text-xs text-[var(--mkt-muted)]">
            First &amp; last name
          </label>
          <Input
            id="qualify-contactName"
            name="contactName"
            required
            placeholder="Jane Smith"
            className="border-[var(--mkt-border)]"
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="qualify-email" className="text-xs text-[var(--mkt-muted)]">
            Email
          </label>
          <Input
            id="qualify-email"
            name="email"
            type="email"
            required
            placeholder="you@business.com"
            className="border-[var(--mkt-border)]"
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="qualify-businessName" className="text-xs text-[var(--mkt-muted)]">
            Company
          </label>
          <Input
            id="qualify-businessName"
            name="businessName"
            required
            placeholder="Joe's Plumbing"
            className="border-[var(--mkt-border)]"
          />
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <label htmlFor="qualify-budgetRange" className="text-xs text-[var(--mkt-muted)]">
            Monthly revenue
          </label>
          <select
            id="qualify-budgetRange"
            name="budgetRange"
            required
            defaultValue=""
            className="flex h-10 w-full rounded-md border border-[var(--mkt-border)] bg-white px-3 text-sm text-[var(--mkt-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--mkt-accent)]"
          >
            <option value="" disabled>
              Monthly revenue*
            </option>
            {MARKETING_COPY.revenueBands.map((band) => (
              <option key={band.value} value={band.label}>
                {band.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {state?.error && <p className="text-sm text-danger">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="mkt-btn-accent mt-2 h-12 w-full disabled:opacity-60"
      >
        {pending ? "Sending..." : MARKETING_COPY.ctaPrimary}
        {!pending && (
          <span className="mkt-btn-accent-icon">
            <ArrowRight className="h-3.5 w-3.5" />
          </span>
        )}
      </button>
      <p className="text-xs text-[var(--mkt-muted)]">{MARKETING_COPY.strategy.privacy}</p>
    </form>
  );
}
