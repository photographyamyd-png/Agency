import type { LocalLinkRecord, ContentCalendarItem, Keyword } from "@prisma/client";
import { createLocalLink, updateLocalLinkStatus, createContentItem, updateContentStatus } from "@/lib/actions/links-content";
import { GeoReadinessPanel } from "@/components/clients/geo-readiness-panel";
import type { GeoReadinessData } from "@/lib/blueprint/geo-readiness";
import { emptyGeoReadiness } from "@/lib/blueprint/geo-readiness";
import { geoReadinessDataSchema } from "@/lib/validation/blueprint";
import {
  LINK_ACQUISITION_CHEAT_SHEET,
  getLinkSourcePlaybook,
} from "@/lib/blueprint/checklist-playbooks";
import { ChecklistPlaybookDetails } from "@/components/clients/checklist-playbook";
import { LinkSourcePlaybookSelect } from "@/components/clients/link-source-playbook-select";
import { SectionGuide } from "@/components/clients/section-guide";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

type ContentWithKeyword = ContentCalendarItem & {
  targetKeyword: Pick<Keyword, "term"> | null;
};

interface LinksGeoPanelProps {
  clientId: string;
  localLinks: LocalLinkRecord[];
  contentItems: ContentWithKeyword[];
  geoReadinessRaw: unknown;
}

export function LinksGeoPanel({
  clientId,
  localLinks,
  contentItems,
  geoReadinessRaw,
}: LinksGeoPanelProps) {
  const geoParsed = geoReadinessDataSchema.safeParse(geoReadinessRaw ?? emptyGeoReadiness());
  const geoData: GeoReadinessData = geoParsed.success ? geoParsed.data : emptyGeoReadiness();

  return (
    <div className="space-y-8">
      <SectionGuide guideId="links.tab" />
      <section className="space-y-4">
        <h3 className="text-sm font-medium">Local Link Acquisition (§10)</h3>

        <div className="rounded-lg border border-border-bright bg-surface-raised p-4 space-y-2">
          <p className="text-xs font-medium text-foreground">Link acquisition cheat sheet (free tools)</p>
          <ul className="flex flex-wrap gap-x-3 gap-y-1">
            {LINK_ACQUISITION_CHEAT_SHEET.map((link) => (
              <li key={link.url}>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-accent-bright hover:underline"
                >
                  {link.label} →
                </a>
              </li>
            ))}
          </ul>
        </div>

        <form action={createLocalLink} className="grid gap-3 sm:grid-cols-2 rounded-lg border border-dashed border-border-bright p-4">
          <input type="hidden" name="clientId" value={clientId} />
          <LinkSourcePlaybookSelect />
          <Input name="sourceName" placeholder="Source name" required className="sm:col-span-2" />
          <Input name="url" placeholder="URL (when acquired)" className="sm:col-span-2" />
          <Input name="outreachNotes" placeholder="Outreach notes" className="sm:col-span-2" />
          <Button type="submit" size="sm" variant="outline">Add link prospect</Button>
        </form>
        <ul className="space-y-2">
          {localLinks.map((link) => {
            const playbook = getLinkSourcePlaybook(link.sourceType);
            return (
              <li
                key={link.id}
                className="rounded-lg border border-border-bright bg-surface-raised p-3 text-sm space-y-2"
              >
                <div className="flex flex-wrap items-center gap-3">
                  <Badge variant="muted">{link.sourceType}</Badge>
                  <span className="font-medium">{link.sourceName}</span>
                  <Badge variant={link.status === "ACQUIRED" ? "success" : "warning"}>{link.status}</Badge>
                  {link.url && (
                    <a
                      href={link.url}
                      className="text-accent-bright text-xs"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {link.url}
                    </a>
                  )}
                  {link.status !== "ACQUIRED" && (
                    <form action={async () => { "use server"; await updateLocalLinkStatus(link.id, "ACQUIRED"); }}>
                      <Button type="submit" size="sm" variant="outline" className="h-7">Mark acquired</Button>
                    </form>
                  )}
                </div>
                {playbook && <ChecklistPlaybookDetails playbook={playbook} />}
              </li>
            );
          })}
        </ul>
      </section>

      <GeoReadinessPanel clientId={clientId} data={geoData} />

      <section className="space-y-4">
        <h3 className="text-sm font-medium">Content Calendar</h3>
        <SectionGuide guideId="links.content" />
        <form action={createContentItem} className="flex flex-wrap gap-2">
          <input type="hidden" name="clientId" value={clientId} />
          <Input name="title" placeholder="Content title" className="max-w-xs" required />
          <select name="type" className="h-9 rounded-md border border-border px-3 text-sm">
            <option value="BLOG">Blog</option>
            <option value="LOCATION_PAGE">Location page</option>
            <option value="SERVICE_PAGE_UPDATE">Service page update</option>
            <option value="FAQ">FAQ</option>
          </select>
          <Button type="submit" size="sm" variant="outline">Add item</Button>
        </form>
        <ul className="space-y-2">
          {contentItems.map((item) => (
            <li key={item.id} className="flex items-center justify-between rounded-lg border border-border-bright bg-surface-raised p-3 text-sm">
              <div>
                <p className="font-medium">{item.title}</p>
                <p className="text-xs text-muted">{item.type}{item.targetKeyword ? ` · ${item.targetKeyword.term}` : ""}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="muted">{item.status}</Badge>
                {item.status !== "PUBLISHED" && (
                  <form action={async () => { "use server"; await updateContentStatus(item.id, "PUBLISHED"); }}>
                    <Button type="submit" size="sm" variant="outline" className="h-7">Publish</Button>
                  </form>
                )}
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
