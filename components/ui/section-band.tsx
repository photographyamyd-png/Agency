import { cn } from "@/lib/utils";

type BandVariant = "a" | "b" | "accent";

const bandClasses: Record<BandVariant, string> = {
  a: "bg-band-a border-y border-border-bright",
  b: "bg-band-b border-y border-border-bright",
  accent: "bg-band-accent border-y border-border-bright",
};

interface SectionBandProps {
  variant?: BandVariant;
  id?: string;
  className?: string;
  children: React.ReactNode;
}

export function SectionBand({
  variant = "a",
  id,
  className,
  children,
}: SectionBandProps) {
  return (
    <section id={id} className={cn(bandClasses[variant], className)}>
      {children}
    </section>
  );
}

interface SectionTitleProps {
  children: React.ReactNode;
  subtitle?: string;
  className?: string;
}

export function SectionTitle({ children, subtitle, className }: SectionTitleProps) {
  return (
    <div className={className}>
      <h2 className="border-l-4 border-accent pl-4 text-3xl font-bold tracking-tight sm:text-4xl">
        {children}
      </h2>
      {subtitle && (
        <p className="mt-3 max-w-xl text-muted leading-relaxed">{subtitle}</p>
      )}
    </div>
  );
}
