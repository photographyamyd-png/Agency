import Link from "next/link";
import { Users } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/session";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { EmptyState } from "@/components/ui/empty-state";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatClientStatus } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function ClientsPage() {
  await requireAdmin();

  const clients = await prisma.client.findMany({
    orderBy: { updatedAt: "desc" },
    include: {
      integrations: { where: { status: "CONNECTED" } },
      _count: { select: { invoices: true, keywords: true } },
    },
  });

  return (
    <DashboardShell
      title="Clients"
      description="Manage active and onboarding client accounts"
      actions={
        <Button size="sm" asChild>
          <Link href="/leads">Convert from leads</Link>
        </Button>
      }
    >
      {clients.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No clients yet"
          description="Clients are created when you convert a lead or complete onboarding."
          actionLabel="View leads"
          actionHref="/leads"
        />
      ) : (
        <DataTable
          columns={[
            {
              key: "name",
              header: "Client",
              width: "30%",
              render: (row) => (
                <Link href={`/clients/${row.id}`} className="hover:text-accent font-medium">
                  {row.legalBusinessName}
                </Link>
              ),
            },
            {
              key: "status",
              header: "Status",
              width: "18%",
              render: (row) => formatClientStatus(row.status),
            },
            {
              key: "integrations",
              header: "Integrations",
              width: "14%",
              render: (row) => row.integrations.length,
            },
            {
              key: "keywords",
              header: "Keywords",
              width: "12%",
              render: (row) => row._count.keywords,
            },
            {
              key: "health",
              header: "Health",
              width: "14%",
              render: (row) => {
                const variant =
                  row.status === "ONBOARDING" || row.status === "ARREARS"
                    ? "danger"
                    : row.status === "ACTIVE_BUILD" || row.status === "PAUSED"
                      ? "warning"
                      : "success";
                return (
                  <Badge variant={variant}>
                    {variant === "success" ? "Good" : variant === "warning" ? "Watch" : "At risk"}
                  </Badge>
                );
              },
            },
          ]}
          data={clients}
          rowKey={(r) => r.id}
          zebra
        />
      )}
    </DashboardShell>
  );
}
