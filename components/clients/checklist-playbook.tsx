import type { ChecklistPlaybook } from "@/lib/blueprint/checklist-playbooks";

interface ChecklistPlaybookProps {
  playbook: ChecklistPlaybook;
  /** Optional primary CTA shown even when collapsed (e.g. Open directory). */
  primaryHref?: string;
  primaryLabel?: string;
  className?: string;
}

export function ChecklistPlaybookDetails({
  playbook,
  primaryHref,
  primaryLabel = "Open link →",
  className,
}: ChecklistPlaybookProps) {
  const firstLink = playbook.links[0];
  const href = primaryHref ?? firstLink?.url;
  const linkLabel = primaryHref ? primaryLabel : firstLink ? `${firstLink.label} →` : null;

  return (
    <div className={className}>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <details className="group text-xs">
          <summary className="cursor-pointer list-none text-accent-bright hover:underline inline-flex items-center gap-1 [&::-webkit-details-marker]:hidden">
            <span className="text-muted group-open:rotate-90 transition-transform inline-block">▸</span>
            How to
          </summary>
          <div className="mt-2 space-y-2 rounded-md border-2 border-[#ea580c]/30 bg-white px-3 py-2.5 text-[#334155] shadow-sm">
            <p className="text-[#0f172a] font-medium">{playbook.summary}</p>
            <ol className="list-decimal list-inside space-y-1.5">
              {playbook.steps.map((step) => (
                <li key={step} className="leading-relaxed">
                  {step}
                </li>
              ))}
            </ol>
            {playbook.links.length > 0 && (
              <ul className="flex flex-wrap gap-x-3 gap-y-1 pt-2 border-t border-[#fed7aa]">
                {playbook.links.map((link) => (
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
            )}
          </div>
        </details>
        {href && linkLabel && (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-accent-bright hover:underline"
          >
            {linkLabel}
          </a>
        )}
      </div>
    </div>
  );
}
