import Image from "next/image";
import Link from "next/link";
import { Phone } from "lucide-react";
import { AccentButton } from "@/components/marketing/primitives/accent-button";
import { MarketingAtmosphere } from "@/components/marketing/primitives/marketing-atmosphere";
import { Eyebrow } from "@/components/marketing/primitives/eyebrow";
import { MARKETING_COPY } from "@/lib/agency/marketing-copy";

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
    <section id="hero" className="mkt-hero-cinematic relative overflow-hidden">
      <Image
        src={heroImage}
        alt=""
        fill
        priority
        className="object-cover object-center"
        sizes="100vw"
        aria-hidden
      />
      <MarketingAtmosphere intensity="hero" className="absolute inset-0 z-[2] opacity-40" />

      <div className="mkt-container relative z-10 flex min-h-[inherit] items-center py-16 lg:py-24">
        <div className="grid w-full items-center gap-14 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <Eyebrow label={tagline} />
            <h1 className="mkt-headline mkt-headline-hero mt-5 max-w-2xl text-foreground">
              {headline}
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">{subhead}</p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <AccentButton href="#contact">{MARKETING_COPY.ctaPrimary}</AccentButton>
              {phone && (
                <a
                  href={`tel:${phone.replace(/\D/g, "")}`}
                  className="mkt-btn-ghost inline-flex h-12 items-center gap-2 px-6"
                >
                  <Phone className="h-4 w-4" />
                  {MARKETING_COPY.ctaSecondary}
                </a>
              )}
            </div>

            <p className="mt-8 text-sm text-muted">
              Already a client?{" "}
              <Link
                href="/client/login"
                className="font-medium text-foreground hover:text-accent-bright hover:underline"
              >
                Sign in to your portal
              </Link>
            </p>
          </div>

          <div className="relative lg:col-span-6">
            <div className="mkt-frame-back hidden lg:block" aria-hidden />
            <div className="mkt-image-stack mkt-image-wrap relative ml-auto aspect-[5/6] w-full max-w-md">
              <Image
                src={heroImage}
                alt={heroAlt}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 42vw"
              />
            </div>
            <p className="mt-4 text-right text-xs font-medium tracking-wide text-muted lg:pr-2">
              Real jobsite work — not stock-photo theater.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
