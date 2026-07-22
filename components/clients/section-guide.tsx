import type { SectionGuideContent } from "@/lib/blueprint/section-guides";
import { getSectionGuide, type SectionGuideId } from "@/lib/blueprint/section-guides";

interface SectionGuideProps {
  guideId?: SectionGuideId;
  guide?: SectionGuideContent;
  className?: string;
  /** Start expanded (rare — prefer collapsed). */
  defaultOpen?: boolean;
}

/**
 * High-contrast expandable operator guide: white panel, dark text, orange accents.
 */
export function SectionGuide({
  guideId,
  guide: guideProp,
  className,
  defaultOpen = false,
}: SectionGuideProps) {
  const guide = guideProp ?? (guideId ? getSectionGuide(guideId) : null);
  if (!guide) return null;

  return (
    <details
      open={defaultOpen || undefined}
      className={`group rounded-lg border-2 border-[#ea580c]/40 bg-white text-[#0f172a] shadow-sm ${className ?? ""}`}
    >
      <summary className="cursor-pointer list-none flex items-center gap-2 px-3 py-2.5 text-sm font-semibold text-[#9a3412] [&::-webkit-details-marker]:hidden hover:bg-[#fff7ed]">
        <span
          aria-hidden
          className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded bg-[#ea580c] text-[10px] font-bold text-white transition-transform group-open:rotate-90"
        >
          ▸
        </span>
        <span className="flex-1">Guide: {guide.title}</span>
        <span className="text-xs font-medium text-[#c2410c] group-open:hidden">
          Expand for steps
        </span>
        <span className="text-xs font-medium text-[#c2410c] hidden group-open:inline">
          Collapse
        </span>
      </summary>

      <div className="border-t-2 border-[#ea580c]/25 px-4 py-4 space-y-4 text-sm leading-relaxed">
        <section className="space-y-1.5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#ea580c]">
            Purpose
          </h4>
          <p className="text-[#1e293b]">{guide.purpose}</p>
          {guide.unlockNote && (
            <p className="rounded-md bg-[#fff7ed] border border-[#fdba74] px-3 py-2 text-[#9a3412] text-xs font-medium">
              {guide.unlockNote}
            </p>
          )}
        </section>

        <section className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#ea580c]">
            How to use it
          </h4>
          {guide.process.map((block) => (
            <div key={block.heading} className="space-y-1">
              <p className="font-semibold text-[#0f172a]">{block.heading}</p>
              {block.body && <p className="text-[#334155]">{block.body}</p>}
              {block.bullets && block.bullets.length > 0 && (
                <ul className="list-disc list-inside space-y-1 text-[#334155]">
                  {block.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </section>

        {guide.suggestedOrder && guide.suggestedOrder.length > 0 && (
          <section className="space-y-1.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#ea580c]">
              Suggested order
            </h4>
            <ol className="list-decimal list-inside space-y-1 text-[#334155]">
              {guide.suggestedOrder.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </section>
        )}

        {guide.links && guide.links.length > 0 && (
          <section className="space-y-1.5 pt-1 border-t border-[#fed7aa]">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#ea580c]">
              Free tools & references
            </h4>
            <ul className="flex flex-wrap gap-x-4 gap-y-1">
              {guide.links.map((link) => (
                <li key={link.url + link.label}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-[#c2410c] underline decoration-[#fdba74] underline-offset-2 hover:text-[#9a3412]"
                  >
                    {link.label} →
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </details>
  );
}
