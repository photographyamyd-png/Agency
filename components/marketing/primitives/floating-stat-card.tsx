import { cn } from "@/lib/utils";

interface FloatingStatCardProps {
  label: string;
  value: string;
  hint?: string;
  className?: string;
}

export function FloatingStatCard({ label, value, hint, className }: FloatingStatCardProps) {
  return (
    <div className={cn("mkt-float-card p-5", className)}>
      <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--mkt-accent)]">
        {label}
      </p>
      <p className="mt-1 font-display text-2xl font-bold tabular-nums tracking-tight text-[var(--mkt-orange)]">
        {value}
      </p>
      {hint && <p className="mt-1 text-xs text-[var(--mkt-muted)]">{hint}</p>}
    </div>
  );
}
