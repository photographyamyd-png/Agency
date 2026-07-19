import { MapPin, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface GoogleSerpMockProps {
  className?: string;
  query?: string;
  businessName?: string;
  rankBadge?: string;
  compact?: boolean;
}

/** Stylized Google results panel — instant “you’ll show up here” impact */
export function GoogleSerpMock({
  className,
  query = "general contractor near me",
  businessName = "Your Construction Co.",
  rankBadge = "#41 → #5",
  compact = false,
}: GoogleSerpMockProps) {
  return (
    <div
      className={cn(
        "overflow-hidden border border-[var(--mkt-border)] bg-white shadow-[0_24px_48px_-16px_rgba(12,14,18,0.22)]",
        className
      )}
      aria-hidden
    >
      {/* Browser chrome */}
      <div className="flex items-center gap-2 border-b border-[var(--mkt-border)] bg-[#f8f9fa] px-3 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        <div className="ml-2 flex-1 truncate bg-white px-3 py-1.5 text-[11px] text-[#5f6368]">
          google.com/search?q={query.replace(/\s+/g, "+")}
        </div>
      </div>

      <div className={cn("px-4", compact ? "py-3" : "py-4 sm:px-5")}>
        {/* Search bar */}
        <div className="mb-4 flex items-center gap-2 border border-[#dfe1e5] bg-white px-3 py-2.5 shadow-sm">
          <svg className="h-4 w-4 shrink-0 text-[#4285f4]" viewBox="0 0 24 24" fill="currentColor">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          <span className="truncate text-sm text-[#202124]">{query}</span>
        </div>

        {rankBadge && (
          <div className="mb-3 inline-flex bg-[var(--mkt-orange)] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
            Local rank · {rankBadge}
          </div>
        )}

        {/* Maps pack */}
        {!compact && (
          <div className="mb-4 border border-[#dadce0] bg-[#f8f9fa] p-3">
            <p className="mb-2 text-[11px] font-medium text-[#202124]">Local results</p>
            <div className="flex gap-2 overflow-hidden">
              {[businessName, "Rival Build Co", "QuickFix Pros"].map((name, i) => (
                <div
                  key={name}
                  className={cn(
                    "min-w-0 flex-1 border bg-white p-2",
                    i === 0 ? "border-[var(--mkt-accent)] ring-1 ring-[var(--mkt-accent)]" : "border-[#dadce0]"
                  )}
                >
                  <div className="mb-1.5 flex h-12 items-center justify-center bg-[#e8eaed]">
                    <MapPin
                      className={cn("h-5 w-5", i === 0 ? "text-[var(--mkt-accent)]" : "text-[#80868b]")}
                    />
                  </div>
                  <p className="truncate text-[10px] font-semibold text-[#1a0dab]">{name}</p>
                  <div className="mt-0.5 flex items-center gap-0.5">
                    <span className="text-[9px] font-medium text-[#202124]">4.{9 - i}</span>
                    <Star className="h-2.5 w-2.5 fill-[#fbbc04] text-[#fbbc04]" />
                  </div>
                  {i === 0 && (
                    <p className="mt-1 text-[9px] font-semibold text-[var(--mkt-orange-deep)]">Open now</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Organic result */}
        <div className="space-y-3">
          <div>
            <p className="truncate text-xs text-[#202124]">
              https://{businessName.toLowerCase().replace(/[^a-z0-9]+/g, "")}.com
            </p>
            <p className="mt-0.5 text-base font-medium leading-snug text-[#1a0dab] sm:text-lg">
              {businessName} | Local Contractor
            </p>
            <p className="mt-1 text-xs leading-relaxed text-[#4d5156] sm:text-sm">
              Licensed · Insured · Free estimates. Serving your town and nearby areas.
              Call now — get the jobs that search for you.
            </p>
          </div>
          {!compact && (
            <div className="border-t border-[#dadce0] pt-3 opacity-50">
              <p className="text-xs text-[#202124]">https://competitor-builds.example</p>
              <p className="mt-0.5 text-sm text-[#1a0dab]">Construction Services Near You</p>
              <p className="mt-1 text-xs text-[#4d5156]">Family owned since… Call for a quote.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
