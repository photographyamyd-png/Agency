import type { Lead } from "@prisma/client";
import { updateLead } from "@/lib/actions/leads";
import { asStringArray } from "@/lib/json";
import {
  INTERESTED_IN_OPTIONS,
  LEAD_STATUS_LABELS,
  LOSS_REASONS,
} from "@/lib/constants/leads";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

interface LeadEditFormProps {
  lead: Lead;
}

export function LeadEditForm({ lead }: LeadEditFormProps) {
  return (
    <form action={updateLead} className="space-y-6">
      <input type="hidden" name="id" value={lead.id} />

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label htmlFor="businessName" className="text-xs font-medium text-muted">
            Business name
          </label>
          <Input id="businessName" name="businessName" defaultValue={lead.businessName} required />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="contactName" className="text-xs font-medium text-muted">
            Contact name
          </label>
          <Input id="contactName" name="contactName" defaultValue={lead.contactName} required />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="email" className="text-xs font-medium text-muted">
            Email
          </label>
          <Input id="email" name="email" type="email" defaultValue={lead.email} required />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="phone" className="text-xs font-medium text-muted">
            Phone
          </label>
          <Input id="phone" name="phone" defaultValue={lead.phone ?? ""} />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="website" className="text-xs font-medium text-muted">
            Website
          </label>
          <Input id="website" name="website" defaultValue={lead.website ?? ""} />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="status" className="text-xs font-medium text-muted">
            Status
          </label>
          <select
            id="status"
            name="status"
            defaultValue={lead.status}
            className="flex h-9 w-full rounded-md border border-border bg-background px-3 text-sm"
          >
            {Object.entries(LEAD_STATUS_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <label htmlFor="lossReason" className="text-xs font-medium text-muted">
            Loss reason (required if status is Lost)
          </label>
          <select
            id="lossReason"
            name="lossReason"
            defaultValue={lead.lossReason ?? ""}
            className="flex h-9 w-full rounded-md border border-border bg-background px-3 text-sm"
          >
            <option value="">Select reason...</option>
            {LOSS_REASONS.map((reason) => (
              <option key={reason} value={reason}>
                {reason}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5">
          <label htmlFor="location" className="text-xs font-medium text-muted">
            Location
          </label>
          <Input id="location" name="location" defaultValue={lead.location ?? ""} />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="serviceArea" className="text-xs font-medium text-muted">
            Service area
          </label>
          <Input id="serviceArea" name="serviceArea" defaultValue={lead.serviceArea ?? ""} />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="industry" className="text-xs font-medium text-muted">
            Industry
          </label>
          <Input id="industry" name="industry" defaultValue={lead.industry ?? ""} />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="budgetRange" className="text-xs font-medium text-muted">
            Budget range
          </label>
          <Input id="budgetRange" name="budgetRange" defaultValue={lead.budgetRange ?? ""} />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="source" className="text-xs font-medium text-muted">
            Source
          </label>
          <Input id="source" name="source" defaultValue={lead.source ?? ""} />
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-medium text-muted">Interested in</p>
        <div className="flex flex-wrap gap-4">
          {INTERESTED_IN_OPTIONS.map(({ value, label }) => (
            <label key={value} className="flex items-center gap-2 text-sm">
              <Checkbox
                name="interestedIn"
                value={value}
                defaultChecked={asStringArray(lead.interestedIn).includes(value)}
              />
              {label}
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="problemSummary" className="text-xs font-medium text-muted">
          Problem summary
        </label>
        <Textarea
          id="problemSummary"
          name="problemSummary"
          rows={3}
          defaultValue={lead.problemSummary ?? ""}
        />
      </div>

      <Button type="submit">Save changes</Button>
    </form>
  );
}
