"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export type ViewMode = "agency" | "client";

interface ViewToggleProps {
  className?: string;
}

export function ViewToggle({ className }: ViewToggleProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const current = (searchParams.get("view") as ViewMode) || "agency";

  function setView(view: ViewMode) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("view", view);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  return (
    <div
      className={cn(
        "inline-flex rounded-lg border border-border bg-surface p-0.5",
        className
      )}
    >
      {(["agency", "client"] as const).map((view) => (
        <button
          key={view}
          type="button"
          onClick={() => setView(view)}
          className={cn(
            "rounded-md px-3 py-1.5 text-xs font-medium capitalize transition-colors",
            current === view
              ? "bg-accent text-accent-foreground"
              : "text-muted hover:text-foreground"
          )}
        >
          {view} view
        </button>
      ))}
    </div>
  );
}

export function useViewMode(): ViewMode {
  const searchParams = useSearchParams();
  return (searchParams.get("view") as ViewMode) || "agency";
}
