import Link from "next/link";
import type { ClientIntegration, IntegrationService } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { connectManualIntegration } from "@/lib/actions/integrations";

interface ConnectCardProps {
  clientId: string;
  service: IntegrationService;
  title: string;
  description: string;
  integration?: ClientIntegration;
  returnPath: string;
  manualPlaceholder: string;
  manualLabel: string;
}

export function ConnectCard({
  clientId,
  service,
  title,
  description,
  integration,
  returnPath,
  manualPlaceholder,
  manualLabel,
}: ConnectCardProps) {
  const isConnected = integration?.status === "CONNECTED";
  const isPending = integration?.status === "PENDING";

  const authorizeUrl = `/api/integrations/google/authorize?clientId=${clientId}&service=${service}&returnPath=${encodeURIComponent(returnPath)}`;

  return (
    <div className="rounded-xl border border-border p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-medium">{title}</h2>
        <Badge variant={isConnected ? "success" : isPending ? "warning" : "muted"}>
          {integration?.status ?? "Not connected"}
        </Badge>
      </div>
      <p className="text-sm text-muted">{description}</p>

      {isConnected && (
        <div className="text-xs text-muted space-y-1">
          {integration.connectionMethod === "OAUTH" ? "Connected via Google" : "Connected manually"}
          {integration.externalPropertyId && (
            <p>Property: {integration.externalPropertyId}</p>
          )}
          {integration.externalSiteUrl && (
            <p>Site: {integration.externalSiteUrl}</p>
          )}
          {integration.externalLocationId && (
            <p>Location: {integration.externalLocationId}</p>
          )}
          {integration.lastSyncedAt && (
            <p>Last synced: {new Date(integration.lastSyncedAt).toLocaleString()}</p>
          )}
          {integration.lastError && (
            <p className="text-danger">{integration.lastError}</p>
          )}
        </div>
      )}

      {isPending && (
        <Button size="sm" asChild>
          <Link
            href={
              returnPath.includes("/clients/")
                ? `${returnPath}/select?service=${service}&clientId=${clientId}`
                : `/client/integrations/select?service=${service}&clientId=${clientId}`
            }
          >
            Select property →
          </Link>
        </Button>
      )}

      {!isConnected && !isPending && (
        <div className="flex flex-wrap gap-2">
          <Button size="sm" asChild>
            <a href={authorizeUrl}>Connect with Google</a>
          </Button>
        </div>
      )}

      <details className="text-sm">
        <summary className="cursor-pointer text-muted hover:text-foreground">
          Or enter {manualLabel} manually
        </summary>
        <form action={connectManualIntegration} className="mt-3 flex gap-2">
          <input type="hidden" name="clientId" value={clientId} />
          <input type="hidden" name="service" value={service} />
          <input type="hidden" name="returnPath" value={returnPath} />
          <Input
            name="value"
            placeholder={manualPlaceholder}
            className="flex-1"
          />
          <Button type="submit" size="sm" variant="outline">
            Save
          </Button>
        </form>
      </details>
    </div>
  );
}
