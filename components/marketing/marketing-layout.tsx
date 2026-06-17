import { MarketingNav } from "@/components/marketing/marketing-nav";
import { MarketingFooter } from "@/components/marketing/marketing-footer";

export function MarketingLayout({
  businessName,
  logoUrl,
  email,
  phone,
  children,
}: {
  businessName: string;
  logoUrl?: string | null;
  email?: string | null;
  phone?: string | null;
  children: React.ReactNode;
}) {
  return (
    <div className="marketing-page relative flex min-h-screen flex-col">
      <MarketingNav
        businessName={businessName}
        logoUrl={logoUrl}
        email={email}
        phone={phone}
      />
      <main className="flex-1 pt-[4.25rem]">{children}</main>
      <MarketingFooter
        businessName={businessName}
        logoUrl={logoUrl}
        email={email}
        phone={phone}
      />
    </div>
  );
}
