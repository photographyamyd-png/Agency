"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Search, X } from "lucide-react";
import { KpiCard } from "@/components/ui/kpi-card";
import { DataTable } from "@/components/ui/data-table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { formatCurrency } from "@/lib/format";

export interface AgencyViewData {
  kpis: {
    monthlyRevenue: number;
    activeClients: number;
    openInvoices: number;
    openLeads: number;
    connectedIntegrations: number;
  };
  clientRows: {
    id: string;
    name: string;
    status: string;
    mrr: number;
    health: "good" | "warning" | "critical";
    integrations: number;
  }[];
  revenueByMonth: { month: string; revenue: number }[];
}

interface AgencyViewProps {
  data: AgencyViewData;
}

const filterTags = ["Active", "Retainer", "Onboarding", "Overdue"];

const healthBadge = {
  good: "success" as const,
  warning: "warning" as const,
  critical: "danger" as const,
};

export function AgencyView({ data }: AgencyViewProps) {
  const [search, setSearch] = useState("");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const filtered = useMemo(() => {
    return data.clientRows.filter((c) => {
      const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase());
      const matchesFilter =
        activeFilters.length === 0 ||
        activeFilters.some((f) => c.status.toLowerCase().includes(f.toLowerCase()));
      return matchesSearch && matchesFilter;
    });
  }, [data.clientRows, search, activeFilters]);

  function toggleFilter(tag: string) {
    setActiveFilters((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const hasRevenue = data.revenueByMonth.some((m) => m.revenue > 0);

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          title="Monthly Revenue"
          value={formatCurrency(data.kpis.monthlyRevenue)}
          trend={
            data.kpis.monthlyRevenue > 0
              ? { direction: "up", label: "Collected this month" }
              : undefined
          }
        />
        <KpiCard
          title="Active Clients"
          value={String(data.kpis.activeClients)}
          trend={{ direction: "neutral", label: `${data.clientRows.length} total` }}
        />
        <KpiCard
          title="Open Invoices"
          value={String(data.kpis.openInvoices)}
          trend={
            data.kpis.openInvoices > 0
              ? { direction: "down", label: "Awaiting payment" }
              : undefined
          }
        />
        <KpiCard
          title="Open Leads"
          value={String(data.kpis.openLeads)}
          trend={{ direction: "neutral", label: "In pipeline" }}
        />
      </div>

      {hasRevenue && (
        <div className="rounded-lg border border-border bg-surface p-5">
          <h2 className="mb-4 text-sm font-medium text-foreground">Revenue</h2>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={data.revenueByMonth}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "var(--muted)" }} />
              <YAxis tick={{ fontSize: 12, fill: "var(--muted)" }} />
              <Tooltip
                contentStyle={{
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: "6px",
                  fontSize: 12,
                }}
                formatter={(v) => [formatCurrency(Number(v ?? 0)), "Revenue"]}
              />
              <Line type="monotone" dataKey="revenue" stroke="var(--accent)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-sm font-medium text-foreground">Client Database</h2>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <Input
              placeholder="Search clients..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {filterTags.map((tag) => (
            <button key={tag} type="button" onClick={() => toggleFilter(tag)}>
              <Badge variant={activeFilters.includes(tag) ? "default" : "muted"}>
                {tag}
                {activeFilters.includes(tag) && <X className="h-3 w-3" />}
              </Badge>
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <p className="text-sm text-muted py-8 text-center border border-dashed border-border rounded-lg">
            No clients yet.{" "}
            <Link href="/leads" className="text-accent hover:underline">
              Convert a lead
            </Link>{" "}
            to get started.
          </p>
        ) : (
          <DataTable
            columns={[
              {
                key: "select",
                header: "",
                width: "40px",
                render: (row) => (
                  <Checkbox
                    checked={selected.has(row.id)}
                    onCheckedChange={() => toggleSelect(row.id)}
                  />
                ),
              },
              {
                key: "name",
                header: "Client",
                width: "30%",
                render: (r) => (
                  <Link href={`/clients/${r.id}`} className="hover:text-accent">
                    {r.name}
                  </Link>
                ),
              },
              { key: "status", header: "Status", width: "20%", render: (r) => r.status },
              {
                key: "mrr",
                header: "MRR",
                width: "12%",
                render: (r) => (r.mrr > 0 ? formatCurrency(r.mrr) : "—"),
              },
              {
                key: "integrations",
                header: "Integrations",
                width: "12%",
                render: (r) => r.integrations,
              },
              {
                key: "health",
                header: "Health",
                width: "12%",
                render: (r) => (
                  <Badge variant={healthBadge[r.health]}>{r.health}</Badge>
                ),
              },
            ]}
            data={filtered}
            rowKey={(r) => r.id}
            zebra
          />
        )}
      </div>
    </div>
  );
}
