import { cn } from "@/lib/utils";

interface PopSurfaceProps {
  children: React.ReactNode;
  className?: string;
  lift?: boolean;
  accent?: "orange" | "gold";
}

/** Simple surface card — brand accent top edge only */
export function PopSurface({
  children,
  className,
  lift = true,
  accent = "orange",
}: PopSurfaceProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border border-[var(--mkt-border)] bg-[var(--mkt-paper)]",
        lift && "shadow-[0_20px_40px_-12px_rgba(12,14,18,0.12)] transition-transform duration-250 hover:-translate-y-1",
        className
      )}
    >
      <span
        className="absolute inset-x-0 top-0 h-[3px]"
        style={{
          background:
            accent === "gold" ? "var(--mkt-orange-bright)" : "var(--mkt-orange)",
        }}
        aria-hidden
      />
      {children}
    </div>
  );
}
