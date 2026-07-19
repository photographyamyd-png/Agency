import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface AccentButtonProps {
  href: string;
  children: React.ReactNode;
  variant?: "accent" | "ghost" | "ghost-dark";
  className?: string;
  onClick?: () => void;
}

export function AccentButton({
  href,
  children,
  variant = "accent",
  className,
  onClick,
}: AccentButtonProps) {
  const base =
    variant === "ghost-dark"
      ? "mkt-btn-ghost-dark h-12 px-6"
      : variant === "ghost"
        ? "mkt-btn-ghost h-12 px-6"
        : "mkt-btn-accent h-12 px-6";

  return (
    <a href={href} onClick={onClick} className={cn(base, className)}>
      <span>{children}</span>
      {variant !== "ghost-dark" && (
        <span className="mkt-btn-accent-icon">
          <ArrowRight className="h-3.5 w-3.5" />
        </span>
      )}
    </a>
  );
}
