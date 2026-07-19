import { MARKETING_COPY } from "@/lib/agency/marketing-copy";

/** High-contrast strip of tools trades already use — not vanity press logos */
export function PartnerTrustBar() {
  const items = [...MARKETING_COPY.trustPartners, ...MARKETING_COPY.trustPartners];

  return (
    <div className="mkt-trust-bar" aria-label="Tools and platforms we work with">
      <div className="mkt-trust-bar-track">
        {items.map((name, i) => (
          <span
            key={`${name}-${i}`}
            className="inline-flex items-center gap-3 text-sm font-bold uppercase tracking-[0.12em] text-white/85"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--mkt-accent-bright)]" />
            {name}
          </span>
        ))}
      </div>
    </div>
  );
}
