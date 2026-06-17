import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { AuthBrandPanel } from "@/components/layout/auth-brand-panel";

interface AuthLayoutProps {
  businessName: string;
  logoUrl?: string | null;
  tagline: string;
  title: string;
  children: React.ReactNode;
}

export function AuthLayout({
  businessName,
  logoUrl,
  tagline,
  title,
  children,
}: AuthLayoutProps) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <AuthBrandPanel
        businessName={businessName}
        logoUrl={logoUrl}
        tagline={tagline}
      />

      <div className="flex flex-col bg-background px-6 py-8 sm:px-10 lg:px-16">
        <Link
          href="/"
          className="mb-8 inline-flex w-fit items-center gap-1.5 text-sm text-muted transition-colors hover:text-foreground"
        >
          <span aria-hidden>←</span>
          Home
        </Link>

        <div className="flex flex-1 flex-col justify-center">
          <div className="mx-auto w-full max-w-sm space-y-6">
            <div className="lg:hidden">
              <div className="mb-6 flex items-center gap-3">
                {logoUrl ? (
                  <Image
                    src={logoUrl}
                    alt={businessName}
                    width={40}
                    height={40}
                    className="rounded-lg object-cover"
                  />
                ) : (
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-sm font-bold text-accent-foreground">
                    {businessName.charAt(0).toUpperCase()}
                  </span>
                )}
                <span className="text-sm font-medium text-muted">{businessName}</span>
              </div>
            </div>

            <div>
              <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
            </div>

            <div className={cn("space-y-4")}>{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
