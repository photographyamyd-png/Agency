import type { Lead } from "@prisma/client";
import {
  LEAD_STATUS_ORDER,
  LEAD_STATUS_LABELS,
} from "@/lib/constants/leads";
import { LeadKanbanCard } from "@/components/leads/lead-kanban-card";

type LeadWithMeta = Lead & {
  client: { id: string } | null;
  _count: { tasks: number };
};

interface LeadKanbanProps {
  leads: LeadWithMeta[];
}

export function LeadKanban({ leads }: LeadKanbanProps) {
  const byStatus = LEAD_STATUS_ORDER.reduce(
    (acc, status) => {
      acc[status] = leads.filter((l) => l.status === status);
      return acc;
    },
    {} as Record<string, LeadWithMeta[]>
  );

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {LEAD_STATUS_ORDER.map((status) => (
        <div
          key={status}
          className="flex w-64 shrink-0 flex-col rounded-lg border border-border bg-surface"
        >
          <div className="flex items-center justify-between border-b border-border px-3 py-2">
            <h3 className="text-xs font-medium uppercase tracking-wide text-muted">
              {LEAD_STATUS_LABELS[status]}
            </h3>
            <span className="text-xs tabular-nums text-muted">
              {byStatus[status].length}
            </span>
          </div>
          <div className="flex flex-col gap-2 p-2 min-h-[120px]">
            {byStatus[status].length === 0 ? (
              <p className="py-6 text-center text-xs text-muted">No leads</p>
            ) : (
              byStatus[status].map((lead) => (
                <LeadKanbanCard key={lead.id} lead={lead} />
              ))
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
