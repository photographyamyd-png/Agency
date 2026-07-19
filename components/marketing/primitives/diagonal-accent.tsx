import { cn } from "@/lib/utils";

interface DiagonalAccentProps {
  className?: string;
}

/** Decorative skewed orange band — absolute, low z-index */
export function DiagonalAccent({ className }: DiagonalAccentProps) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute left-[-10%] top-1/3 z-0 h-16 w-[70%] -rotate-[8deg] bg-[var(--mkt-accent)] opacity-[0.12]",
        className
      )}
      aria-hidden
    />
  );
}
