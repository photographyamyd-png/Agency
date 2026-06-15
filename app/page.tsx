import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { getAgencyProfile } from "@/lib/agency/profile";
import { MarketingLayout } from "@/components/marketing/marketing-layout";
import { LeadCaptureForm } from "@/components/marketing/lead-capture-form";
import { Button } from "@/components/ui/button";
import { MediaHero } from "@/components/ui/media-hero";
import { SectionBand, SectionTitle } from "@/components/ui/section-band";
import { ImageCard } from "@/components/ui/image-card";
import { StatHighlight } from "@/components/ui/stat-highlight";
import {
  parseResultsImages,
  parseServicesImages,
  resolveHeroAlt,
  resolveHeroImage,
  resolveResultsImages,
  resolveServiceImage,
} from "@/lib/images/defaults";

export const dynamic = "force-dynamic";

const SERVICES = [
  {
    key: "WEBSITE" as const,
    title: "Websites that convert",
    desc: "Fast, mobile-first sites built for local service businesses — with clear CTAs and trust signals.",
  },
  {
    key: "SEO" as const,
    title: "Local SEO",
    desc: "Google Business Profile, on-page SEO, citations, and content that helps you rank in your service area.",
  },
  {
    key: "REPORTING" as const,
    title: "Weekly reporting",
    desc: "See your keyword rankings and traffic improve — like moving from #58 to #7 on Google.",
  },
];

const STEPS = [
  {
    step: "01",
    title: "Tell us your needs",
    desc: "Fill out a short form — we'll send a questionnaire to understand your business and goals.",
  },
  {
    step: "02",
    title: "We build & optimize",
    desc: "Custom website, local SEO setup, and Google integrations — with clear checklists every step.",
  },
  {
    step: "03",
    title: "You see results weekly",
    desc: "Rankings, traffic, and wins delivered to your inbox and client portal every week.",
  },
];

export default async function HomePage() {
  const agency = await getAgencyProfile();
  const servicesImages = parseServicesImages(agency.servicesImages);
  const resultsImages = resolveResultsImages(
    parseResultsImages(agency.resultsImages)
  );
  const heroImage = resolveHeroImage(agency.heroImageUrl);
  const heroAlt = resolveHeroAlt(agency.heroImageAlt);

  return (
    <MarketingLayout
      businessName={agency.businessName}
      logoUrl={agency.logoUrl}
      email={agency.email}
      phone={agency.phone}
    >
      <SectionBand variant="accent" className="border-b-0">
        <MediaHero imageUrl={heroImage} imageAlt={heroAlt} overlay="medium">
          <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6 sm:py-32">
            <div className="max-w-2xl">
              <p className="mb-4 text-sm font-medium uppercase tracking-wider text-accent-bright">
                {agency.tagline ?? "Websites & local SEO"}
              </p>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-7xl">
                {agency.heroHeadline ?? "Get more customers from Google"}
              </h1>
              <p className="mt-6 text-lg text-muted leading-relaxed">
                {agency.heroSubhead ??
                  "Custom websites and local SEO for service businesses — with weekly reports that show your rankings climbing."}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button variant="glow" size="lg" asChild>
                  <a href="#contact">Get Started</a>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/client/login">Client Login</Link>
                </Button>
              </div>
            </div>
          </div>
        </MediaHero>
      </SectionBand>

      <SectionBand variant="b" id="services">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <SectionTitle subtitle="Everything you need to get found, convert visitors, and prove ROI.">
            What we do
          </SectionTitle>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {SERVICES.map(({ key, title, desc }) => (
              <ImageCard
                key={key}
                imageUrl={resolveServiceImage(key, servicesImages)}
                imageAlt={title}
                title={title}
                description={desc}
              />
            ))}
          </div>
        </div>
      </SectionBand>

      <SectionBand variant="a" id="results">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <SectionTitle subtitle="Our clients see measurable improvements in Google rankings and organic traffic — tracked and reported every week.">
                Real results
              </SectionTitle>
              <div className="mt-10 grid gap-4 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                <StatHighlight stat="#58 → #7" label="Keyword rank improvement" />
                <StatHighlight stat="+23%" label="Organic traffic growth" />
                <StatHighlight stat="Weekly" label="Progress reports delivered" />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {resultsImages.slice(0, 2).map((src, i) => (
                <div
                  key={i}
                  className="relative aspect-[4/3] overflow-hidden rounded-xl border border-border-bright shadow-lg shadow-black/40"
                >
                  <Image
                    src={src}
                    alt={`Client results ${i + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 400px"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </SectionBand>

      <SectionBand variant="accent" id="how">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <SectionTitle subtitle="A clear path from first contact to measurable growth.">
            How it works
          </SectionTitle>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {STEPS.map(({ step, title, desc }, i) => (
              <div key={step} className="relative">
                {i < STEPS.length - 1 && (
                  <div className="absolute left-1/2 top-8 hidden h-px w-full bg-border-bright md:block" />
                )}
                <div className="relative rounded-xl border border-border-bright bg-surface-raised p-6 shadow-lg shadow-black/30">
                  <span className="text-3xl font-bold text-accent-bright">{step}</span>
                  <h3 className="mt-4 font-semibold text-lg">{title}</h3>
                  <p className="mt-2 text-sm text-muted leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </SectionBand>

      <SectionBand variant="b" id="contact">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:items-start">
          <div>
            <SectionTitle subtitle="Fill out the form and we'll send you a short questionnaire to understand your needs — then we'll build your custom plan, checklists, and estimate.">
              Let&apos;s talk about your business
            </SectionTitle>
            <ul className="mt-8 space-y-3 text-sm text-muted">
              {[
                "Free consultation — no obligation",
                "Onboarding questionnaire sent to your inbox",
                "Transparent pricing and timeline",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <ArrowUpRight className="h-4 w-4 text-accent-bright" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <LeadCaptureForm />
        </div>
      </SectionBand>
    </MarketingLayout>
  );
}
