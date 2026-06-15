import Link from "next/link";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { NewLeadForm } from "@/components/leads/new-lead-form";
import { Button } from "@/components/ui/button";

export default function NewLeadPage() {
  return (
    <DashboardShell
      title="New Lead"
      description="Manually add a lead from a phone call, referral, or networking event"
      actions={
        <Button variant="outline" size="sm" asChild>
          <Link href="/leads">Back to pipeline</Link>
        </Button>
      }
    >
      <NewLeadForm />
    </DashboardShell>
  );
}
