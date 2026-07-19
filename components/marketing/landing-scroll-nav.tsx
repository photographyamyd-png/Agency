"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const SECTIONS = [
  { id: "hero", ink: true },
  { id: "strategy", ink: false },
  { id: "services", ink: false },
  { id: "results", ink: true },
  { id: "pricing", ink: false },
  { id: "contact", ink: false },
] as const;

/** Accent dots on ink sections, dark dots on light — simplified scroll nav */
export function LandingScrollNav() {
  const [active, setActive] = useState("hero");

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActive(id);
        },
        { rootMargin: "-40% 0px -40% 0px", threshold: 0 }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return (
    <nav
      className="pointer-events-none fixed right-4 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-3 lg:flex"
      aria-label="Section navigation"
    >
      {SECTIONS.map(({ id, ink }) => (
        <a
          key={id}
          href={`#${id}`}
          className="pointer-events-auto group flex items-center justify-end gap-2"
          aria-label={`Go to ${id}`}
        >
          <span
            className={cn(
              "h-2.5 w-2.5 rounded-full border transition-all",
              active === id
                ? ink
                  ? "scale-125 border-[var(--mkt-accent)] bg-[var(--mkt-accent)]"
                  : "scale-125 border-[var(--mkt-ink)] bg-[var(--mkt-ink)]"
                : ink
                  ? "border-[var(--mkt-accent)]/40 bg-transparent"
                  : "border-[var(--mkt-ink)]/30 bg-transparent"
            )}
          />
        </a>
      ))}
    </nav>
  );
}
