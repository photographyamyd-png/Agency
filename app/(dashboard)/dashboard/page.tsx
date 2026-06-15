import Link from "next/link";
import { Suspense } from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { ViewToggle } from "@/components/view-toggle/view-toggle";
import { AgencyView } from "@/components/dashboard/agency-view";
import { ClientView } from "@/components/dashboard/client-view";
import { Button } from "@/components/ui/button";
import { KpiSkeletonGrid } from "@/components/ui/skeleton";
import { getAgencyDashboardData } from "@/lib/data/dashboard";
import { getCrossClientMetrics } from "@/lib/data/dashboard";

export const dynamic = "force-dynamic";

interface DashboardPageProps {
  searchParams: Promise<{ view?: string }>;
}

async function DashboardAgency() {
  const data = await getAgencyDashboardData();
  return <AgencyView data={data} />;
}

async function DashboardClient() {
  const [dash, metrics] = await Promise.all([
    getAgencyDashboardData(),
    getCrossClientMetrics(),
  ]);

  return (
    <ClientView
      data={{
        kpis: {
          totalLeads: dash.kpis.openLeads,
          rankWins: metrics.rankWins.length,
          totalSessions: dash.totalSessions,
          reportsSent: metrics.clientCount,
        },
        campaignData: metrics.trafficByClient.map((c) => ({
          name: c.name,
          leads: c.sessions,
        })),
        activities: dash.activities,
      }}
    />
  );
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const params = await searchParams;
  const view = params.view === "client" ? "client" : "agency";

  return (
    <DashboardShell
      title="Dashboard"
      description="Your daily digest and performance overview"
      actions={
        <>
          <Suspense fallback={null}>
            <ViewToggle />
          </Suspense>
          <ThemeToggle />
          <Button size="sm" asChild>
            <Link href="/leads/new">New Lead</Link>
          </Button>
        </>
      }
    >
      <Suspense fallback={<KpiSkeletonGrid count={4} />}>
        {view === "client" ? <DashboardClient /> : <DashboardAgency />}
      </Suspense>
    </DashboardShell>
  );
}
