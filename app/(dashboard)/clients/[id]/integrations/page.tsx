import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { ConnectCard } from "@/components/integrations/connect-card";
import { SyncButton } from "@/components/integrations/sync-button";
import { Button } from "@/components/ui/button";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminClientIntegrationsPage({ params }: PageProps) {
  await requireAdmin();
  const { id: clientId } = await params;

  const client = await prisma.client.findUnique({ where: { id: clientId } });
  if (!client) notFound();

  const integrations = await prisma.clientIntegration.findMany({
    where: { clientId },
  });

  const ga4 = integrations.find((i) => i.service === "GA4");
  const gsc = integrations.find((i) => i.service === "GOOGLE_SEARCH_CONSOLE");
  const gbp = integrations.find((i) => i.service === "GBP");
  const returnPath = `/clients/${clientId}/integrations`;

  return (
    <DashboardShell
      title={`Integrations — ${client.legalBusinessName}`}
      description="Connect GA4, Search Console, and Business Profile on behalf of client"
      actions={
        <div className="flex gap-2">
          <SyncButton clientId={clientId} />
          <Button variant="outline" size="sm" asChild>
            <Link href={`/clients/${clientId}`}>Back to client</Link>
          </Button>
        </div>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl">
        <ConnectCard
          clientId={clientId}
          service="GA4"
          title="Google Analytics 4"
          description="Track sessions and conversions."
          integration={ga4}
          returnPath={returnPath}
          manualLabel="GA4 Property ID"
          manualPlaceholder="123456789"
        />
        <ConnectCard
          clientId={clientId}
          service="GOOGLE_SEARCH_CONSOLE"
          title="Google Search Console"
          description="Track keyword rankings."
          integration={gsc}
          returnPath={returnPath}
          manualLabel="GSC site URL"
          manualPlaceholder="sc-domain:example.com"
        />
        <ConnectCard
          clientId={clientId}
          service="GBP"
          title="Google Business Profile"
          description="Sync location insights and actions."
          integration={gbp}
          returnPath={returnPath}
          manualLabel="GBP location ID"
          manualPlaceholder="locations/123456789"
        />
      </div>
    </DashboardShell>
  );
}
