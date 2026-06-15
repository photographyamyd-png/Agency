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
    <div className="flex min-h-screen flex-col bg-background">
      <MarketingNav businessName={businessName} logoUrl={logoUrl} />
      <main className="flex-1">{children}</main>
      <MarketingFooter
        businessName={businessName}
        logoUrl={logoUrl}
        email={email}
        phone={phone}
      />
    </div>
  );
}
