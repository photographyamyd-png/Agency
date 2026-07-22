import { saveSiteChecklistItem } from "@/lib/actions/site-checklist";
import { SITE_WIDE_CHECKLIST, type SiteChecklistData } from "@/lib/blueprint/site-checklist";
import { SectionGuide } from "@/components/clients/section-guide";
import type { SectionGuideId } from "@/lib/blueprint/section-guides";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface SiteWideChecklistProps {
  clientId: string;
  data: SiteChecklistData;
}

export function SiteWideChecklist({ clientId, data }: SiteWideChecklistProps) {
  const eatItems = SITE_WIDE_CHECKLIST.filter((i) => i.group === "eat");
  const croItems = SITE_WIDE_CHECKLIST.filter((i) => i.group === "cro");
  const doneCount = Object.values(data).filter((v) => v.status === "done").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between text-sm">
        <p className="text-muted">
          {doneCount} of {SITE_WIDE_CHECKLIST.length} site-wide items complete
        </p>
        <div className="h-2 w-32 rounded-full bg-surface overflow-hidden">
          <div
            className="h-full bg-accent transition-all"
            style={{
              width: `${(doneCount / SITE_WIDE_CHECKLIST.length) * 100}%`,
            }}
          />
        </div>
      </div>

      <ChecklistSection
        title="E-E-A-T & Trust (§6.4)"
        guideId="onpage.eeat"
        clientId={clientId}
        items={eatItems}
        data={data}
      />
      <ChecklistSection
        title="Conversion Rate Optimization (§6.5)"
        guideId="onpage.cro"
        clientId={clientId}
        items={croItems}
        data={data}
      />
    </div>
  );
}

function ChecklistSection({
  title,
  guideId,
  clientId,
  items,
  data,
}: {
  title: string;
  guideId: SectionGuideId;
  clientId: string;
  items: typeof SITE_WIDE_CHECKLIST;
  data: SiteChecklistData;
}) {
  return (
    <section className="space-y-3">
      <h3 className="text-sm font-medium">{title}</h3>
      <SectionGuide guideId={guideId} />
      <ul className="space-y-2">
        {items.map((item) => {
          const value = data[item.itemKey];
          return (
            <li
              key={item.itemKey}
              className="rounded-lg border border-border-bright bg-surface-raised p-3"
            >
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm">{item.label}</p>
                <Badge
                  variant={
                    value?.status === "done"
                      ? "success"
                      : value?.status === "na"
                        ? "muted"
                        : "warning"
                  }
                >
                  {value?.status ?? "pending"}
                </Badge>
              </div>
              <form
                action={async (fd) => {
                  "use server";
                  await saveSiteChecklistItem(
                    clientId,
                    item.itemKey,
                    fd.get("status") as "pending" | "done" | "na"
                  );
                }}
                className="flex gap-2 mt-2"
              >
                <select
                  name="status"
                  defaultValue={value?.status ?? "pending"}
                  className="h-8 text-xs rounded border border-border px-2"
                >
                  <option value="pending">Pending</option>
                  <option value="done">Done</option>
                  <option value="na">N/A</option>
                </select>
                <Button type="submit" size="sm" variant="outline" className="h-8">
                  Save
                </Button>
              </form>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
