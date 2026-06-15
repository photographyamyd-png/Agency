"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ChevronDown, ChevronUp } from "lucide-react";
import { KpiCard } from "@/components/ui/kpi-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export interface ClientViewData {
  kpis: {
    totalLeads: number;
    rankWins: number;
    totalSessions: number;
    reportsSent: number;
  };
  campaignData: { name: string; leads: number }[];
  activities: {
    id: string;
    time: string;
    event: string;
    type: "success" | "default" | "danger";
  }[];
}

const activityVariant = {
  success: "success" as const,
  default: "muted" as const,
  danger: "danger" as const,
};

function formatRelativeTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function ClientView({ data }: { data: ClientViewData }) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2">
        <KpiCard title="Open Leads" value={String(data.kpis.totalLeads)} />
        <KpiCard title="Rank Improvements" value={String(data.kpis.rankWins)} />
        <KpiCard title="Total Sessions (synced)" value={String(data.kpis.totalSessions)} />
        <KpiCard title="Reports Sent" value={String(data.kpis.reportsSent)} />
      </div>

      {data.campaignData.length > 0 && (
        <div className="rounded-lg border border-border bg-surface p-5">
          <h2 className="mb-4 text-sm font-medium text-foreground">Traffic by Client</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data.campaignData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: "var(--muted)" }} />
              <YAxis tick={{ fontSize: 12, fill: "var(--muted)" }} />
              <Tooltip
                contentStyle={{
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: "6px",
                  fontSize: 12,
                }}
              />
              <Bar dataKey="leads" fill="var(--accent)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="rounded-lg border border-border bg-surface">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="text-sm font-medium text-foreground">Recent Activity</h2>
        </div>
        {data.activities.length === 0 ? (
          <p className="px-5 py-8 text-sm text-muted text-center">No activity yet.</p>
        ) : (
          <ul className="divide-y divide-border">
            {data.activities.map((item) => (
              <li key={item.id} className="flex items-start gap-4 px-5 py-4">
                <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-accent" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-foreground">{item.event}</p>
                  <p className="mt-0.5 text-xs text-muted">{formatRelativeTime(item.time)}</p>
                </div>
                <Badge variant={activityVariant[item.type]} className="shrink-0">
                  {item.type === "success" ? "Win" : item.type === "danger" ? "Alert" : "Update"}
                </Badge>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="rounded-lg border border-border bg-surface">
        <button
          type="button"
          onClick={() => setShowDetails(!showDetails)}
          className="flex w-full items-center justify-between px-5 py-4 text-sm font-medium text-foreground hover:bg-surface/80"
        >
          Agency Overview
          {showDetails ? (
            <ChevronUp className="h-4 w-4 text-muted" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted" />
          )}
        </button>
        {showDetails && (
          <div className="border-t border-border px-5 py-4 space-y-3">
            <p className="text-sm text-muted">
              This view aggregates activity across all clients — rank wins, syncs, reports, and onboarding events.
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link href="/metrics">View Metrics</Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href="/leads">View Leads</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
