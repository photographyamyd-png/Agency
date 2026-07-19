import type { Keyword, KeywordIntent, PageNode } from "@prisma/client";
import { createKeyword, updateKeywordIntent, deleteKeyword } from "@/lib/actions/keywords";
import { suggestKeywordPhrases } from "@/lib/blueprint/keyword-helpers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

type KeywordWithRelations = Keyword & {
  rankSnapshots: { rank: number | null; clicks: number | null }[];
  pages: Pick<PageNode, "id" | "name" | "slug">[];
};

interface KeywordManagerProps {
  clientId: string;
  keywords: KeywordWithRelations[];
  serviceArea?: string;
  primarySeed?: string | null;
  pages: Pick<PageNode, "id" | "name" | "slug">[];
}

const INTENT_OPTIONS: { value: KeywordIntent; label: string }[] = [
  { value: "TRANSACTIONAL", label: "Transactional" },
  { value: "COMMERCIAL", label: "Commercial Investigation" },
  { value: "INFORMATIONAL", label: "Informational" },
];

export function KeywordManager({
  clientId,
  keywords,
  serviceArea = "",
  primarySeed,
  pages,
}: KeywordManagerProps) {
  const suggestions =
    primarySeed && serviceArea
      ? suggestKeywordPhrases(primarySeed, serviceArea)
      : [];

  const byTerm = new Map<string, Set<string>>();
  for (const kw of keywords) {
    const key = kw.term.trim().toLowerCase();
    const set = byTerm.get(key) ?? new Set<string>();
    kw.pages.forEach((p) => set.add(p.name));
    byTerm.set(key, set);
  }
  const duplicateKeywords = [...byTerm.entries()].filter(([, set]) => set.size > 1);

  return (
    <div className="space-y-6">
      <form action={createKeyword} className="flex flex-wrap gap-2 items-end">
        <input type="hidden" name="clientId" value={clientId} />
        <Input name="term" placeholder="Keyword phrase" className="max-w-xs" required />
        <select name="intent" className="h-9 rounded-md border border-border bg-background px-3 text-sm">
          <option value="">Intent tier</option>
          {INTENT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <Button type="submit" size="sm">Add keyword</Button>
      </form>

      {suggestions.length > 0 && (
        <div className="rounded-lg border border-border-bright bg-surface-raised p-4">
          <p className="text-xs text-muted mb-2">Modifier suggestions (§3.3)</p>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((s) => (
              <Badge key={s} variant="muted">{s}</Badge>
            ))}
          </div>
        </div>
      )}

      {duplicateKeywords.length > 0 && (
        <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-4 text-sm">
          <p className="font-medium text-amber-700 dark:text-amber-300 mb-1">Duplicate primary keyword warning (§3.4)</p>
          <ul className="text-xs text-muted space-y-1">
            {duplicateKeywords.map(([term, pageNames]) => (
              <li key={term}>
                &quot;{term}&quot; assigned to: {[...pageNames].join(", ")}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border-bright text-left text-muted">
              <th className="py-2 pr-4">Keyword</th>
              <th className="py-2 pr-4">Intent</th>
              <th className="py-2 pr-4">Rank</th>
              <th className="py-2 pr-4">Page</th>
              <th className="py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {keywords.map((kw) => (
              <tr key={kw.id} className="border-b border-border-bright/50">
                <td className="py-3 pr-4 font-medium">{kw.term}</td>
                <td className="py-3 pr-4">
                  <form
                    action={async (fd) => {
                      "use server";
                      const intent = fd.get("intent") as KeywordIntent;
                      if (intent) await updateKeywordIntent(kw.id, intent);
                    }}
                    className="flex gap-1"
                  >
                    <select
                      name="intent"
                      defaultValue={kw.intent ?? ""}
                      className="h-8 rounded-md border border-border bg-background px-2 text-xs"
                    >
                      <option value="">—</option>
                      {INTENT_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                      ))}
                    </select>
                    <Button type="submit" size="sm" variant="outline" className="h-8 px-2 text-xs">Set</Button>
                  </form>
                </td>
                <td className="py-3 pr-4 tabular-nums">
                  {kw.rankSnapshots[0]?.rank != null ? `#${kw.rankSnapshots[0].rank}` : "—"}
                </td>
                <td className="py-3 pr-4 text-muted">
                  {kw.pages[0]?.name ?? "Unassigned"}
                </td>
                <td className="py-3">
                  <form
                    action={async () => {
                      "use server";
                      await deleteKeyword(kw.id);
                    }}
                  >
                    <Button type="submit" size="sm" variant="outline">Remove</Button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {keywords.length === 0 && (
          <p className="text-sm text-muted py-8 text-center">No keywords yet — add manually or sync from GSC.</p>
        )}
      </div>
    </div>
  );
}
