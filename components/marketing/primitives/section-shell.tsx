import { cn } from "@/lib/utils";
import { MarketingAtmosphere } from "@/components/marketing/primitives/marketing-atmosphere";

export type SectionTone = "light" | "dark";

interface SectionShellProps {
  id?: string;
  tone?: SectionTone;
  className?: string;
  children: React.ReactNode;
  overlap?: boolean;
  zig?: "left" | "right" | "none";
}

export function SectionShell({
  id,
  tone = "dark",
  className,
  children,
  overlap = false,
}: SectionShellProps) {
  const isDark = tone === "dark";

  return (
    <section
      id={id}
      className={cn(
        "relative overflow-hidden py-24 lg:py-32",
        isDark ? "mkt-band-dark text-foreground" : "mkt-band-light",
        overlap && "mkt-section-overlap",
        className
      )}
    >
      {isDark && <MarketingAtmosphere intensity="section" className="absolute inset-0" />}
      {!isDark && <div className="mkt-light-mesh absolute inset-0" aria-hidden />}
      <div className="relative z-10">{children}</div>
    </section>
  );
}

interface ZigZagProps {
  children: React.ReactNode;
  image: React.ReactNode;
  reverse?: boolean;
  className?: string;
}

/** Two-column zig-zag: flips image left/right per section */
export function ZigZagRow({ children, image, reverse = false, className }: ZigZagProps) {
  return (
    <div
      className={cn(
        "grid items-center gap-12 lg:grid-cols-12 lg:gap-16",
        className
      )}
    >
      <div className={cn("lg:col-span-6", reverse ? "lg:order-2" : "lg:order-1")}>
        {image}
      </div>
      <div className={cn("lg:col-span-6", reverse ? "lg:order-1" : "lg:order-2")}>
        {children}
      </div>
    </div>
  );
}
