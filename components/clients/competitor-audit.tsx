import type { ActionPlanItem, Competitor, GeoGridSnapshot } from "@prisma/client";
import {
  upsertCompetitor,
  deleteCompetitor,
  createGeoGridSnapshot,
  generateActionPlanFromResearch,
} from "@/lib/actions/competitors";
import { ActionPlanList } from "@/components/clients/action-plan-list";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

interface CompetitorAuditProps {
  clientId: string;
  competitors: Competitor[];
  geoGridSnapshots: GeoGridSnapshot[];
  actionPlanItems: ActionPlanItem[];
}

function formatSecondaryCategories(raw: unknown): string {
  if (Array.isArray(raw)) return raw.join(", ");
  return "";
}

function formatSemanticPhrases(raw: unknown): string {
  if (Array.isArray(raw)) return raw.join("\n");
  return "";
}

export function CompetitorAudit({
  clientId,
  competitors,
  geoGridSnapshots,
  actionPlanItems,
}: CompetitorAuditProps) {
  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium">Map-Pack Competitors (top 3)</h3>
          <form
            action={async () => {
              "use server";
              await generateActionPlanFromResearch(clientId);
            }}
          >
            <Button type="submit" size="sm" variant="outline">
              Generate action plan
            </Button>
          </form>
        </div>

        {competitors.map((c) => (
          <form
            key={c.id}
            action={upsertCompetitor}
            className="rounded-lg border border-border-bright bg-surface-raised p-4 space-y-3"
          >
            <input type="hidden" name="id" value={c.id} />
            <input type="hidden" name="clientId" value={clientId} />
            <div className="grid gap-3 sm:grid-cols-2">
              <Input name="name" placeholder="Business name" defaultValue={c.name ?? ""} />
              <Input name="url" placeholder="Website URL" defaultValue={c.url} required />
              <Input name="gbpPrimaryCategory" placeholder="GBP primary category" defaultValue={c.gbpPrimaryCategory ?? ""} />
              <Input
                name="gbpSecondaryCategories"
                placeholder="Secondary categories (comma-separated)"
                defaultValue={formatSecondaryCategories(c.gbpSecondaryCategories)}
              />
              <Input name="reviewCount" type="number" placeholder="Review count" defaultValue={c.reviewCount ?? ""} />
              <Input name="avgRating" type="number" step="0.1" placeholder="Avg rating" defaultValue={c.avgRating ?? ""} />
              <Input name="photoCount" type="number" placeholder="Photo count" defaultValue={c.photoCount ?? ""} />
              <Input name="reviewVelocity" placeholder="Review velocity (e.g. 5/month)" defaultValue={c.reviewVelocity ?? ""} />
            </div>
            <Textarea name="postsNotes" placeholder="GBP posts audit — cadence, format, CTAs (§2.1)" defaultValue={c.postsNotes ?? ""} rows={2} />
            <Textarea name="servicesNotes" placeholder="GBP services section audit (§2.1)" defaultValue={c.servicesNotes ?? ""} rows={2} />
            <Textarea name="geoGridNotes" placeholder="Geo-grid notes" defaultValue={c.geoGridNotes ?? ""} rows={2} />
            <Textarea name="qaNotes" placeholder="Q&A audit notes" defaultValue={c.qaNotes ?? ""} rows={2} />
            <Textarea
              name="semanticPhrases"
              placeholder="Review mining — 'People Often Mention' phrases, one per line (§2.4)"
              defaultValue={formatSemanticPhrases(c.semanticPhrases)}
              rows={3}
            />
            <div className="flex gap-2">
              <Button type="submit" size="sm">Save</Button>
              <Button
                type="submit"
                size="sm"
                variant="outline"
                formAction={async () => {
                  "use server";
                  await deleteCompetitor(c.id, clientId);
                }}
              >
                Delete
              </Button>
            </div>
          </form>
        ))}

        {competitors.length < 3 && (
          <form action={upsertCompetitor} className="rounded-lg border border-dashed border-border-bright p-4 space-y-3">
            <input type="hidden" name="clientId" value={clientId} />
            <p className="text-xs text-muted">Add competitor #{competitors.length + 1}</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <Input name="name" placeholder="Business name" />
              <Input name="url" placeholder="Website URL" required />
              <Input name="gbpPrimaryCategory" placeholder="GBP primary category" />
              <Input name="reviewCount" type="number" placeholder="Review count" />
            </div>
            <Button type="submit" size="sm" variant="outline">Add competitor</Button>
          </form>
        )}
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-medium">Research Action Plan</h3>
        <ActionPlanList clientId={clientId} items={actionPlanItems} />
      </section>

      <section className="space-y-4">
        <h3 className="text-sm font-medium">Geo-Grid Snapshots</h3>
        {geoGridSnapshots.map((s) => (
          <div key={s.id} className="rounded-lg border border-border-bright bg-surface-raised p-4 text-sm space-y-1">
            <div className="flex justify-between">
              <span className="font-medium">{s.seedPhrase}</span>
              <Badge variant="muted">{new Date(s.capturedAt).toLocaleDateString()}</Badge>
            </div>
            {s.notes && <p className="text-muted">{s.notes}</p>}
            {s.screenshotUrl && (
              <a href={s.screenshotUrl} target="_blank" rel="noopener noreferrer" className="text-accent-bright text-xs">
                View screenshot
              </a>
            )}
          </div>
        ))}
        <form action={createGeoGridSnapshot} className="rounded-lg border border-dashed border-border-bright p-4 space-y-3">
          <input type="hidden" name="clientId" value={clientId} />
          <Input name="seedPhrase" placeholder="Primary seed phrase" required />
          <Textarea name="notes" placeholder="Visibility notes by location" rows={2} />
          <Input name="screenshotUrl" placeholder="Screenshot URL (optional)" />
          <Button type="submit" size="sm" variant="outline">Add geo-grid snapshot</Button>
        </form>
      </section>
    </div>
  );
}
