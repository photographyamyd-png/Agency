import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface IconFeatureProps {
  icon: LucideIcon;
  title: string;
  description: string;
  className?: string;
  light?: boolean;
}

export function IconFeature({
  icon: Icon,
  title,
  description,
  className,
  light,
}: IconFeatureProps) {
  return (
    <div className={cn("flex gap-4", className)}>
      <div className="mkt-icon-box">
        <Icon className="h-5 w-5" strokeWidth={1.75} />
      </div>
      <div>
        <h3
          className={cn(
            "font-display text-lg font-bold tracking-tight",
            light ? "text-white" : "text-[var(--mkt-text)]"
          )}
        >
          {title}
        </h3>
        <p
          className={cn(
            "mt-2 text-sm leading-relaxed",
            light ? "text-white/65" : "text-[var(--mkt-muted)]"
          )}
        >
          {description}
        </p>
      </div>
    </div>
  );
}
