import Image from "next/image";
import Link from "next/link";
import { resolveHeroImage } from "@/lib/images/defaults";
import { cn } from "@/lib/utils";

interface TokenPortalLayoutProps {
  businessName: string;
  logoUrl?: string | null;
  heroImageUrl?: string | null;
  email?: string | null;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export function TokenPortalLayout({
  businessName,
  logoUrl,
  heroImageUrl,
  email,
  title,
  subtitle,
  children,
}: TokenPortalLayoutProps) {
  const image = resolveHeroImage(heroImageUrl);

  return (
    <div className="min-h-screen bg-background">
      <div className="relative h-32 overflow-hidden border-b border-border-bright sm:h-40">
        <Image src={image} alt="" fill className="object-cover" sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background" />
        <div className="relative mx-auto flex h-full max-w-xl items-end gap-3 px-4 pb-4">
          {logoUrl ? (
            <Image
              src={logoUrl}
              alt={businessName}
              width={40}
              height={40}
              className="rounded-md object-cover"
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-accent text-sm font-bold text-accent-foreground">
              {businessName.charAt(0).toUpperCase()}
            </div>
          )}
          <span className="text-sm font-semibold">{businessName}</span>
        </div>
      </div>

      <div className="mx-auto max-w-xl px-4 py-10">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
          {subtitle && (
            <p className="mt-2 text-sm text-muted leading-relaxed">{subtitle}</p>
          )}
        </div>

        <div
          className={cn(
            "rounded-xl border border-border-bright bg-surface-raised p-6 shadow-lg shadow-black/30"
          )}
        >
          {children}
        </div>

        {email && (
          <p className="mt-8 text-center text-xs text-muted">
            Questions?{" "}
            <a href={`mailto:${email}`} className="text-accent-bright hover:underline">
              {email}
            </a>
          </p>
        )}
      </div>
    </div>
  );
}

export function TokenPortalState({
  businessName,
  logoUrl,
  heroImageUrl,
  email,
  title,
  message,
}: {
  businessName: string;
  logoUrl?: string | null;
  heroImageUrl?: string | null;
  email?: string | null;
  title: string;
  message: string;
}) {
  return (
    <TokenPortalLayout
      businessName={businessName}
      logoUrl={logoUrl}
      heroImageUrl={heroImageUrl}
      email={email}
      title={title}
      subtitle={message}
    >
      <p className="text-center text-sm text-muted">
        <Link href="/" className="text-accent-bright hover:underline">
          ← Back to website
        </Link>
      </p>
    </TokenPortalLayout>
  );
}
