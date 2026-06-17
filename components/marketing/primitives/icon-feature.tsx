import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface IconFeatureProps {
  icon: LucideIcon;
  title: string;
  description: string;
  className?: string;
}

export function IconFeature({ icon: Icon, title, description, className }: IconFeatureProps) {
  return (
    <div className={cn("flex gap-4", className)}>
      <div className="mkt-icon-box">
        <Icon className="h-5 w-5" strokeWidth={1.75} />
      </div>
      <div>
        <h3 className="font-display text-lg font-bold uppercase tracking-tight text-[var(--mkt-text)]">
          {title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-[var(--mkt-muted)]">{description}</p>
      </div>
    </div>
  );
}
