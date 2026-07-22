import type { PageNode, SEOChecklistItem, TechnicalHealthLog } from "@prisma/client";
import { seedSitemapFromTemplate, createPageNode, updatePageStatus } from "@/lib/actions/sitemap";
import { submitPageForIndexing, markPageIndexed } from "@/lib/actions/indexing";
import { TECHNICAL_AUDIT_CHECKLIST } from "@/lib/blueprint/seo-checklist-keys";
import { PAGE_TYPE_LABELS } from "@/lib/blueprint/page-templates";
import { runPageSpeedAction } from "@/lib/actions/pagespeed";
import { SectionGuide } from "@/components/clients/section-guide";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

type PageWithChildren = PageNode & {
  primaryKeyword: { term: string } | null;
  seoItems: SEOChecklistItem[];
  children: (PageNode & { primaryKeyword: { term: string } | null; seoItems: SEOChecklistItem[] })[];
};

interface SitemapBuilderProps {
  clientId: string;
  pages: PageWithChildren[];
  techHealthLogs: TechnicalHealthLog[];
  siteUrl?: string | null;
}

const INDEX_STATUS_VARIANT: Record<string, "success" | "warning" | "muted" | "danger"> = {
  INDEXED: "success",
  SUBMITTED: "warning",
  ERROR: "danger",
  NOT_SUBMITTED: "muted",
};

