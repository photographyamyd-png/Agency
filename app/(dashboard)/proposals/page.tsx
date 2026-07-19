import Link from "next/link";
import { FileSignature } from "lucide-react";
import { getProposals } from "@/lib/actions/proposals";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { EmptyState } from "@/components/ui/empty-state";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

const statusVariant: Record<string, "default" | "success" | "warning" | "muted"> = {
  DRAFT: "muted",
  SENT: "default",
  SIGNED: "success",
  EXPIRED: "warning",
};

export default async function ProposalsPage() {
  const proposals = await getProposals();

  return (
    <DashboardShell
      title="Proposals"
      description="Scope, pricing packages, and e-signature"
      actions={
        <Button size="sm" asChild>
          <Link href="/proposals/new">New Proposal</Link>
        </Button>
      }
    >
      {proposals.length === 0 ? (
        <EmptyState
          icon={FileSignature}
          title="No proposals yet"
          description="Create a proposal from a pricing package tier (Starter, Growth, Domination, or One-Time Build)."
          actionLabel="New Proposal"
          actionHref="/proposals/new"
        />
      ) : (
        <DataTable
          columns={[
            {
              key: "client",
              header: "Client",
              width: "30%",
              render: (row) => (
                <Link href={`/proposals/${row.id}`} className="hover:text-accent font-medium">
                  {row.client.legalBusinessName}
                </Link>
              ),
            },
            {
              key: "status",
              header: "Status",
              width: "15%",
              render: (row) => (
                <Badge variant={statusVariant[row.status] ?? "muted"}>{row.status}</Badge>
              ),
            },
            {
              key: "items",
              header: "Line items",
              width: "15%",
              render: (row) => row._count.lineItems,
            },
            {
              key: "updated",
              header: "Updated",
              width: "20%",
              render: (row) => new Date(row.updatedAt).toLocaleDateString(),
            },
          ]}
          data={proposals}
          rowKey={(r) => r.id}
          zebra
        />
      )}
    </DashboardShell>
  );
}
