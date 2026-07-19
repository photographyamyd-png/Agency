"use client";

import { useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductVideoMockProps {
  className?: string;
  src?: string;
  poster?: string;
}

/** Real muted looping demo video with light player chrome */
export function ProductVideoMock({
  className,
  src = "/videos/marketing/mid-cta.mp4",
  poster = "/images/marketing/stuart/mid-cta-poster.jpg",
}: ProductVideoMockProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(true);

  function togglePlay() {
    const el = videoRef.current;
    if (!el) return;
    if (el.paused) {
      void el.play();
      setPlaying(true);
    } else {
      el.pause();
      setPlaying(false);
    }
  }

  return (
    <div
      className={cn(
        "overflow-hidden border border-[var(--mkt-border)] bg-white shadow-[0_32px_64px_-24px_rgba(12,14,18,0.28)]",
        className
      )}
    >
      <div className="flex items-center gap-2 border-b border-[var(--mkt-border)] bg-[#f4f5f7] px-3 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        <div className="ml-2 flex flex-1 items-center justify-between gap-3">
          <p className="truncate text-[11px] font-medium text-[var(--mkt-muted)]">
            On the job · Stuart Action
          </p>
          <span className="hidden text-[10px] font-semibold uppercase tracking-wider text-[var(--mkt-orange)] sm:inline">
            Live footage
          </span>
        </div>
      </div>

      <div className="relative aspect-[16/10] bg-[var(--mkt-stone)] sm:aspect-[16/9]">
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          src={src}
          poster={poster}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
        />

        <div className="absolute inset-x-0 bottom-0 flex items-center gap-3 bg-gradient-to-t from-black/45 to-transparent px-4 pb-3 pt-10">
          <button
            type="button"
            onClick={togglePlay}
            className="flex h-8 w-8 items-center justify-center bg-white text-[var(--mkt-ink)]"
            aria-label={playing ? "Pause video" : "Play video"}
          >
            {playing ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
          </button>
          <div className="h-1 flex-1 overflow-hidden bg-white/30">
            <div className="h-full w-1/3 bg-[var(--mkt-orange)]" />
          </div>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-white">
            Loop
          </span>
        </div>
      </div>
    </div>
  );
}
