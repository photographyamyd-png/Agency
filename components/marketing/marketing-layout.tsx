import { MarketingNav } from "@/components/marketing/marketing-nav";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { LandingScrollNav } from "@/components/marketing/landing-scroll-nav";

export function MarketingLayout({
  businessName,
  logoUrl,
  email,
  phone,
  chickenImage,
  children,
}: {
  businessName: string;
  logoUrl?: string | null;
  email?: string | null;
  phone?: string | null;
  chickenImage?: string;
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
      <main className="flex-1 pt-[6.75rem]">{children}</main>
      <MarketingFooter
        businessName={businessName}
        logoUrl={logoUrl}
        email={email}
        phone={phone}
        chickenImage={chickenImage}
      />
      <LandingScrollNav />
    </div>
  );
}
