import { cn } from "@/lib/utils";

export type SectionBand = "paper" | "stone" | "ink";

interface SectionShellProps {
  id?: string;
  band?: SectionBand;
  /** @deprecated use band */
  tone?: "light" | "dark";
  className?: string;
  children: React.ReactNode;
  diagonalTop?: boolean;
  diagonalBottom?: boolean;
}

function resolveBand(band?: SectionBand, tone?: "light" | "dark"): SectionBand {
  if (band) return band;
  if (tone === "dark") return "stone";
  return "paper";
}

export function SectionShell({
  id,
  band,
  tone,
  className,
  children,
  diagonalTop = false,
  diagonalBottom = false,
}: SectionShellProps) {
  const resolved = resolveBand(band, tone);

  return (
    <section
      id={id}
      className={cn(
        "relative overflow-hidden py-28 lg:py-40",
        resolved === "paper" && "mkt-band-paper",
        resolved === "stone" && "mkt-band-stone",
        resolved === "ink" && "mkt-band-ink",
        diagonalTop && "mkt-cut-diagonal-top",
        diagonalBottom && "mkt-cut-diagonal-bottom",
        className
      )}
    >
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

export function ZigZagRow({ children, image, reverse = false, className }: ZigZagProps) {
  return (
    <div className={cn("grid items-center gap-12 lg:grid-cols-12 lg:gap-20", className)}>
      <div className={cn("lg:col-span-6", reverse ? "lg:order-2" : "lg:order-1")}>{image}</div>
      <div className={cn("lg:col-span-6", reverse ? "lg:order-1" : "lg:order-2")}>{children}</div>
    </div>
  );
}
