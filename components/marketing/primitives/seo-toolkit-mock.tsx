import { BarChart3, FileText, Globe, MapPin, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

type ToolkitVariant = "website" | "seo" | "reporting";

interface SeoToolkitMockProps {
  className?: string;
  variant?: ToolkitVariant;
}

const VARIANTS: Record<
  ToolkitVariant,
  { title: string; icon: typeof Globe; rows: { label: string; value: string; hot?: boolean }[] }
> = {
  website: {
    title: "Site health",
    icon: Globe,
    rows: [
      { label: "Mobile speed", value: "94", hot: true },
      { label: "Call CTA above fold", value: "Pass", hot: true },
      { label: "Core pages live", value: "12" },
      { label: "Broken links", value: "0" },
    ],
  },
  seo: {
    title: "Local SEO",
    icon: MapPin,
    rows: [
      { label: "general contractor near me", value: "#5", hot: true },
      { label: "concrete driveway [town]", value: "#4", hot: true },
      { label: "Maps pack visibility", value: "Top 3", hot: true },
      { label: "GBP completeness", value: "100%" },
    ],
  },
  reporting: {
    title: "Weekly report",
    icon: FileText,
    rows: [
      { label: "Site visits (90d)", value: "+23%", hot: true },
      { label: "Call clicks", value: "+2×", hot: true },
      { label: "Keywords up", value: "18" },
      { label: "Issues fixed", value: "6" },
    ],
  },
};

/** Semrush-style toolkit frame — original HTML/CSS, brand colors */
export function SeoToolkitMock({ className, variant = "seo" }: SeoToolkitMockProps) {
  const config = VARIANTS[variant];
  const Icon = config.icon;
  const nav = [
    { id: "website" as const, icon: Globe, label: "Site" },
    { id: "seo" as const, icon: MapPin, label: "SEO" },
    { id: "reporting" as const, icon: BarChart3, label: "Report" },
  ];

  return (
    <div
      className={cn(
        "flex overflow-hidden border border-[var(--mkt-border)] bg-white shadow-[0_20px_44px_-16px_rgba(12,14,18,0.18)]",
        className
      )}
      aria-hidden
    >
      {/* Sidebar */}
      <aside className="flex w-14 shrink-0 flex-col gap-1 border-r border-[var(--mkt-border)] bg-[var(--mkt-ink)] py-3 sm:w-16">
        {nav.map(({ id, icon: NavIcon, label }) => {
          const active = id === variant;
          return (
            <div
              key={id}
              className={cn(
                "mx-1.5 flex flex-col items-center gap-0.5 px-1 py-2",
                active ? "bg-[var(--mkt-accent)] text-white" : "text-white/45"
              )}
            >
              <NavIcon className="h-4 w-4" strokeWidth={1.75} />
              <span className="text-[8px] font-semibold uppercase tracking-wide">{label}</span>
            </div>
          );
        })}
      </aside>

      {/* Main panel */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between border-b border-[var(--mkt-border)] px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center bg-[var(--mkt-accent-soft)] text-[var(--mkt-accent)]">
              <Icon className="h-3.5 w-3.5" />
            </span>
            <div>
              <p className="text-xs font-bold text-[var(--mkt-text)]">{config.title}</p>
              <p className="text-[10px] text-[var(--mkt-muted)]">Live overview</p>
            </div>
          </div>
          <div className="flex items-center gap-1 bg-[var(--mkt-orange-muted)] px-2 py-1 text-[10px] font-bold text-[var(--mkt-orange-deep)]">
            <TrendingUp className="h-3 w-3" />
            Up
          </div>
        </div>

        {/* Score + mini chart */}
        <div className="grid grid-cols-5 gap-3 border-b border-[var(--mkt-border)] px-4 py-4">
          <div className="col-span-2 flex flex-col items-center justify-center">
            <div className="relative flex h-16 w-16 items-center justify-center rounded-full border-[3px] border-[var(--mkt-accent)]">
              <span className="text-lg font-bold tabular-nums text-[var(--mkt-text)]">86</span>
            </div>
            <p className="mt-1.5 text-[9px] font-semibold uppercase tracking-wider text-[var(--mkt-muted)]">
              Visibility
            </p>
          </div>
          <div className="col-span-3 flex items-end gap-1 pb-1">
            {[40, 55, 48, 70, 62, 78, 85, 72, 90, 88].map((h, i) => (
              <div
                key={i}
                className="flex-1 bg-[var(--mkt-accent)] opacity-70"
                style={{ height: `${Math.round(h * 0.55)}px` }}
              />
            ))}
          </div>
        </div>

        {/* Keyword / metric rows */}
        <ul className="divide-y divide-[var(--mkt-border)]">
          {config.rows.map((row) => (
            <li key={row.label} className="flex items-center justify-between gap-3 px-4 py-2.5">
              <span className="truncate text-xs text-[var(--mkt-muted)]">{row.label}</span>
              <span
                className={cn(
                  "shrink-0 text-xs font-bold tabular-nums",
                  row.hot ? "text-[var(--mkt-orange)]" : "text-[var(--mkt-text)]"
                )}
              >
                {row.value}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
