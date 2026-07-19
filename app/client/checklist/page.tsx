import { requireClient } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { SectionTitle } from "@/components/ui/section-band";

export default async function ClientChecklistPage() {
  const session = await requireClient();
  const clientId = session.user.clientId!;

  const [accessItems, launchItems, maintenanceChecklist] = await Promise.all([
    prisma.accessChecklistItem.findMany({
      where: { clientId },
      orderBy: { requestedAt: "asc" },
    }),
    prisma.launchChecklistItem.findMany({
      where: { clientId },
      orderBy: { order: "asc" },
    }),
    prisma.maintenanceChecklist.findFirst({
      where: { clientId },
      orderBy: { periodYear: "desc" },
      include: { items: { orderBy: { order: "asc" } } },
    }),
  ]);

  const setupItems = [
    ...accessItems.map((i) => ({ id: i.id, label: i.label, status: i.status })),
    ...launchItems.map((i) => ({ id: i.id, label: i.label, status: i.status })),
  ];

  return (
    <div className="space-y-8">
      <div>
        <SectionTitle subtitle="Track setup, launch, and monthly maintenance tasks for your project.">
          Your checklist
        </SectionTitle>
      </div>

      <section className="space-y-3">
        <h2 className="text-sm font-medium">Setup &amp; launch</h2>
        {setupItems.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border-bright bg-surface-raised p-8 text-center">
            <p className="text-sm text-muted">
              No setup items yet — they&apos;ll appear here as your project gets underway.
            </p>
          </div>
        ) : (
          <ul className="space-y-3">
            {setupItems.map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between rounded-xl border border-border-bright bg-surface-raised px-4 py-4 text-sm shadow-lg shadow-black/20"
              >
                <span>{item.label}</span>
                <Badge
                  variant={
                    item.status === "DONE" || item.status === "TESTED"
                      ? "success"
                      : "muted"
                  }
                >
                  {String(item.status).replace(/_/g, " ")}
                </Badge>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-medium">Monthly maintenance (read-only)</h2>
        {!maintenanceChecklist ? (
          <p className="text-sm text-muted">
            Your monthly maintenance checklist will appear here once your retainer cycle begins.
          </p>
        ) : (
          <>
            <p className="text-xs text-muted">
              {maintenanceChecklist.periodMonth}/{maintenanceChecklist.periodYear} —{" "}
              {maintenanceChecklist.items.filter((i) => i.status === "DONE").length}/
              {maintenanceChecklist.items.length} complete
            </p>
            <ul className="space-y-3">
              {maintenanceChecklist.items.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center justify-between rounded-xl border border-border-bright bg-surface-raised px-4 py-4 text-sm"
                >
                  <div>
                    <Badge variant="muted" className="mr-2 text-xs">{item.category}</Badge>
                    <span className={item.status === "DONE" ? "line-through text-muted" : ""}>
                      {item.label}
                    </span>
                  </div>
                  <Badge variant={item.status === "DONE" ? "success" : "muted"}>
                    {item.status}
                  </Badge>
                </li>
              ))}
            </ul>
          </>
        )}
      </section>
    </div>
  );
}
