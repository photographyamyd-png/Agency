import Link from "next/link";
import { createInvoice, getClientsForInvoiceSelect } from "@/lib/actions/invoices";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const dynamic = "force-dynamic";

export default async function NewInvoicePage() {
  const clients = await getClientsForInvoiceSelect();

  return (
    <DashboardShell
      title="New Invoice"
      description="Create a draft invoice and send via Stripe"
      actions={
        <Button variant="outline" size="sm" asChild>
          <Link href="/invoices">Back to invoices</Link>
        </Button>
      }
    >
      {clients.length === 0 ? (
        <p className="text-sm text-muted">
          No clients yet.{" "}
          <Link href="/leads" className="text-accent hover:underline">
            Convert a lead
          </Link>{" "}
          first.
        </p>
      ) : (
        <form action={createInvoice} className="max-w-lg space-y-4 rounded-lg border border-border p-5">
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Client</label>
            <select
              name="clientId"
              required
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
            >
              <option value="">Select client…</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.legalBusinessName}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">Type</label>
            <select
              name="type"
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
            >
              <option value="ONE_OFF">One-off</option>
              <option value="RETAINER">Retainer</option>
              <option value="DEPOSIT">Deposit</option>
              <option value="MILESTONE">Milestone</option>
              <option value="FINAL">Final</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">Description</label>
            <Input name="description" placeholder="Website build — Phase 1" required />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">Amount (CAD)</label>
            <Input name="amount" type="number" step="0.01" min="0.01" placeholder="1500.00" required />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">Due date (optional)</label>
            <Input name="dueDate" type="date" />
          </div>

          <Button type="submit">Create draft invoice</Button>
        </form>
      )}
    </DashboardShell>
  );
}
