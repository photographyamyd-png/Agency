import Link from "next/link";
import { getAgencyProfileForSettings, updateAgencyProfile } from "@/lib/actions/settings";
import { parseResultsImages, parseServicesImages } from "@/lib/images/defaults";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

export default async function AgencySettingsPage() {
  const profile = await getAgencyProfileForSettings();
  const services = parseServicesImages(profile?.servicesImages);
  const results = parseResultsImages(profile?.resultsImages) ?? [];

  return (
    <DashboardShell
      title="Agency Profile"
      description="Marketing homepage content, images, and lead capture settings"
      actions={
        <Button variant="outline" size="sm" asChild>
          <Link href="/settings">Back to settings</Link>
        </Button>
      }
    >
      <form action={updateAgencyProfile} className="max-w-lg space-y-6">
        {profile && <input type="hidden" name="id" value={profile.id} />}

        <fieldset className="space-y-4">
          <legend className="text-sm font-semibold border-l-4 border-accent pl-3">
            Brand & copy
          </legend>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Business name</label>
            <Input name="businessName" defaultValue={profile?.businessName ?? ""} required />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Tagline</label>
            <Input name="tagline" defaultValue={profile?.tagline ?? ""} />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Hero headline</label>
            <Input name="heroHeadline" defaultValue={profile?.heroHeadline ?? ""} />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Hero subhead</label>
            <Textarea name="heroSubhead" rows={3} defaultValue={profile?.heroSubhead ?? ""} />
          </div>
        </fieldset>

        <fieldset className="space-y-4">
          <legend className="text-sm font-semibold border-l-4 border-accent pl-3">
            Images (paste URLs)
          </legend>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Logo URL</label>
            <Input name="logoUrl" defaultValue={profile?.logoUrl ?? ""} placeholder="https://..." />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Hero background image URL</label>
            <Input name="heroImageUrl" defaultValue={profile?.heroImageUrl ?? ""} placeholder="https://images.unsplash.com/..." />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Hero image alt text</label>
            <Input name="heroImageAlt" defaultValue={profile?.heroImageAlt ?? ""} />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Service card — Website</label>
            <Input name="servicesWebsite" defaultValue={services?.WEBSITE ?? ""} />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Service card — SEO</label>
            <Input name="servicesSeo" defaultValue={services?.SEO ?? ""} />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Service card — Reporting</label>
            <Input name="servicesReporting" defaultValue={services?.REPORTING ?? ""} />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Results screenshot 1</label>
            <Input name="resultsImage1" defaultValue={results[0] ?? ""} />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Results screenshot 2</label>
            <Input name="resultsImage2" defaultValue={results[1] ?? ""} />
          </div>
        </fieldset>

        <fieldset className="space-y-4">
          <legend className="text-sm font-semibold border-l-4 border-accent pl-3">
            Contact & leads
          </legend>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Email</label>
              <Input name="email" type="email" defaultValue={profile?.email ?? ""} />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Phone</label>
              <Input name="phone" defaultValue={profile?.phone ?? ""} />
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <Checkbox
              name="autoOnboardWebsiteLeads"
              defaultChecked={profile?.autoOnboardWebsiteLeads ?? true}
            />
            Auto-send onboarding email when a lead submits the homepage form
          </label>
        </fieldset>

        <Button type="submit" variant="glow">
          Save
        </Button>
      </form>
    </DashboardShell>
  );
}
