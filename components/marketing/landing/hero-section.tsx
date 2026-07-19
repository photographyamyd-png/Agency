import Link from "next/link";
import { AccentButton } from "@/components/marketing/primitives/accent-button";
import { Eyebrow } from "@/components/marketing/primitives/eyebrow";
import { FloatingStatCard } from "@/components/marketing/primitives/floating-stat-card";
import { GoogleSerpMock } from "@/components/marketing/primitives/google-serp-mock";
import { MARKETING_COPY } from "@/lib/agency/marketing-copy";

interface HeroSectionProps {
  tagline: string;
  headline: string;
  subhead: string;
  phone?: string | null;
}

export function HeroSection({ tagline, headline, subhead, phone }: HeroSectionProps) {
  return (
    <section id="hero" className="relative overflow-hidden bg-[var(--mkt-ink)]">
      {/* Soft brand glow — no photo background */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 85% 20%, rgba(79, 70, 229, 0.28) 0%, transparent 70%), radial-gradient(ellipse 40% 35% at 10% 80%, rgba(232, 93, 4, 0.12) 0%, transparent 65%)",
        }}
        aria-hidden
      />

      <div className="mkt-container relative z-10 py-20 lg:py-28">
        <div className="grid w-full items-center gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-6">
            <Eyebrow label={tagline} light />
            <h1 className="mkt-headline mkt-headline-hero mt-6 max-w-2xl text-white">
              {headline}
            </h1>
            <p className="mt-8 max-w-xl text-lg leading-relaxed text-white/75">
              {subhead}
            </p>

            <div className="mt-12 flex flex-wrap items-center gap-4">
              <AccentButton href="#contact">{MARKETING_COPY.ctaPrimary}</AccentButton>
              {phone ? (
                <AccentButton
                  href={`tel:${phone.replace(/\D/g, "")}`}
                  variant="ghost-dark"
                >
                  {MARKETING_COPY.ctaSecondary}
                </AccentButton>
              ) : (
                <AccentButton href="#process" variant="ghost-dark">
                  See how it works
                </AccentButton>
              )}
            </div>
            <p className="mt-3 text-sm font-medium text-white/55">
              {MARKETING_COPY.ctaHint}
            </p>

            <p className="mt-10 text-sm text-white/50">
              Already a client?{" "}
              <Link
                href="/client/login"
                className="font-medium text-white underline-offset-4 hover:text-[var(--mkt-accent-bright)] hover:underline"
              >
                Sign in to your portal
              </Link>
            </p>
          </div>

          <div className="relative lg:col-span-6">
            <div
              className="absolute -right-8 top-8 hidden h-64 w-64 rounded-full bg-[var(--mkt-accent)] opacity-20 blur-2xl lg:block"
              aria-hidden
            />
            <div className="mkt-bleed-overlap relative ml-auto w-full max-w-lg">
              <GoogleSerpMock
                query="general contractor near me"
                businessName="Your Construction Co."
                rankBadge="#41 → #5"
              />
            </div>

            <FloatingStatCard
              label="Local ranking"
              value="#41 → #5"
              hint="GC · money keyword"
              className="absolute -bottom-6 left-0 z-30 hidden max-w-[13rem] lg:block"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
