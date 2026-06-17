import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface AccentButtonProps {
  href: string;
  children: React.ReactNode;
  variant?: "accent" | "ghost";
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
  return (
    <a
      href={href}
      onClick={onClick}
      className={cn(
        variant === "accent" ? "mkt-btn-accent h-12 px-6" : "mkt-btn-ghost h-12 px-6",
        className
      )}
    >
      <span>{children}</span>
      <span className="mkt-btn-accent-icon">
        <ArrowRight className="h-3.5 w-3.5" />
      </span>
    </a>
  );
}
