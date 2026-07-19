"use client";

import { useEffect, useState } from "react";
import { Pause, Play } from "lucide-react";
import { GoogleSerpMock } from "@/components/marketing/primitives/google-serp-mock";
import { SeoToolkitMock } from "@/components/marketing/primitives/seo-toolkit-mock";
import { cn } from "@/lib/utils";

const FRAMES = ["serp", "seo", "reporting"] as const;

/** Fake product demo “video” — cycles SERP / toolkit frames like a Semrush reel */
export function ProductVideoMock({ className }: { className?: string }) {
  const [frame, setFrame] = useState(0);
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => {
      setFrame((f) => (f + 1) % FRAMES.length);
    }, 3200);
    return () => window.clearInterval(id);
  }, [playing]);

  const active = FRAMES[frame];

  return (
    <div
      className={cn(
        "overflow-hidden border border-[var(--mkt-border)] bg-white shadow-[0_32px_64px_-24px_rgba(12,14,18,0.28)]",
        className
      )}
    >
      {/* Player chrome */}
      <div className="flex items-center gap-2 border-b border-[var(--mkt-border)] bg-[#f4f5f7] px-3 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        <div className="ml-2 flex flex-1 items-center justify-between gap-3">
          <p className="truncate text-[11px] font-medium text-[var(--mkt-muted)]">
            Agency OS · Local SEO demo
          </p>
          <span className="hidden text-[10px] font-semibold uppercase tracking-wider text-[var(--mkt-orange)] sm:inline">
            Live preview
          </span>
        </div>
      </div>

      {/* Stage */}
      <div className="relative aspect-[16/10] bg-[var(--mkt-stone)] sm:aspect-[16/9]">
        <div
          key={active}
          className="absolute inset-0 flex items-center justify-center p-4 sm:p-6"
          style={{ animation: "mkt-demo-fade 0.5s ease" }}
        >
          <div className="w-full max-w-xl scale-[0.92] sm:scale-100">
            {active === "serp" && (
              <GoogleSerpMock
                query="emergency plumber near me"
                businessName="Your Shop"
                rankBadge="#58 → #7"
                className="shadow-lg"
              />
            )}
            {active === "seo" && (
              <SeoToolkitMock variant="seo" className="shadow-lg" />
            )}
            {active === "reporting" && (
              <SeoToolkitMock variant="reporting" className="shadow-lg" />
            )}
          </div>
        </div>

        {/* Soft vignette like video grade — very light, not a dark wash */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 55%, rgba(255,255,255,0.35) 100%)",
          }}
          aria-hidden
        />

        {/* Controls bar */}
        <div className="absolute inset-x-0 bottom-0 flex items-center gap-3 bg-gradient-to-t from-black/50 to-transparent px-4 pb-3 pt-10">
          <button
            type="button"
            onClick={() => setPlaying((p) => !p)}
            className="flex h-8 w-8 items-center justify-center bg-white text-[var(--mkt-ink)]"
            aria-label={playing ? "Pause demo" : "Play demo"}
          >
            {playing ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
          </button>
          <div className="h-1 flex-1 overflow-hidden bg-white/30">
            <div
              className="h-full bg-[var(--mkt-orange)] transition-all duration-300"
              style={{ width: `${((frame + 1) / FRAMES.length) * 100}%` }}
            />
          </div>
          <span className="text-[10px] font-semibold tabular-nums text-white">
            0{frame + 1} / 0{FRAMES.length}
          </span>
        </div>
      </div>
    </div>
  );
}
