import { getSystemEvents } from "@/lib/actions/maintenance";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

export default async function EventsPage() {
  const events = await getSystemEvents(100);

  return (
    <DashboardShell
      title="System Events"
      description="Audit trail of automation triggers and key actions"
    >
      <DataTable
        columns={[
          {
            key: "type",
            header: "Event",
            width: "25%",
            render: (row) => (
              <Badge variant="muted">{row.type.replace(/_/g, " ")}</Badge>
            ),
          },
          {
            key: "client",
            header: "Client",
            width: "25%",
            render: (row) => row.client?.legalBusinessName ?? "—",
          },
          {
            key: "processed",
            header: "Processed",
            width: "15%",
            render: (row) => (row.processed ? "Yes" : "No"),
          },
          {
            key: "created",
            header: "When",
            width: "20%",
            render: (row) => new Date(row.createdAt).toLocaleString(),
          },
        ]}
        data={events}
        rowKey={(r) => r.id}
        zebra
      />
    </DashboardShell>
  );
}
