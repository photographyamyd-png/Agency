"use client";

import { useTransition } from "react";
import Link from "next/link";
import type { Lead, LeadStatus } from "@prisma/client";
import { updateLeadStatus } from "@/lib/actions/leads";
import { LEAD_STATUS_LABELS, LOSS_REASONS } from "@/lib/constants/leads";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type LeadWithMeta = Lead & {
  client: { id: string } | null;
  _count: { tasks: number };
};

interface LeadKanbanCardProps {
  lead: LeadWithMeta;
}

export function LeadKanbanCard({ lead }: LeadKanbanCardProps) {
  const [pending, startTransition] = useTransition();

  function handleStatusChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const status = e.target.value as LeadStatus;
    if (status === "LOST") {
      const reason = window.prompt(
        `Loss reason required:\n${LOSS_REASONS.join(", ")}`
      );
      if (!reason) {
        e.target.value = lead.status;
        return;
      }
      startTransition(async () => {
        await updateLeadStatus({ id: lead.id, status, lossReason: reason });
      });
      return;
    }
    startTransition(async () => {
      await updateLeadStatus({ id: lead.id, status });
    });
  }

  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-background p-3 space-y-2 transition-opacity",
        pending && "opacity-60"
      )}
    >
      <Link href={`/leads/${lead.id}`} className="block group">
        <p className="text-sm font-medium truncate group-hover:text-accent">
          {lead.businessName}
        </p>
        <p className="text-xs text-muted truncate">{lead.contactName}</p>
      </Link>
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs text-muted tabular-nums">
          {lead._count.tasks} tasks
        </span>
        {lead.client && (
          <Badge variant="success" className="text-[10px]">
            Client
          </Badge>
        )}
      </div>
      <select
        value={lead.status}
        onChange={handleStatusChange}
        disabled={pending}
        className="h-7 w-full rounded-md border border-border bg-surface px-2 text-xs text-foreground"
        aria-label="Change lead status"
      >
        {Object.entries(LEAD_STATUS_LABELS).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
    </div>
  );
}
