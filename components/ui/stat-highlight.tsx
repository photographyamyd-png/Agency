import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatHighlightProps {
  stat: string;
  label: string;
  className?: string;
}

export function StatHighlight({ stat, label, className }: StatHighlightProps) {
  const hasArrow = stat.includes("→");

  return (
    <div
      className={cn(
        "rounded-xl border border-border-bright bg-surface-raised p-6 text-center shadow-lg shadow-black/30 transition-transform hover:-translate-y-0.5",
        className
      )}
    >
      <p className="flex items-center justify-center gap-2 text-3xl font-bold tabular-nums text-accent-bright sm:text-4xl">
        {hasArrow ? (
          <>
            <span>{stat.split("→")[0]?.trim()}</span>
            <ArrowRight className="h-6 w-6 shrink-0 text-accent" />
            <span>{stat.split("→")[1]?.trim()}</span>
          </>
        ) : (
          stat
        )}
      </p>
      <p className="mt-2 text-sm text-muted">{label}</p>
    </div>
  );
}
