import Link from "next/link";
import Image from "next/image";

interface MarketingFooterProps {
  businessName: string;
  logoUrl?: string | null;
  email?: string | null;
  phone?: string | null;
}

export function MarketingFooter({
  businessName,
  logoUrl,
  email,
  phone,
}: MarketingFooterProps) {
  return (
    <footer className="border-t border-border-bright bg-band-a">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-12 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex items-start gap-3">
          {logoUrl ? (
            <Image
              src={logoUrl}
              alt={businessName}
              width={36}
              height={36}
              className="rounded-md object-cover"
            />
          ) : null}
          <div>
            <p className="font-semibold">{businessName}</p>
            <p className="mt-1 text-sm text-muted">
              Websites & local SEO for service businesses
            </p>
            {(email || phone) && (
              <p className="mt-2 text-sm text-muted">
                {email}
                {email && phone ? " · " : ""}
                {phone}
              </p>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-2 text-sm">
          <Link href="/client/login" className="text-accent-bright hover:underline">
            Client Login
          </Link>
          <Link href="/admin/login" className="text-muted hover:text-foreground">
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
