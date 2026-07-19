import Link from "next/link";
import { getClientsForProposal } from "@/lib/actions/proposals";
import { PRICING_PACKAGES } from "@/lib/blueprint/pricing-packages";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/format";
import { createProposal } from "@/lib/actions/proposals";

export const dynamic = "force-dynamic";

export default async function NewProposalPage() {
  const clients = await getClientsForProposal();

  return (
    <DashboardShell
      title="New Proposal"
      description="Select a client and pricing package from blueprint §14"
      actions={
        <Button variant="outline" size="sm" asChild>
          <Link href="/proposals">Back</Link>
        </Button>
      }
    >
      <div className="grid gap-6 lg:grid-cols-2">
        {PRICING_PACKAGES.map((pkg) => (
          <div key={pkg.id} className="rounded-xl border border-border-bright bg-surface-raised p-6 space-y-4">
            <div>
              <h3 className="font-medium">{pkg.name}</h3>
              <p className="text-sm text-muted mt-1">
                {formatCurrency(pkg.priceMin)}–{formatCurrency(pkg.priceMax)}
                {pkg.unit === "monthly" ? "/mo" : " flat"}
              </p>
            </div>
            <p className="text-sm text-muted">{pkg.scopeIncluded}</p>
            <ul className="text-xs text-muted space-y-1">
              {pkg.lineItems.map((item) => (
                <li key={item.description}>• {item.description} — {formatCurrency(item.unitPrice)}</li>
              ))}
            </ul>
            {clients.length > 0 ? (
              <form action={createProposal} className="flex gap-2">
                <select name="clientId" required className="h-9 flex-1 rounded-md border border-border px-3 text-sm">
                  <option value="">Select client</option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>{c.legalBusinessName}</option>
                  ))}
                </select>
                <input type="hidden" name="packageId" value={pkg.id} />
                <Button type="submit" size="sm">Create</Button>
              </form>
            ) : (
              <p className="text-sm text-muted">Convert a lead to client first.</p>
            )}
          </div>
        ))}
      </div>
    </DashboardShell>
  );
}
