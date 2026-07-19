import { cn } from "@/lib/utils";

interface MarketingAtmosphereProps {
  className?: string;
  children?: React.ReactNode;
  intensity?: "hero" | "section" | "subtle";
}

/** Subtle warm glow — no rainbow mesh */
export function MarketingAtmosphere({
  className,
  children,
  intensity = "section",
}: MarketingAtmosphereProps) {
  return (
    <div className={cn("relative overflow-hidden", className)}>
      <div
        className={cn(
          "pointer-events-none absolute inset-0",
          intensity === "hero" && "opacity-100",
          intensity === "section" && "opacity-70",
          intensity === "subtle" && "opacity-40"
        )}
        style={{
          background:
            "radial-gradient(ellipse 50% 40% at 80% 20%, rgba(232, 93, 4, 0.12) 0%, transparent 70%)",
        }}
        aria-hidden
      />
      {children && <div className="relative z-10">{children}</div>}
    </div>
  );
}
