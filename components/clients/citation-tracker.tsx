import type { CitationRecord } from "@prisma/client";
import { updateCitationStatus } from "@/lib/actions/citations";
import { CITATION_DIRECTORIES } from "@/lib/blueprint/citation-directories";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface CitationTrackerProps {
  clientId: string;
  citations: CitationRecord[];
}

const STATUS_OPTIONS = ["NOT_STARTED", "SUBMITTED", "LIVE", "NEEDS_UPDATE"];

export function CitationTracker({ clientId, citations }: CitationTrackerProps) {
  const byTier = (tier: string) =>
    citations.filter((c) => {
      const def = CITATION_DIRECTORIES.find((d) => d.directory === c.directory);
      return def?.tier === tier;
    });

  return (
    <div className="space-y-6">
      {(["TIER_1", "TIER_2", "TIER_3"] as const).map((tier) => (
        <section key={tier} className="space-y-3">
          <h3 className="text-sm font-medium">{tier.replace("_", " ")} Directories</h3>
          {byTier(tier).map((c) => (
            <form
              key={c.id}
              action={async (fd) => {
                "use server";
                await updateCitationStatus(
                  c.id,
                  fd.get("status") as string,
                  (fd.get("url") as string) || undefined
                );
              }}
              className="flex flex-wrap items-center gap-3 rounded-lg border border-border-bright bg-surface-raised p-3 text-sm"
            >
              <span className="font-medium min-w-[180px]">{c.directory}</span>
              <select name="status" defaultValue={c.status} className="h-8 text-xs rounded border border-border px-2">
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>{s.replace(/_/g, " ")}</option>
                ))}
              </select>
              <Input name="url" placeholder="Listing URL" defaultValue={c.url ?? ""} className="max-w-xs h-8" />
              <Button type="submit" size="sm" variant="outline" className="h-8">Update</Button>
              {c.lastCheckedAt && (
                <Badge variant="muted" className="text-xs">
                  Checked {new Date(c.lastCheckedAt).toLocaleDateString()}
                </Badge>
              )}
            </form>
          ))}
        </section>
      ))}
      <p className="text-xs text-muted">
        {citations.filter((c) => c.status === "LIVE").length} of {citations.length} citations live
      </p>
    </div>
  );
}
