import type { DiscoveryCall } from "@prisma/client";
import { upsertDiscoveryCall } from "@/lib/actions/leads";
import { FIT_DECISIONS } from "@/lib/constants/leads";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

interface DiscoveryCallFormProps {
  leadId: string;
  discoveryCall: DiscoveryCall | null;
}

function toDatetimeLocal(date: Date | null | undefined) {
  if (!date) return "";
  const d = new Date(date);
  const offset = d.getTimezoneOffset();
  const local = new Date(d.getTime() - offset * 60000);
  return local.toISOString().slice(0, 16);
}

export function DiscoveryCallForm({ leadId, discoveryCall }: DiscoveryCallFormProps) {
  return (
    <form action={upsertDiscoveryCall} className="space-y-4">
      <input type="hidden" name="leadId" value={leadId} />

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label htmlFor="scheduledAt" className="text-xs font-medium text-muted">
            Scheduled at
          </label>
          <Input
            id="scheduledAt"
            name="scheduledAt"
            type="datetime-local"
            defaultValue={toDatetimeLocal(discoveryCall?.scheduledAt)}
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="completedAt" className="text-xs font-medium text-muted">
            Completed at
          </label>
          <Input
            id="completedAt"
            name="completedAt"
            type="datetime-local"
            defaultValue={toDatetimeLocal(discoveryCall?.completedAt)}
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="fitDecision" className="text-xs font-medium text-muted">
            Fit decision
          </label>
          <select
            id="fitDecision"
            name="fitDecision"
            defaultValue={discoveryCall?.fitDecision ?? ""}
            className="flex h-9 w-full rounded-md border border-border bg-background px-3 text-sm"
          >
            <option value="">Not decided</option>
            {FIT_DECISIONS.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {[
          { name: "hasGBP", label: "Has GBP", checked: discoveryCall?.hasGBP },
          { name: "hasDomainAccess", label: "Has domain access", checked: discoveryCall?.hasDomainAccess },
          { name: "hasAnalyticsAccess", label: "Has analytics access", checked: discoveryCall?.hasAnalyticsAccess },
          { name: "hasAdsAccount", label: "Has ads account", checked: discoveryCall?.hasAdsAccount },
          { name: "decisionMaker", label: "Decision maker present", checked: discoveryCall?.decisionMaker },
        ].map(({ name, label, checked }) => (
          <label key={name} className="flex items-center gap-2 text-sm">
            <Checkbox name={name} defaultChecked={!!checked} />
            {label}
          </label>
        ))}
      </div>

      <div className="space-y-1.5">
        <label htmlFor="summary" className="text-xs font-medium text-muted">
          Summary
        </label>
        <Textarea id="summary" name="summary" rows={2} defaultValue={discoveryCall?.summary ?? ""} />
      </div>
      <div className="space-y-1.5">
        <label htmlFor="painPoints" className="text-xs font-medium text-muted">
          Pain points
        </label>
        <Textarea id="painPoints" name="painPoints" rows={2} defaultValue={discoveryCall?.painPoints ?? ""} />
      </div>
      <div className="space-y-1.5">
        <label htmlFor="notes" className="text-xs font-medium text-muted">
          Notes
        </label>
        <Textarea id="notes" name="notes" rows={3} defaultValue={discoveryCall?.notes ?? ""} />
      </div>

      <Button type="submit" variant="outline">
        Save discovery call
      </Button>
    </form>
  );
}
