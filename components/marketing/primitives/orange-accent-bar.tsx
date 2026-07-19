import { cn } from "@/lib/utils";

interface OrangeAccentBarProps {
  className?: string;
  variant?: "horizontal" | "vertical";
}

/** Thin accent strip — brand purple chrome */
export function OrangeAccentBar({ className, variant = "horizontal" }: OrangeAccentBarProps) {
  return (
    <span
      className={cn(
        "block shrink-0 bg-[var(--mkt-accent)]",
        variant === "vertical" ? "w-1 self-stretch min-h-[3rem] rounded-sm" : "mkt-accent-bar",
        className
      )}
      aria-hidden
    />
  );
}
