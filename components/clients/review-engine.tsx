import type { ReviewSnapshot } from "@prisma/client";
import { saveReviewTargets } from "@/lib/actions/citations";
import { SectionGuide } from "@/components/clients/section-guide";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

interface ReviewEngineProps {
  clientId: string;
  reviewSnapshots: ReviewSnapshot[];
  reviewTargets: Record<string, unknown> | null;
}

export function ReviewEngine({ clientId, reviewSnapshots, reviewTargets }: ReviewEngineProps) {
  const targets = reviewTargets as {
    monthlyTarget?: number;
    minimumBeforeWork?: number;
    reviewLink?: string;
    qrCodeUrl?: string;
    requestTemplate?: string;
    coachingPrompt?: string;
  } | null;

  const latest = reviewSnapshots[0];
  const thisMonth = reviewSnapshots.filter((r) => {
    const d = new Date(r.capturedAt);
    const now = new Date();
    return d.getMonth() === now.getMonth();
  }).length;

  return (
    <div className="space-y-8">
      <SectionGuide guideId="reviews.tab" />
      <div className="grid gap-4 sm:grid-cols-3 text-sm">
        <div className="rounded-lg border border-border-bright bg-surface-raised p-4">
          <p className="text-muted text-xs">Latest rating</p>
          <p className="text-2xl font-bold tabular-nums">{latest?.rating?.toFixed(1) ?? "—"}</p>
        </div>
        <div className="rounded-lg border border-border-bright bg-surface-raised p-4">
          <p className="text-muted text-xs">Total reviews</p>
          <p className="text-2xl font-bold tabular-nums">{latest?.count ?? "—"}</p>
        </div>
        <div className="rounded-lg border border-border-bright bg-surface-raised p-4">
          <p className="text-muted text-xs">This month</p>
          <p className="text-2xl font-bold tabular-nums">
            {thisMonth}
            <span className="text-sm font-normal text-muted"> / {targets?.monthlyTarget ?? 5} target</span>
          </p>
        </div>
      </div>

      <form
        action={async (fd) => {
          "use server";
          await saveReviewTargets(clientId, {
            monthlyTarget: parseInt(fd.get("monthlyTarget") as string, 10) || 5,
            minimumBeforeWork: parseInt(fd.get("minimumBeforeWork") as string, 10) || 10,
            reviewLink: fd.get("reviewLink") || undefined,
            qrCodeUrl: fd.get("qrCodeUrl") || undefined,
            requestTemplate: fd.get("requestTemplate") || undefined,
            coachingPrompt: fd.get("coachingPrompt") || undefined,
          });
        }}
        className="space-y-4 rounded-lg border border-border-bright bg-surface-raised p-4"
      >
        <h3 className="text-sm font-medium">Review Request System (§9.2)</h3>
        <SectionGuide guideId="reviews.request" />
        <div className="grid gap-3 sm:grid-cols-2">
          <Input name="monthlyTarget" type="number" placeholder="Monthly target (5-15)" defaultValue={targets?.monthlyTarget ?? 5} />
          <Input name="minimumBeforeWork" type="number" placeholder="Min reviews before work (10)" defaultValue={targets?.minimumBeforeWork ?? 10} />
          <Input name="reviewLink" placeholder="Direct Google review link" defaultValue={targets?.reviewLink ?? ""} className="sm:col-span-2" />
          <Input name="qrCodeUrl" placeholder="QR code URL" defaultValue={targets?.qrCodeUrl ?? ""} className="sm:col-span-2" />
        </div>
        <Textarea
          name="requestTemplate"
          placeholder="Hi [Name], thanks for choosing [Business]! ..."
          defaultValue={targets?.requestTemplate ?? ""}
          rows={3}
        />
        <Textarea
          name="coachingPrompt"
          placeholder="Coaching prompt (§9.3): Mention what service we did and your neighbourhood..."
          defaultValue={targets?.coachingPrompt ?? "If you have a moment, feel free to mention what service we did and your neighbourhood."}
          rows={2}
        />
        <p className="text-xs text-muted">
          Set up a free <a href="https://www.google.com/alerts" target="_blank" rel="noopener noreferrer" className="text-accent-bright hover:underline">Google Alert</a> for the client business name (§9.5).
        </p>
        <Button type="submit" variant="outline" size="sm">Save review settings</Button>
      </form>

      <section className="space-y-2">
        <h3 className="text-sm font-medium">Response Protocol (§9.4)</h3>
        <SectionGuide guideId="reviews.response" />
        <p className="text-sm text-muted">Respond to every review within 24 hours. Never copy-paste identical templates.</p>
        <Badge variant="warning">24h SLA — check GBP dashboard weekly</Badge>
      </section>

      <section>
        <h3 className="text-sm font-medium mb-3">Review History</h3>
        <ul className="space-y-2">
          {reviewSnapshots.map((r) => (
            <li key={r.id} className="flex justify-between text-sm rounded-lg border border-border-bright bg-surface-raised px-4 py-2">
              <span>{r.platform}</span>
              <span className="tabular-nums">{r.rating?.toFixed(1)} ★ · {r.count} reviews</span>
              <span className="text-muted text-xs">{new Date(r.capturedAt).toLocaleDateString()}</span>
            </li>
          ))}
          {reviewSnapshots.length === 0 && (
            <p className="text-sm text-muted">No review snapshots yet — sync GBP integration.</p>
          )}
        </ul>
      </section>
    </div>
  );
}
