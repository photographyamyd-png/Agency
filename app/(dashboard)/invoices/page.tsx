import Link from "next/link";
import { FileText } from "lucide-react";
import { getInvoices } from "@/lib/actions/invoices";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { EmptyState } from "@/components/ui/empty-state";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatInvoiceStatus } from "@/lib/format";

export const dynamic = "force-dynamic";

const statusVariant: Record<string, "default" | "success" | "warning" | "danger" | "muted"> = {
  DRAFT: "muted",
  SENT: "default",
  PARTIALLY_PAID: "warning",
  PAID: "success",
  OVERDUE: "danger",
  CANCELLED: "muted",
  REFUNDED: "muted",
};

export default async function InvoicesPage() {
  const invoices = await getInvoices();

  return (
    <DashboardShell
      title="Invoices"
      description="Track billing, payments, and overdue accounts"
      actions={
        <Button size="sm" asChild>
          <Link href="/invoices/new">New Invoice</Link>
        </Button>
      }
    >
      {invoices.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No invoices yet"
          description="Create an invoice for ad-hoc billing or send retainers via Stripe."
          actionLabel="Create Invoice"
          actionHref="/invoices/new"
        />
      ) : (
        <DataTable
          columns={[
            {
              key: "client",
              header: "Client",
              width: "28%",
              render: (row) => (
                <Link href={`/invoices/${row.id}`} className="hover:text-accent font-medium">
                  {row.client.legalBusinessName}
                </Link>
              ),
            },
            {
              key: "type",
              header: "Type",
              width: "14%",
              render: (row) => formatInvoiceStatus(row.type),
            },
            {
              key: "amount",
              header: "Amount",
              width: "14%",
              render: (row) => formatCurrency(Number(row.totalAmount), row.currency),
            },
            {
              key: "status",
              header: "Status",
              width: "14%",
              render: (row) => (
                <Badge variant={statusVariant[row.status] ?? "muted"}>
                  {formatInvoiceStatus(row.status)}
                </Badge>
              ),
            },
            {
              key: "due",
              header: "Due",
              width: "14%",
              render: (row) =>
                row.dueDate ? new Date(row.dueDate).toLocaleDateString() : "—",
            },
            {
              key: "payments",
              header: "Payments",
              width: "10%",
              render: (row) => row._count.payments,
            },
          ]}
          data={invoices}
          rowKey={(r) => r.id}
          zebra
        />
      )}
    </DashboardShell>
  );
}
