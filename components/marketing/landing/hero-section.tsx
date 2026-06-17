import Image from "next/image";
import Link from "next/link";
import { Phone } from "lucide-react";
import { AccentButton } from "@/components/marketing/primitives/accent-button";
import { Eyebrow } from "@/components/marketing/primitives/eyebrow";

interface HeroSectionProps {
  tagline: string;
  headline: string;
  subhead: string;
  heroImage: string;
  heroAlt: string;
  phone?: string | null;
}

export function HeroSection({
  tagline,
  headline,
  subhead,
  heroImage,
  heroAlt,
  phone,
}: HeroSectionProps) {
  return (
    <section id="hero" className="relative mkt-band-ink min-h-[85svh]">
      <Image
        src={heroImage}
        alt={heroAlt}
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-[var(--mkt-ink)]/80" />

      <div className="mkt-container relative flex min-h-[85svh] items-center py-32">
        <div className="mkt-content max-w-2xl">
          <Eyebrow label={tagline} light />

          <h1 className="mkt-headline mkt-headline-hero mt-6 text-[var(--mkt-on-dark)]">
            {headline}
          </h1>

          <p className="mt-6 text-lg leading-relaxed text-[var(--mkt-muted-on-dark)]">
            {subhead}
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <AccentButton href="#contact">Get a free quote</AccentButton>
            {phone && (
              <a
                href={`tel:${phone.replace(/\D/g, "")}`}
                className="mkt-btn-ghost-dark inline-flex h-11 items-center gap-2 px-5"
              >
                <Phone className="h-4 w-4" />
                Call us
              </a>
            )}
          </div>

          <div className="mkt-stat-inline mt-12">
            <span className="font-display text-2xl font-extrabold tabular-nums text-[var(--mkt-accent)]">
              #58 → #7
            </span>
            <span className="text-sm text-[var(--mkt-muted-on-dark)]">
              Typical rank jump for local HVAC clients
            </span>
          </div>

          <p className="mt-10 text-sm text-[var(--mkt-muted-on-dark)]">
            Already a client?{" "}
            <Link
              href="/client/login"
              className="font-medium text-[var(--mkt-on-dark)] underline-offset-4 hover:underline"
            >
              Sign in to your portal
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
