import { requireClient } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { SectionTitle } from "@/components/ui/section-band";

export default async function ClientChecklistPage() {
  const session = await requireClient();
  const clientId = session.user.clientId!;

  const [accessItems, launchItems] = await Promise.all([
    prisma.accessChecklistItem.findMany({
      where: { clientId },
      orderBy: { requestedAt: "asc" },
    }),
    prisma.launchChecklistItem.findMany({
      where: { clientId },
      orderBy: { order: "asc" },
    }),
  ]);

  const items = [
    ...accessItems.map((i) => ({ id: i.id, label: i.label, status: i.status })),
    ...launchItems.map((i) => ({ id: i.id, label: i.label, status: i.status })),
  ];

  return (
    <div className="space-y-8">
      <div>
        <SectionTitle subtitle="Track setup and launch tasks for your project.">
          Your checklist
        </SectionTitle>
      </div>

      {items.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border-bright bg-surface-raised p-12 text-center">
          <p className="text-sm text-muted">
            No checklist items yet — they&apos;ll appear here as your project gets underway.
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {items.map((item) => (
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
    </div>
  );
}
