import { ArrowDown, ArrowUp, Minus, type LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type TrendDirection = "up" | "down" | "neutral";

export interface KpiCardProps {
  title: string;
  value: string | number;
  trend?: {
    direction: TrendDirection;
    label: string;
  };
  action?: React.ReactNode;
  className?: string;
}

const trendIcons: Record<TrendDirection, LucideIcon> = {
  up: ArrowUp,
  down: ArrowDown,
  neutral: Minus,
};

const trendVariants: Record<TrendDirection, "success" | "danger" | "muted"> = {
  up: "success",
  down: "danger",
  neutral: "muted",
};

export function KpiCard({
  title,
  value,
  trend,
  action,
  className,
}: KpiCardProps) {
  const TrendIcon = trend ? trendIcons[trend.direction] : null;

  return (
    <div
      className={cn(
        "rounded-lg border border-border-bright bg-surface-raised p-5 flex flex-col gap-3 shadow-lg shadow-black/20",
        className
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs font-medium uppercase tracking-wide text-muted">
          {title}
        </p>
        {action}
      </div>
      <p className="text-3xl font-bold tracking-tight tabular-nums text-accent-bright">
        {value}
      </p>
      {trend && TrendIcon && (
        <Badge variant={trendVariants[trend.direction]}>
          <TrendIcon className="h-3 w-3" />
          {trend.label}
        </Badge>
      )}
    </div>
  );
}
