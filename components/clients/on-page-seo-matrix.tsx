import type { PageNode, SEOChecklistItem, SchemaMarkup } from "@prisma/client";
import { updateSeoChecklistItem } from "@/lib/actions/sitemap";
import { createSchemaFromTemplate } from "@/lib/actions/schema";
import { SCHEMA_TEMPLATES } from "@/lib/blueprint/schema-templates";
import { ON_PAGE_SEO_CHECKLIST } from "@/lib/blueprint/seo-checklist-keys";
import { SiteWideChecklist } from "@/components/clients/site-wide-checklist";
import { SectionGuide } from "@/components/clients/section-guide";
import { emptySiteChecklist, type SiteChecklistData } from "@/lib/blueprint/site-checklist";
import { siteChecklistDataSchema } from "@/lib/validation/blueprint";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type PageWithSeo = PageNode & {
  seoItems: SEOChecklistItem[];
  schemaItems: SchemaMarkup[];
  children: (PageNode & { seoItems: SEOChecklistItem[] })[];
};

interface OnPageSeoMatrixProps {
  clientId: string;
  pages: PageWithSeo[];
  siteChecklistRaw: unknown;
}

export function OnPageSeoMatrix({ clientId, pages, siteChecklistRaw }: OnPageSeoMatrixProps) {
  const allPages = pages.flatMap((p) => [p, ...p.children]);
  const siteParsed = siteChecklistDataSchema.safeParse(siteChecklistRaw ?? emptySiteChecklist());
  const siteChecklistData: SiteChecklistData = siteParsed.success
    ? siteParsed.data
    : emptySiteChecklist();

  return (
    <div className="space-y-6">
      <SectionGuide guideId="onpage.matrix" />
      <div className="rounded-lg border border-border-bright bg-surface-raised p-4 text-sm text-muted">
        <p className="font-medium text-foreground mb-1">Metadata formulas (§6.1)</p>
        <p>Title: Primary Service + Location | Benefit | Brand (under 60 chars)</p>
        <p className="mt-1">Meta: [Local modifier] + [USP] + [CTA] (under 155 chars)</p>
      </div>

      {allPages.length === 0 ? (
        <p className="text-sm text-muted py-8 text-center">Add pages in Site Map tab first.</p>
      ) : (
        allPages.map((page) => (
          <div key={page.id} className="rounded-lg border border-border-bright bg-surface-raised p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{page.name}</p>
                <p className="text-xs text-muted">{page.slug}</p>
              </div>
              <Badge variant="muted">{page.status}</Badge>
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
              {page.seoItems.map((item) => (
                <form
                  key={item.id}
                  action={async () => {
                    "use server";
                    await updateSeoChecklistItem(
                      item.id,
                      item.status === "DONE" ? "PENDING" : "DONE"
                    );
                  }}
                  className="flex items-center justify-between gap-2 text-sm rounded border border-border-bright/50 px-3 py-2"
                >
                  <span className={item.status === "DONE" ? "line-through text-muted" : ""}>
                    {item.label}
                  </span>
                  <Button type="submit" size="sm" variant="outline" className="h-7 text-xs shrink-0">
                    {item.status === "DONE" ? "Undo" : "Done"}
                  </Button>
                </form>
              ))}
            </div>

            {"schemaItems" in page && (page as PageWithSeo).schemaItems?.length > 0 && (
              <div className="text-xs text-muted">
                Schema: {(page as PageWithSeo).schemaItems.map((s) => s.type).join(", ")}
              </div>
            )}

            <form action={async (fd) => {
              "use server";
              await createSchemaFromTemplate(page.id, fd.get("schemaType") as string);
            }} className="flex gap-2">
              <select name="schemaType" className="h-8 text-xs rounded border border-border px-2">
                {SCHEMA_TEMPLATES.map((t) => (
                  <option key={t.type} value={t.type}>{t.label}</option>
                ))}
              </select>
              <Button type="submit" size="sm" variant="outline" className="h-8">Add schema</Button>
            </form>
          </div>
        ))
      )}

      <p className="text-xs text-muted">
        Per-page checklist includes {ON_PAGE_SEO_CHECKLIST.length} items from blueprint §6.2
      </p>

      <SiteWideChecklist clientId={clientId} data={siteChecklistData} />
    </div>
  );
}
