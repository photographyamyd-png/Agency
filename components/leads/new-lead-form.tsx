import { createLead } from "@/lib/actions/leads";
import { INTERESTED_IN_OPTIONS } from "@/lib/constants/leads";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

export function NewLeadForm() {
  return (
    <form action={createLead} className="space-y-6 max-w-2xl">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label htmlFor="businessName" className="text-xs font-medium text-muted">
            Business name *
          </label>
          <Input id="businessName" name="businessName" required />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="contactName" className="text-xs font-medium text-muted">
            Contact name *
          </label>
          <Input id="contactName" name="contactName" required />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="email" className="text-xs font-medium text-muted">
            Email *
          </label>
          <Input id="email" name="email" type="email" required />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="phone" className="text-xs font-medium text-muted">
            Phone
          </label>
          <Input id="phone" name="phone" type="tel" />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="website" className="text-xs font-medium text-muted">
            Website
          </label>
          <Input id="website" name="website" type="url" placeholder="https://" />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="source" className="text-xs font-medium text-muted">
            Source
          </label>
          <Input id="source" name="source" placeholder="Referral, phone, etc." />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="location" className="text-xs font-medium text-muted">
            Location
          </label>
          <Input id="location" name="location" />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="serviceArea" className="text-xs font-medium text-muted">
            Service area
          </label>
          <Input id="serviceArea" name="serviceArea" />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="industry" className="text-xs font-medium text-muted">
            Industry
          </label>
          <Input id="industry" name="industry" />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="budgetRange" className="text-xs font-medium text-muted">
            Budget range
          </label>
          <Input id="budgetRange" name="budgetRange" />
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-medium text-muted">Interested in</p>
        <div className="flex flex-wrap gap-4">
          {INTERESTED_IN_OPTIONS.map(({ value, label }) => (
            <label key={value} className="flex items-center gap-2 text-sm">
              <Checkbox name="interestedIn" value={value} />
              {label}
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="problemSummary" className="text-xs font-medium text-muted">
          Problem summary
        </label>
        <Textarea id="problemSummary" name="problemSummary" rows={3} />
      </div>

      <Button type="submit">Create lead</Button>
    </form>
  );
}
