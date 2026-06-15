"use client";

import { useActionState } from "react";
import { submitWebsiteLead } from "@/lib/actions/marketing";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

const SERVICE_OPTIONS = [
  { value: "WEBSITE", label: "New website" },
  { value: "SEO_RETAINER", label: "Local SEO retainer" },
  { value: "BOTH", label: "Website + SEO" },
];

export function LeadCaptureForm() {
  const [state, action, pending] = useActionState(submitWebsiteLead, null);

  return (
    <form action={action} className="space-y-4 rounded-xl border border-border-bright bg-surface-raised p-6 shadow-lg shadow-black/30">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label htmlFor="businessName" className="text-sm font-medium">
            Business name
          </label>
          <Input id="businessName" name="businessName" required placeholder="Summit HVAC" />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="contactName" className="text-sm font-medium">
            Your name
          </label>
          <Input id="contactName" name="contactName" required placeholder="Jane Smith" />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <Input id="email" name="email" type="email" required placeholder="you@business.com" />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="phone" className="text-sm font-medium">
            Phone
          </label>
          <Input id="phone" name="phone" type="tel" placeholder="(555) 123-4567" />
        </div>
      </div>
      <div className="space-y-1.5">
        <label htmlFor="website" className="text-sm font-medium">
          Current website (optional)
        </label>
        <Input id="website" name="website" placeholder="https://example.com" />
      </div>
      <fieldset className="space-y-2">
        <legend className="text-sm font-medium">What do you need?</legend>
        <div className="flex flex-wrap gap-4">
          {SERVICE_OPTIONS.map(({ value, label }) => (
            <label key={value} className="flex items-center gap-2 text-sm">
              <Checkbox name="interestedIn" value={value} />
              {label}
            </label>
          ))}
        </div>
      </fieldset>
      <div className="space-y-1.5">
        <label htmlFor="problemSummary" className="text-sm font-medium">
          Tell us about your goals
        </label>
        <Textarea
          id="problemSummary"
          name="problemSummary"
          rows={4}
          placeholder="More calls from Google, redesign outdated site, rank for local keywords..."
        />
      </div>
      {state?.error && (
        <p className="text-sm text-danger">{state.error}</p>
      )}
      <Button type="submit" className="w-full sm:w-auto" disabled={pending}>
        {pending ? "Sending..." : "Get Started — Free Consultation"}
      </Button>
    </form>
  );
}
