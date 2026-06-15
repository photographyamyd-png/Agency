import Link from "next/link";
import { UserPlus } from "lucide-react";
import { getLeads } from "@/lib/actions/leads";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { LeadKanban } from "@/components/leads/lead-kanban";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";

export default async function LeadsPage() {
  const leads = await getLeads();

  return (
    <DashboardShell
      title="Leads"
      description="Pipeline kanban — track prospects from first contact to won or lost"
      actions={
        <Button size="sm" asChild>
          <Link href="/leads/new">New Lead</Link>
        </Button>
      }
    >
      {leads.length === 0 ? (
        <EmptyState
          icon={UserPlus}
          title="No leads yet"
          description="Add leads manually from phone calls and referrals, or wait for intake form submissions in Phase 2."
          actionLabel="Add Lead"
          actionHref="/leads/new"
        />
      ) : (
        <LeadKanban leads={leads} />
      )}
    </DashboardShell>
  );
}
