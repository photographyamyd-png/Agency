import { cn } from "@/lib/utils";

type Band = "paper" | "stone" | "ink";

interface SectionShellProps {
  id?: string;
  band?: Band;
  className?: string;
  children: React.ReactNode;
}

const bandClass: Record<Band, string> = {
  paper: "mkt-band-paper",
  stone: "mkt-band-stone",
  ink: "mkt-band-ink",
};

export function SectionShell({
  id,
  band = "paper",
  className,
  children,
}: SectionShellProps) {
  return (
    <section
      id={id}
      className={cn("py-24 lg:py-32", bandClass[band], className)}
    >
      {children}
    </section>
  );
}
