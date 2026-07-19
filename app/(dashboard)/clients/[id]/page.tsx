import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/session";
import { getClientWorkspaceData } from "@/lib/data/client-workspace";
import { getMaintenanceChecklist } from "@/lib/actions/maintenance";
import { getCurrentWorkflowTab } from "@/lib/blueprint/workflow";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { ClientWorkspaceTabs } from "@/components/clients/client-workspace-tabs";
import { Button } from "@/components/ui/button";

interface ClientPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab?: string; browse?: string }>;
}

export default async function ClientDetailPage({
  params,
  searchParams,
}: ClientPageProps) {
  await requireAdmin();
  const { id } = await params;
  const { tab, browse } = await searchParams;

  let client = await getClientWorkspaceData(id);

  if (!client) {
    notFound();
  }

  // Default: land on the current blueprint step (unless browsing freely or on overview)
  if (!tab && browse !== "1") {
    redirect(`/clients/${id}?tab=${getCurrentWorkflowTab(client)}`);
  }

  if (tab === "reports" && !client.maintenanceLogs[0]) {
    await getMaintenanceChecklist(id);
    client = (await getClientWorkspaceData(id))!;
  }

  return (
    <DashboardShell
      title={client.legalBusinessName}
      description="Client workspace — Local SEO Blueprint delivery"
      actions={
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/clients">Back to clients</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href={`/clients/${client.id}/integrations`}>Integrations</Link>
          </Button>
        </div>
      }
    >
      <ClientWorkspaceTabs
        client={client}
        activeTab={tab ?? "overview"}
        browseMode={browse === "1"}
      />
    </DashboardShell>
  );
}
