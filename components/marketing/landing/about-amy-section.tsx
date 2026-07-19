import Image from "next/image";
import { AccentButton } from "@/components/marketing/primitives/accent-button";
import { Eyebrow } from "@/components/marketing/primitives/eyebrow";
import { PopSurface } from "@/components/marketing/primitives/pop-surface";
import { SectionShell, ZigZagRow } from "@/components/marketing/primitives/section-shell";
import { MARKETING_COPY } from "@/lib/agency/marketing-copy";

interface AboutAmySectionProps {
  portraitImage: string;
  portraitAlt: string;
  chickenImage: string;
}

/** Personal trust band — Semrush-style "who we are" without SaaS bloat */
export function AboutAmySection({
  portraitImage,
  portraitAlt,
  chickenImage,
}: AboutAmySectionProps) {
  const { antiAgency } = MARKETING_COPY;

  return (
    <SectionShell id="about" band="stone" className="py-28 lg:py-36">
      <div className="mkt-container">
        <ZigZagRow
          reverse
          image={
            <div className="relative mx-auto max-w-md lg:mx-0">
              <div className="mkt-l-frame">
                <div className="relative z-[1] aspect-[4/5] w-full overflow-hidden rounded-xl shadow-xl">
                  <Image
                    src={portraitImage}
                    alt={portraitAlt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 40vw"
                  />
                </div>
              </div>
            </div>
          }
        >
          <PopSurface accent="orange" className="p-8 lg:-mr-6 lg:p-10">
            <Eyebrow label="Who you'll work with" />
            <h2 className="mkt-headline mt-5">{antiAgency.headline}</h2>

            <p className="mt-6 text-base leading-relaxed text-[var(--mkt-muted)] sm:text-lg">
              {antiAgency.pitch}
            </p>

            <p className="mkt-pullquote mt-8">{antiAgency.callout}</p>

            <div className="mt-8 flex items-start gap-3 border-t border-[var(--mkt-border)] pt-4 text-sm text-[var(--mkt-muted)]">
              <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md border-2 border-[var(--mkt-accent-bright)]">
                <Image
                  src={chickenImage}
                  alt={MARKETING_COPY.chickenLine}
                  fill
                  className="object-cover"
                  sizes="40px"
                />
              </div>
              <p>{MARKETING_COPY.chickenLine}</p>
            </div>

            <div className="mt-10">
              <AccentButton href="#contact">{MARKETING_COPY.ctaPrimary}</AccentButton>
            </div>
          </PopSurface>
        </ZigZagRow>
      </div>
    </SectionShell>
  );
}
