import { requireClient } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { ConnectCard } from "@/components/integrations/connect-card";
import { SyncButton } from "@/components/integrations/sync-button";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default async function ClientIntegrationsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const session = await requireClient();
  const clientId = session.user.clientId!;
  const params = await searchParams;

  const [integrations, accessItems] = await Promise.all([
    prisma.clientIntegration.findMany({ where: { clientId } }),
    prisma.accessChecklistItem.findMany({
      where: { clientId },
      orderBy: { requestedAt: "asc" },
    }),
  ]);

  const ga4 = integrations.find((i) => i.service === "GA4");
  const gsc = integrations.find((i) => i.service === "GOOGLE_SEARCH_CONSOLE");
  const gbp = integrations.find((i) => i.service === "GBP");

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Integrations</h1>
          <p className="mt-1 text-sm text-muted">
            Connect Google Analytics, Search Console, and Business Profile for live reporting
          </p>
        </div>
        <SyncButton clientId={clientId} />
      </div>

      {params.error && (
        <p className="text-sm text-danger rounded-md border border-danger/30 px-4 py-3">
          Connection failed. Please try again.
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <ConnectCard
          clientId={clientId}
          service="GA4"
          title="Google Analytics 4"
          description="Track sessions, users, and conversions from your website."
          integration={ga4}
          returnPath="/client/integrations"
          manualLabel="GA4 Property ID"
          manualPlaceholder="123456789 or properties/123456789"
        />
        <ConnectCard
          clientId={clientId}
          service="GOOGLE_SEARCH_CONSOLE"
          title="Google Search Console"
          description="Track keyword rankings — see improvements like #58 → #7."
          integration={gsc}
          returnPath="/client/integrations"
          manualLabel="GSC site URL"
          manualPlaceholder="sc-domain:example.com or https://example.com/"
        />
        <ConnectCard
          clientId={clientId}
          service="GBP"
          title="Google Business Profile"
          description="Sync location views, calls, and direction requests."
          integration={gbp}
          returnPath="/client/integrations"
          manualLabel="GBP location ID"
          manualPlaceholder="locations/123456789"
        />
      </div>

      {accessItems.length > 0 && (
        <section>
          <h2 className="text-sm font-medium mb-4">Setup checklist</h2>
          <ul className="space-y-2">
            {accessItems.map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between rounded-lg border border-border px-4 py-3 text-sm"
              >
                <span>{item.label}</span>
                <Badge variant="muted">{item.status}</Badge>
              </li>
            ))}
          </ul>
        </section>
      )}

      <p className="text-sm text-muted">
        <Link href="/client/dashboard" className="text-accent hover:underline">
          ← Back to dashboard
        </Link>
      </p>
    </div>
  );
}
