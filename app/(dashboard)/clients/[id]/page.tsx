import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/session";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { ClientWorkspaceTabs } from "@/components/clients/client-workspace-tabs";
import { Button } from "@/components/ui/button";

interface ClientPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab?: string }>;
}

export default async function ClientDetailPage({
  params,
  searchParams,
}: ClientPageProps) {
  await requireAdmin();
  const { id } = await params;
  const { tab = "overview" } = await searchParams;

  const client = await prisma.client.findUnique({
    where: { id },
    include: {
      lead: { select: { id: true, businessName: true } },
      brandProfile: true,
      portalUser: { select: { email: true, lastLoginAt: true } },
      accessItems: { orderBy: { requestedAt: "asc" } },
      launchChecklist: { orderBy: { order: "asc" } },
      weeklyReports: { orderBy: { createdAt: "desc" }, take: 5 },
      integrations: true,
      keywords: {
        include: {
          rankSnapshots: { orderBy: { capturedAt: "desc" }, take: 2 },
        },
        take: 5,
      },
      systemEvents: { orderBy: { createdAt: "desc" }, take: 10 },
    },
  });

  if (!client) {
    notFound();
  }

  return (
    <DashboardShell
      title={client.legalBusinessName}
      description="Client workspace"
      actions={
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/clients">Back to clients</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href={`/clients/${client.id}/integrations`}>Integrations</Link>
          </Button>
        </div>
      }
    >
      <ClientWorkspaceTabs client={client} activeTab={tab} />
    </DashboardShell>
  );
}
