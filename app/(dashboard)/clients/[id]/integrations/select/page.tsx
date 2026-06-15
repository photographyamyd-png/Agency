import Link from "next/link";
import { notFound } from "next/navigation";
import type { IntegrationService } from "@prisma/client";
import { requireAdmin } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { listPropertiesForClient, selectIntegrationProperty } from "@/lib/actions/integrations";
import { integrationPropertyLabel, integrationSelectTitle } from "@/lib/integrations/labels";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Button } from "@/components/ui/button";

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ service?: string; clientId?: string }>;
}

export default async function AdminSelectIntegrationPage({
  params,
  searchParams,
}: PageProps) {
  await requireAdmin();
  const { id: clientId } = await params;
  const sp = await searchParams;
  const service = sp.service as IntegrationService | undefined;

  const client = await prisma.client.findUnique({ where: { id: clientId } });
  if (!client || !service) notFound();

  const properties = await listPropertiesForClient(clientId, service);
  const returnPath = `/clients/${clientId}/integrations`;

  return (
    <DashboardShell
      title={`Select ${integrationSelectTitle(service)}`}
      description={client.legalBusinessName}
    >
      <ul className="space-y-2 max-w-lg">
        {properties.map((prop) => {
          const { id, label } = integrationPropertyLabel(prop);
          return (
            <li key={id}>
              <form action={selectIntegrationProperty}>
                <input type="hidden" name="clientId" value={clientId} />
                <input type="hidden" name="service" value={service} />
                <input type="hidden" name="propertyId" value={id} />
                <input type="hidden" name="returnPath" value={returnPath} />
                <Button type="submit" variant="outline" className="w-full justify-start">
                  {label}
                </Button>
              </form>
            </li>
          );
        })}
      </ul>
      <Link href={returnPath} className="mt-6 inline-block text-sm text-accent hover:underline">
        ← Back
      </Link>
    </DashboardShell>
  );
}
