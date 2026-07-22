import Image from "next/image";
import Link from "next/link";
import { AccentButton } from "@/components/marketing/primitives/accent-button";
import { Eyebrow } from "@/components/marketing/primitives/eyebrow";
import { MARKETING_COPY } from "@/lib/agency/marketing-copy";
import { DEFAULT_IMAGES } from "@/lib/images/defaults";

interface HeroSectionProps {
  tagline: string;
  headline: string;
  subhead: string;
  phone?: string | null;
  imageSrc?: string;
  imageAlt?: string;
}

export function HeroSection({
  tagline,
  headline,
  subhead,
  phone,
  imageSrc = DEFAULT_IMAGES.hero,
  imageAlt = DEFAULT_IMAGES.heroAlt,
}: HeroSectionProps) {
  return (
    <section id="hero" className="relative overflow-hidden bg-[var(--mkt-ink)]">
      {/* Soft atmospheric wash — photo carries the visual */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 55% 50% at 15% 40%, rgba(79, 70, 229, 0.28) 0%, transparent 65%), radial-gradient(ellipse 40% 35% at 90% 80%, rgba(232, 93, 4, 0.12) 0%, transparent 55%)",
        }}
        aria-hidden
      />

      <div className="mkt-container relative z-10 py-20 lg:py-28">
        <div className="grid w-full items-center gap-12 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-5">
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

          <div className="relative lg:col-span-7">
            <div className="relative aspect-[4/3] overflow-hidden border border-white/10 sm:aspect-[16/10]">
              <Image
                src={imageSrc}
                alt={imageAlt}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 58vw"
                className="object-cover object-center"
              />
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to top, rgba(12,14,18,0.35) 0%, transparent 45%)",
                }}
                aria-hidden
              />
              <div
                className="pointer-events-none absolute bottom-0 left-0 h-1 w-24 bg-[var(--mkt-orange)]"
                aria-hidden
              />
            </div>
            <p className="mt-3 text-xs font-medium uppercase tracking-[0.14em] text-white/45">
              On the job · real Stuart Action footage
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
