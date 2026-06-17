import Image from "next/image";
import { SectionShell } from "@/components/marketing/primitives/section-shell";
import { Eyebrow } from "@/components/marketing/primitives/eyebrow";
import { AccentButton } from "@/components/marketing/primitives/accent-button";

interface SkillsSectionProps {
  image: string;
  imageAlt: string;
}

export function SkillsSection({ image, imageAlt }: SkillsSectionProps) {
  return (
    <SectionShell id="real-talk" band="stone">
      <div className="mkt-container">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="relative aspect-[4/3] overflow-hidden rounded-sm">
            <Image
              src={image}
              alt={imageAlt}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>

          <div className="mkt-content">
            <Eyebrow label="Real talk" />
            <h2 className="mkt-headline mt-4">
              You wouldn&apos;t let us pour your foundation.
            </h2>
            <p className="mkt-lead mt-4">
              Don&apos;t pour your homepage. You&apos;re a craftsman — your work deserves
              a site that looks as solid as what you build. A cousin&apos;s WordPress
              template at midnight? That&apos;s a mess on a screen, and you know it.
            </p>
            <p className="mt-4 text-base leading-relaxed text-[var(--mkt-muted)]">
              You stay in your lane. We stay in ours. You handle the jobsite; we handle
              Google, the website, and the map pack.
            </p>
            <div className="mt-8">
              <AccentButton href="#contact">Get a free quote</AccentButton>
            </div>
          </div>
        </div>
      </div>
    </SectionShell>
  );
}
