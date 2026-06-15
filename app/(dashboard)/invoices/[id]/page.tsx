import Link from "next/link";
import { notFound } from "next/navigation";
import { getInvoice } from "@/lib/actions/invoices";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SendInvoiceButton } from "@/components/invoices/send-invoice-button";
import { formatCurrency, formatInvoiceStatus } from "@/lib/format";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

const statusVariant: Record<string, "default" | "success" | "warning" | "danger" | "muted"> = {
  DRAFT: "muted",
  SENT: "default",
  PARTIALLY_PAID: "warning",
  PAID: "success",
  OVERDUE: "danger",
  CANCELLED: "muted",
  REFUNDED: "muted",
};

export default async function InvoiceDetailPage({ params }: PageProps) {
  const { id } = await params;
  const invoice = await getInvoice(id);
  if (!invoice) notFound();

  const canSend = invoice.status === "DRAFT" || invoice.status === "SENT";

  return (
    <DashboardShell
      title={`Invoice — ${invoice.client.legalBusinessName}`}
      description={`${formatInvoiceStatus(invoice.type)} · ${formatCurrency(Number(invoice.totalAmount), invoice.currency)}`}
      actions={
        <Button variant="outline" size="sm" asChild>
          <Link href="/invoices">Back to invoices</Link>
        </Button>
      }
    >
      <div className="max-w-2xl space-y-6">
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant={statusVariant[invoice.status] ?? "muted"}>
            {formatInvoiceStatus(invoice.status)}
          </Badge>
          {invoice.dueDate && (
            <span className="text-sm text-muted">
              Due {new Date(invoice.dueDate).toLocaleDateString()}
            </span>
          )}
        </div>

        {canSend && <SendInvoiceButton invoiceId={invoice.id} />}

        <section className="rounded-lg border border-border">
          <h2 className="border-b border-border px-5 py-3 text-sm font-medium">Line items</h2>
          <ul className="divide-y divide-border">
            {invoice.lineItems.map((item) => (
              <li key={item.id} className="flex justify-between px-5 py-3 text-sm">
                <span>{item.description}</span>
                <span className="tabular-nums">
                  {formatCurrency(Number(item.total), invoice.currency)}
                </span>
              </li>
            ))}
          </ul>
          <div className="flex justify-between border-t border-border px-5 py-3 font-medium text-sm">
            <span>Total</span>
            <span>{formatCurrency(Number(invoice.totalAmount), invoice.currency)}</span>
          </div>
        </section>

        {invoice.payments.length > 0 && (
          <section className="rounded-lg border border-border">
            <h2 className="border-b border-border px-5 py-3 text-sm font-medium">Payments</h2>
            <ul className="divide-y divide-border">
              {invoice.payments.map((p) => (
                <li key={p.id} className="flex justify-between px-5 py-3 text-sm">
                  <span>
                    {p.method ?? "Payment"} · {new Date(p.paidAt).toLocaleDateString()}
                  </span>
                  <span className="tabular-nums">
                    {formatCurrency(Number(p.amount), invoice.currency)}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}

        <p className="text-sm text-muted">
          Client:{" "}
          <Link href={`/clients/${invoice.clientId}`} className="text-accent hover:underline">
            {invoice.client.legalBusinessName}
          </Link>
        </p>
      </div>
    </DashboardShell>
  );
}
