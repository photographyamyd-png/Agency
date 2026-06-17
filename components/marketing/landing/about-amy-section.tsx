import Image from "next/image";
import { AccentButton } from "@/components/marketing/primitives/accent-button";
import { Eyebrow } from "@/components/marketing/primitives/eyebrow";
import { SectionShell, ZigZagRow } from "@/components/marketing/primitives/section-shell";
import { MARKETING_COPY } from "@/lib/agency/marketing-copy";

interface AboutAmySectionProps {
  portraitImage: string;
  portraitAlt: string;
  chickenImage: string;
}

export function AboutAmySection({
  portraitImage,
  portraitAlt,
  chickenImage,
}: AboutAmySectionProps) {
  const { antiAgency } = MARKETING_COPY;

  return (
    <SectionShell id="about" tone="dark" className="mkt-band-steel py-20 lg:py-28">
      <div className="mkt-container">
        <ZigZagRow
          reverse
          image={
            <div className="relative mx-auto max-w-md lg:mx-0">
              <div className="mkt-frame-back" aria-hidden />
              <div className="mkt-image-stack mkt-image-wrap aspect-[4/5] w-full">
                <Image
                  src={portraitImage}
                  alt={portraitAlt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
              </div>
            </div>
          }
        >
          <div className="mkt-glass-strong p-8 lg:p-10">
            <Eyebrow label="No account managers" />
            <h2 className="mkt-headline mt-4">{antiAgency.headline}</h2>

            <p className="mt-6 text-base leading-relaxed text-muted sm:text-lg">
              {antiAgency.pitch}
            </p>

            <p className="mkt-pullquote mt-8">{antiAgency.callout}</p>

            <div className="mkt-footnote mt-8 flex items-start gap-3">
              <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md border border-white/10">
                <Image
                  src={chickenImage}
                  alt="Amy's chicken"
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
          </div>
        </ZigZagRow>
      </div>
    </SectionShell>
  );
}
