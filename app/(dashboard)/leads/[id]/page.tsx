import Link from "next/link";
import { notFound } from "next/navigation";
import { getLead, convertLeadToClientAction } from "@/lib/actions/leads";
import { LEAD_STATUS_LABELS } from "@/lib/constants/leads";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { LeadEditForm } from "@/components/leads/lead-edit-form";
import { DiscoveryCallForm } from "@/components/leads/discovery-call-form";
import { LeadTasksList } from "@/components/leads/lead-tasks-list";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SendOnboardingButton } from "@/components/leads/send-onboarding-button";
import { Separator } from "@/components/ui/separator";

interface LeadDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function LeadDetailPage({ params }: LeadDetailPageProps) {
  const { id } = await params;
  const lead = await getLead(id);

  if (!lead) {
    notFound();
  }

  const convertAction = convertLeadToClientAction;

  return (
    <DashboardShell
      title={lead.businessName}
      description={`${lead.contactName} · ${lead.email}`}
      actions={
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="muted">{LEAD_STATUS_LABELS[lead.status]}</Badge>
          {lead.client ? (
            <Button size="sm" variant="outline" asChild>
              <Link href={`/clients/${lead.client.id}`}>View client</Link>
            </Button>
          ) : (
            <>
              <form action={convertAction}>
                <input type="hidden" name="leadId" value={lead.id} />
                <Button size="sm" type="submit">
                  Convert to Client
                </Button>
              </form>
              <SendOnboardingButton leadId={lead.id} />
            </>
          )}
          <Button variant="outline" size="sm" asChild>
            <Link href="/leads">Back to pipeline</Link>
          </Button>
        </div>
      }
    >
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          <section>
            <h2 className="mb-4 text-sm font-medium text-foreground">Lead details</h2>
            <LeadEditForm lead={lead} />
          </section>

          <Separator />

          <section>
            <h2 className="mb-4 text-sm font-medium text-foreground">Discovery call</h2>
            <DiscoveryCallForm leadId={lead.id} discoveryCall={lead.discoveryCall} />
          </section>
        </div>

        <aside className="space-y-4">
          <div>
            <h2 className="mb-3 text-sm font-medium text-foreground">Tasks</h2>
            <LeadTasksList tasks={lead.tasks} />
          </div>
          <p className="text-xs text-muted tabular-nums">
            Created {new Date(lead.createdAt).toLocaleDateString()}
          </p>
        </aside>
      </div>
    </DashboardShell>
  );
}
