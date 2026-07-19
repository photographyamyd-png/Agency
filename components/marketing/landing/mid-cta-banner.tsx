import { AccentButton } from "@/components/marketing/primitives/accent-button";
import { ProductVideoMock } from "@/components/marketing/primitives/product-video-mock";
import { MARKETING_COPY } from "@/lib/agency/marketing-copy";

/** Bright white divider + Semrush-style product demo player between dark bands */
export function MidCtaBanner() {
  return (
    <section
      aria-label="Book a call"
      className="relative overflow-hidden bg-white"
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-[var(--mkt-orange)]"
        aria-hidden
      />

      {/* Soft atmosphere — no dark overlay */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 80% 40%, rgba(79, 70, 229, 0.08) 0%, transparent 60%), radial-gradient(ellipse 50% 40% at 10% 90%, rgba(232, 93, 4, 0.06) 0%, transparent 55%)",
        }}
        aria-hidden
      />

      <div className="mkt-container relative z-10 py-16 lg:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-5">
            <p className="mkt-eyebrow">Ready when you are</p>
            <h2 className="mkt-headline mt-5 text-[var(--mkt-text)]">
              Stop guessing. Start showing up where the work is.
            </h2>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-[var(--mkt-muted)]">
              Tell me your trade and town — I&apos;ll tell you straight if I can help
              move the phone.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <AccentButton href="#contact">{MARKETING_COPY.ctaPrimary}</AccentButton>
              <a href="#results" className="mkt-btn-ghost h-12 px-6">
                See the receipts
              </a>
            </div>
            <p className="mt-3 text-sm font-medium text-[var(--mkt-muted)]">
              {MARKETING_COPY.ctaHint}
            </p>
          </div>

          <div className="lg:col-span-7">
            <ProductVideoMock />
          </div>
        </div>
      </div>

      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-1 bg-[var(--mkt-accent)]"
        aria-hidden
      />
    </section>
  );
}
