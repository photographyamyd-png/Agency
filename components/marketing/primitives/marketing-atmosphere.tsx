import { cn } from "@/lib/utils";

interface MarketingAtmosphereProps {
  className?: string;
  children?: React.ReactNode;
  intensity?: "hero" | "section" | "subtle";
}

export function MarketingAtmosphere({
  className,
  children,
  intensity = "section",
}: MarketingAtmosphereProps) {
  return (
    <div className={cn("relative overflow-hidden", className)}>
      <div className="mkt-dots absolute inset-0" aria-hidden />
      <div
        className={cn(
          "mkt-glow mkt-glow-indigo absolute inset-0",
          intensity === "hero" && "opacity-100",
          intensity === "section" && "opacity-80",
          intensity === "subtle" && "opacity-50"
        )}
        aria-hidden
      />
      <div className="mkt-glow mkt-glow-teal absolute inset-0" aria-hidden />
      <div className="mkt-glow mkt-glow-violet absolute inset-0" aria-hidden />
      {children && <div className="relative z-10">{children}</div>}
    </div>
  );
}
