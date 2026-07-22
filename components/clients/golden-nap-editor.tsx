import { saveGoldenNap } from "@/lib/actions/citations";
import { SectionGuide } from "@/components/clients/section-guide";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

interface GoldenNapEditorProps {
  clientId: string;
  goldenNap: Record<string, unknown> | null;
}

export function GoldenNapEditor({ clientId, goldenNap }: GoldenNapEditorProps) {
  const nap = goldenNap as {
    businessName?: string;
    streetAddress?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    phone?: string;
    websiteUrl?: string;
    hours?: string;
    shortDescription?: string;
    formatRules?: string;
    locked?: boolean;
  } | null;

  return (
    <form
      action={async (fd) => {
        "use server";
        await saveGoldenNap(clientId, {
          businessName: fd.get("businessName"),
          streetAddress: fd.get("streetAddress"),
          city: fd.get("city"),
          state: fd.get("state") || undefined,
          postalCode: fd.get("postalCode") || undefined,
          phone: fd.get("phone"),
          websiteUrl: fd.get("websiteUrl"),
          hours: fd.get("hours") || undefined,
          shortDescription: fd.get("shortDescription") || undefined,
          formatRules: fd.get("formatRules") || undefined,
          locked: fd.get("locked") === "on",
        });
      }}
      className="space-y-4"
    >
      <h3 className="text-sm font-medium">Golden Record NAP (§8.1)</h3>
      <SectionGuide guideId="citations.goldenNap" />
      <p className="text-xs text-muted">Lock this before submitting citations or schema. Format must be identical everywhere.</p>
      <div className="grid gap-3 sm:grid-cols-2">
        <Input name="businessName" placeholder="Business name (legal)" defaultValue={nap?.businessName ?? ""} required />
        <Input name="phone" placeholder="Phone (consistent format)" defaultValue={nap?.phone ?? ""} required />
        <Input name="streetAddress" placeholder="Street address" defaultValue={nap?.streetAddress ?? ""} required />
        <Input name="city" placeholder="City" defaultValue={nap?.city ?? ""} required />
        <Input name="state" placeholder="State/Province" defaultValue={nap?.state ?? ""} />
        <Input name="postalCode" placeholder="Postal code" defaultValue={nap?.postalCode ?? ""} />
        <Input name="websiteUrl" placeholder="https://www.domain.com" defaultValue={nap?.websiteUrl ?? ""} required className="sm:col-span-2" />
      </div>
      <Textarea name="hours" placeholder="Business hours" defaultValue={nap?.hours ?? ""} rows={2} />
      <Textarea name="shortDescription" placeholder="Short description (1-2 sentences for directories)" defaultValue={nap?.shortDescription ?? ""} rows={2} />
      <Textarea name="formatRules" placeholder="Format rules (e.g. always use St. not Street)" defaultValue={nap?.formatRules ?? ""} rows={2} />
      <label className="flex items-center gap-2 text-sm">
        <Checkbox name="locked" defaultChecked={nap?.locked} />
        Lock Golden Record (required before citations)
      </label>
      <Button type="submit" variant="outline">Save Golden Record</Button>
    </form>
  );
}
