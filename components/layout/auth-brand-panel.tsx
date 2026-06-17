import Image from "next/image";
import Link from "next/link";

interface AuthBrandPanelProps {
  businessName: string;
  logoUrl?: string | null;
  tagline: string;
}

export function AuthBrandPanel({
  businessName,
  logoUrl,
  tagline,
}: AuthBrandPanelProps) {
  return (
    <aside className="auth-brand-panel relative hidden overflow-hidden lg:flex lg:flex-col lg:items-center lg:justify-center">
      <div className="auth-brand-dots absolute inset-0" aria-hidden />
      <div className="auth-brand-glow auth-brand-glow-teal absolute inset-0" aria-hidden />
      <div className="auth-brand-glow auth-brand-glow-amber absolute inset-0" aria-hidden />

      <div className="relative z-10 mx-auto max-w-sm px-10 text-center">
        <Link
          href="/"
          className="mx-auto mb-8 flex h-12 w-12 items-center justify-center transition-transform hover:scale-105"
        >
          {logoUrl ? (
            <Image
              src={logoUrl}
              alt={businessName}
              width={48}
              height={48}
              className="rounded-xl object-cover shadow-accent-glow"
            />
          ) : (
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent text-lg font-bold text-accent-foreground shadow-accent-glow">
              {businessName.charAt(0).toUpperCase()}
            </span>
          )}
        </Link>
        <p className="text-2xl font-semibold leading-snug tracking-tight text-foreground">
          {tagline}
        </p>
      </div>
    </aside>
  );
}
