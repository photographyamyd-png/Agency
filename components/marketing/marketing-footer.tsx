import Link from "next/link";
import Image from "next/image";
import { MarketingAtmosphere } from "@/components/marketing/primitives/marketing-atmosphere";
import { MARKETING_COPY } from "@/lib/agency/marketing-copy";

interface MarketingFooterProps {
  businessName: string;
  logoUrl?: string | null;
  email?: string | null;
  phone?: string | null;
  chickenImage?: string;
}

export function MarketingFooter({
  businessName,
  logoUrl,
  email,
  phone,
  chickenImage,
}: MarketingFooterProps) {
  return (
    <footer className="relative overflow-hidden border-t border-border-bright bg-[#030306]">
      <MarketingAtmosphere intensity="subtle" className="absolute inset-0" />
      <div className="mkt-divider-glow relative z-10" />
      <div className="mkt-container relative z-10 py-16 lg:py-20">
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="flex items-center gap-3">
              {logoUrl ? (
                <Image
                  src={logoUrl}
                  alt={businessName}
                  width={40}
                  height={40}
                  className="rounded-lg object-cover shadow-accent-glow"
                />
              ) : (
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-sm font-bold text-accent-foreground shadow-accent-glow">
                  A
                </span>
              )}
              <span className="font-display text-lg font-bold text-foreground">{businessName}</span>
            </div>
            <p className="mt-6 max-w-sm text-base leading-relaxed text-muted">
              Websites and local SEO for trades. You call, you get me.
            </p>
            {(email || phone) && (
              <p className="mt-6 text-sm text-muted">
                {email}
                {email && phone ? " · " : ""}
                {phone}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-7">
            <div>
              <p className="mkt-eyebrow">Navigate</p>
              <ul className="mt-6 space-y-3 text-sm">
                {[
                  { href: "#reality", label: "Reality check" },
                  { href: "#about", label: "About Amy" },
                  { href: "#services", label: "Services" },
                  { href: "#contact", label: "Contact" },
                ].map(({ href, label }) => (
                  <li key={href}>
                    <a href={href} className="text-muted transition-colors hover:text-foreground">
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="mkt-eyebrow">Portal</p>
              <ul className="mt-6 space-y-3 text-sm">
                <li>
                  <Link href="/client/login" className="text-muted hover:text-foreground">
                    Client login
                  </Link>
                </li>
                <li>
                  <Link href="/admin/login" className="text-muted hover:text-foreground">
                    Admin
                  </Link>
                </li>
              </ul>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <p className="mkt-eyebrow">Ready</p>
              <a
                href="#contact"
                className="mt-6 inline-block font-display text-lg font-bold text-accent-bright hover:underline"
              >
                {MARKETING_COPY.finalCta.button} →
              </a>
            </div>
          </div>
        </div>

        {chickenImage && (
          <div className="mkt-footnote mt-12 flex items-start gap-3 border-white/10">
            <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-md border border-white/10">
              <Image src={chickenImage} alt="" fill className="object-cover" sizes="36px" aria-hidden />
            </div>
            <p>{MARKETING_COPY.chickenLine}</p>
          </div>
        )}

        <div className="mt-10 flex flex-col gap-3 border-t border-border pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted">
            © {new Date().getFullYear()} {businessName}
          </p>
          <p className="text-sm text-muted">Built by Amy — for people who build things.</p>
        </div>
      </div>
    </footer>
  );
}
