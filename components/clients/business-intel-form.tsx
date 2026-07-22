import { BUSINESS_INTEL_FIELDS } from "@/lib/blueprint/phase-1-intake";
import { saveBusinessIntel } from "@/lib/actions/baseline-audit";
import { SectionGuide } from "@/components/clients/section-guide";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface BusinessIntelFormProps {
  clientId: string;
  data: Record<string, string>;
}

export function BusinessIntelForm({ clientId, data }: BusinessIntelFormProps) {
  return (
    <form
      action={async (fd) => {
        "use server";
        const intel: Record<string, string> = {};
        for (const field of BUSINESS_INTEL_FIELDS) {
          intel[field.id] = (fd.get(field.id) as string) || "";
        }
        await saveBusinessIntel(clientId, intel);
      }}
      className="space-y-4"
    >
      <h3 className="text-sm font-medium">Business Intelligence Intake (§1.1)</h3>
      <SectionGuide guideId="intake.businessIntel" />
      {BUSINESS_INTEL_FIELDS.map((field) => (
        <div key={field.id} className="space-y-1.5">
          <label htmlFor={field.id} className="text-xs font-medium text-muted">
            {field.label}
          </label>
          <Textarea
            id={field.id}
            name={field.id}
            rows={2}
            defaultValue={data[field.id] ?? ""}
          />
        </div>
      ))}
      <Button type="submit" variant="outline">
        Save business intelligence
      </Button>
    </form>
  );
}
