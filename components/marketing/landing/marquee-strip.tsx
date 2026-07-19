const KEYWORDS = [
  "Websites",
  "Local SEO",
  "Google Maps",
  "Construction",
  "General Contractor",
  "Concrete",
  "HVAC",
  "Plumbing",
  "Electrical",
  "Roofing",
];

export function MarqueeStrip() {
  const items = [...KEYWORDS, ...KEYWORDS];

  return (
    <div className="mkt-marquee" aria-hidden>
      <div className="mkt-marquee-track">
        {items.map((word, i) => (
          <span
            key={`${word}-${i}`}
            className="inline-flex items-center gap-3 text-sm font-bold uppercase tracking-[0.14em]"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-white/70" />
            {word}
          </span>
        ))}
      </div>
    </div>
  );
}
