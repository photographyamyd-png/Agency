import { cn } from "@/lib/utils";

interface EyebrowProps {
  index?: string;
  label: string;
  light?: boolean;
  className?: string;
}

export function Eyebrow({ index, label, light, className }: EyebrowProps) {
  return (
    <p className={cn("mkt-eyebrow", light && "mkt-eyebrow-light", className)}>
      {index && <span className="mr-2 tabular-nums">{index}</span>}
      {index && <span className="mr-2 opacity-60">·</span>}
      {label}
    </p>
  );
}