export function SitemapBuilder({ clientId, pages, techHealthLogs, siteUrl }: SitemapBuilderProps) {
  const latestTech = techHealthLogs[0];
  const flatPages = pages.flatMap((p) => [p, ...p.children]);
  const locationPages = flatPages.filter((p) => p.pageType === "LOCATION");

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium">Site Architecture (§4)</h3>
          {pages.length === 0 && (
            <form action={async () => { "use server"; await seedSitemapFromTemplate(clientId); }}>
              <Button type="submit" size="sm">Seed from template</Button>
            </form>
          )}
        </div>

        <SectionGuide guideId="sitemap.architecture" />

        {locationPages.length > 1 && (
          <p className="text-xs text-amber-600 dark:text-amber-400 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3">
            §4.2 reminder: Every city page must contain unique hyper-local content — never copy-paste and swap city names only.
          </p>
        )}

        <ul className="space-y-2">
          {pages.map((page) => (
            <li key={page.id} className="rounded-lg border border-border-bright bg-surface-raised p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium">{page.name}</p>
                  <p className="text-xs text-muted">{page.slug} · {PAGE_TYPE_LABELS[page.pageType]}</p>
                  {page.primaryKeyword && (
                    <p className="text-xs text-accent-bright mt-1">↳ {page.primaryKeyword.term}</p>
                  )}
                </div>
                <div className="flex items-center gap-2 flex-wrap justify-end">
                  <Badge variant={INDEX_STATUS_VARIANT[page.indexStatus] ?? "muted"}>
                    {page.indexStatus.replace(/_/g, " ")}
                  </Badge>
                  <Badge variant="muted">{page.status}</Badge>
                  <form action={async (fd) => {
                    "use server";
                    await updatePageStatus(page.id, fd.get("status") as "PLANNED" | "BUILD" | "SEO" | "QA" | "LIVE");
                  }}>
                    <select name="status" defaultValue={page.status} className="h-8 text-xs rounded border border-border px-2">
                      {["PLANNED", "BUILD", "SEO", "QA", "LIVE"].map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                    <Button type="submit" size="sm" variant="outline" className="ml-1 h-8">Update</Button>
                  </form>
                </div>
              </div>
              {page.status === "LIVE" && (
                <div className="flex gap-2 mt-3">
                  <form action={async () => { "use server"; await submitPageForIndexing(page.id); }}>
                    <Button type="submit" size="sm" variant="outline" className="h-7 text-xs">Submit for indexing</Button>
                  </form>
                  {page.indexStatus === "SUBMITTED" && (
                    <form action={async () => { "use server"; await markPageIndexed(page.id); }}>
                      <Button type="submit" size="sm" variant="outline" className="h-7 text-xs">Mark indexed</Button>
                    </form>
                  )}
                </div>
              )}
              {page.children.length > 0 && (
                <ul className="mt-3 ml-4 space-y-1 border-l border-border-bright pl-4">
                  {page.children.map((child) => (
                    <li key={child.id} className="text-sm text-muted flex items-center justify-between gap-2">
                      <span>{child.name} <span className="text-xs">({child.slug})</span></span>
                      <Badge variant={INDEX_STATUS_VARIANT[child.indexStatus] ?? "muted"} className="text-xs">
                        {child.indexStatus.replace(/_/g, " ")}
                      </Badge>
                    </li>
                  ))}
                </ul>
              )}
              <p className="text-xs text-muted mt-2">
                SEO checklist: {page.seoItems.filter((i) => i.status === "DONE").length}/{page.seoItems.length} done
              </p>
            </li>
          ))}
        </ul>

        <form action={createPageNode} className="rounded-lg border border-dashed border-border-bright p-4 space-y-3">
          <input type="hidden" name="clientId" value={clientId} />
          <p className="text-xs text-muted">Add page</p>
          <div className="grid gap-3 sm:grid-cols-3">
            <Input name="name" placeholder="Page name" required />
            <Input name="slug" placeholder="/path" required />
            <select name="pageType" className="h-9 rounded-md border border-border bg-background px-3 text-sm">
              {Object.entries(PAGE_TYPE_LABELS).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
          </div>
          <Button type="submit" size="sm" variant="outline">Add page</Button>
        </form>
      </section>

      <section className="space-y-4">
        <h3 className="text-sm font-medium">Technical Audit (§5)</h3>
        <SectionGuide guideId="sitemap.technical" />
        {latestTech && (
          <div className="grid gap-4 sm:grid-cols-4 text-sm">
            <div className="rounded-lg border border-border-bright bg-surface-raised p-4">
              <p className="text-muted text-xs">LCP</p>
              <p className="text-lg font-bold tabular-nums">{latestTech.lcp?.toFixed(2) ?? "—"}s</p>
              <p className="text-xs text-muted">Target &lt; 2.5s</p>
            </div>
            <div className="rounded-lg border border-border-bright bg-surface-raised p-4">
              <p className="text-muted text-xs">INP</p>
              <p className="text-lg font-bold tabular-nums">{latestTech.inp?.toFixed(0) ?? "—"}ms</p>
              <p className="text-xs text-muted">Target &lt; 200ms</p>
            </div>
            <div className="rounded-lg border border-border-bright bg-surface-raised p-4">
              <p className="text-muted text-xs">CLS</p>
              <p className="text-lg font-bold tabular-nums">{latestTech.cls?.toFixed(3) ?? "—"}</p>
              <p className="text-xs text-muted">Target &lt; 0.1</p>
            </div>
            <div className="rounded-lg border border-border-bright bg-surface-raised p-4">
              <p className="text-muted text-xs">Broken links</p>
              <p className="text-lg font-bold tabular-nums">{latestTech.brokenLinksCount ?? "—"}</p>
            </div>
          </div>
        )}
        {siteUrl && (
          <form action={runPageSpeedAction} className="flex gap-2">
            <input type="hidden" name="clientId" value={clientId} />
            <input type="hidden" name="url" value={siteUrl} />
            <Button type="submit" size="sm" variant="outline">Run PageSpeed audit</Button>
          </form>
        )}
        <ul className="space-y-2">
          {TECHNICAL_AUDIT_CHECKLIST.map((item) => (
            <li key={item.itemKey} className="flex items-center gap-2 text-sm text-muted">
              <span className="h-1.5 w-1.5 rounded-full bg-border-bright" />
              {item.label}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
