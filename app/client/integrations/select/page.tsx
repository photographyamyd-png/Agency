import { notFound } from "next/navigation";
import type { IntegrationService } from "@prisma/client";
import { requireClient } from "@/lib/auth/session";
import {
  listPropertiesForClient,
  selectIntegrationProperty,
} from "@/lib/actions/integrations";
import { integrationPropertyLabel, integrationSelectTitle } from "@/lib/integrations/labels";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function SelectIntegrationPage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string; clientId?: string }>;
}) {
  const session = await requireClient();
  const params = await searchParams;
  const service = params.service as IntegrationService | undefined;
  const clientId = params.clientId ?? session.user.clientId;

  if (!service || !clientId || clientId !== session.user.clientId) {
    notFound();
  }

  const properties = await listPropertiesForClient(clientId, service);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">
          Select {integrationSelectTitle(service)}
        </h1>
        <p className="mt-1 text-sm text-muted">
          Choose which property to link to your account
        </p>
      </div>

      {properties.length === 0 ? (
        <p className="text-sm text-muted">
          No properties found. Try reconnecting or use manual entry on the integrations page.
        </p>
      ) : (
        <ul className="space-y-2">
          {properties.map((prop) => {
            const { id, label } = integrationPropertyLabel(prop);
            return (
              <li key={id}>
                <form action={selectIntegrationProperty}>
                  <input type="hidden" name="clientId" value={clientId} />
                  <input type="hidden" name="service" value={service} />
                  <input type="hidden" name="propertyId" value={id} />
                  <input
                    type="hidden"
                    name="returnPath"
                    value="/client/integrations"
                  />
                  <Button
                    type="submit"
                    variant="outline"
                    className="w-full justify-start"
                  >
                    {label}
                  </Button>
                </form>
              </li>
            );
          })}
        </ul>
      )}

      <Link
        href="/client/integrations"
        className="text-sm text-accent hover:underline"
      >
        ← Back
      </Link>
    </div>
  );
}
