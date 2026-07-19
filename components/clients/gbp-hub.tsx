import type { GBPActivityLog } from "@prisma/client";
import { logGbpActivity } from "@/lib/actions/citations";
import { GBP_GOVERNANCE_CHECKLIST, GBP_CONTENT_CHECKLIST, GBP_ONGOING_SOPS } from "@/lib/blueprint/gbp-sops";
import { GbpUtmBuilder } from "@/components/clients/gbp-utm-builder";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

interface GbpHubProps {
  clientId: string;
  gbpActivity: GBPActivityLog[];
  gbpConnected: boolean;
  siteUrl?: string | null;
}

export function GbpHub({ clientId, gbpActivity, gbpConnected, siteUrl }: GbpHubProps) {
  const postsThisMonth = gbpActivity.filter((a) => {
    const d = new Date(a.postedAt);
    const now = new Date();
    return d.getMonth() === now.getMonth() && a.type === "POST";
  }).length;

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4 text-sm">
        <Badge variant={gbpConnected ? "success" : "warning"}>
          {gbpConnected ? "GBP connected" : "GBP not connected"}
        </Badge>
        <span className="text-muted">{postsThisMonth} posts logged this month (target: 8–12)</span>
      </div>

      <GbpUtmBuilder defaultBaseUrl={siteUrl ?? ""} />

      <section className="space-y-2">
        <h3 className="text-sm font-medium">Profile Governance (§7.1)</h3>
        <ul className="space-y-1">
          {GBP_GOVERNANCE_CHECKLIST.map((item) => (
            <li key={item.key} className="text-sm text-muted flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-border-bright" />
              {item.label}
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-2">
        <h3 className="text-sm font-medium">Content Optimization (§7.2)</h3>
        <ul className="space-y-1">
          {GBP_CONTENT_CHECKLIST.map((item) => (
            <li key={item.key} className="text-sm text-muted flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-border-bright" />
              {item.label}
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-4">
        <h3 className="text-sm font-medium">Posts Log (§7.3)</h3>
        <form action={logGbpActivity} className="space-y-3 rounded-lg border border-dashed border-border-bright p-4">
          <input type="hidden" name="clientId" value={clientId} />
          <input type="hidden" name="type" value="POST" />
          <Textarea name="content" placeholder="Post content summary (100-150 words, include keyword + location)" rows={3} />
          <div className="grid gap-3 sm:grid-cols-2">
            <select name="ctaType" className="h-9 rounded-md border border-border px-3 text-sm">
              <option value="">CTA type</option>
              <option value="Book">Book</option>
              <option value="Call Now">Call Now</option>
              <option value="Get Quote">Get Quote</option>
            </select>
            <Input name="destinationUrl" placeholder="Destination URL" />
            <Input name="utmParams" placeholder="UTM params (or use builder above)" className="sm:col-span-2" />
          </div>
          <label className="flex items-center gap-2 text-sm text-muted">
            <input type="checkbox" name="photoAttached" className="rounded" />
            Job-site photo attached
          </label>
          <Button type="submit" size="sm" variant="outline">Log GBP post</Button>
        </form>
        <ul className="space-y-2">
          {gbpActivity.map((a) => (
            <li key={a.id} className="text-sm rounded-lg border border-border-bright bg-surface-raised p-3">
              <div className="flex justify-between text-muted text-xs mb-1">
                <span>{a.type}{a.ctaType ? ` · ${a.ctaType}` : ""}</span>
                <span>{new Date(a.postedAt).toLocaleDateString()}</span>
              </div>
              {a.content && <p>{a.content}</p>}
              {a.destinationUrl && (
                <p className="text-xs text-accent-bright mt-1 truncate">{a.destinationUrl}{a.utmParams}</p>
              )}
              {a.photoAttached && <Badge variant="muted" className="mt-1 text-xs">Photo attached</Badge>}
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-2">
        <h3 className="text-sm font-medium">Ongoing SOPs (§7.4)</h3>
        {GBP_ONGOING_SOPS.map((sop) => (
          <p key={sop.label} className="text-sm text-muted">
            <Badge variant="muted" className="mr-2 text-xs">{sop.frequency}</Badge>
            {sop.label}
          </p>
        ))}
      </section>
    </div>
  );
}
