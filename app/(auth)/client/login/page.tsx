import { getAgencyProfile } from "@/lib/agency/profile";
import { ClientLoginForm } from "@/components/auth/client-login-form";

export default async function ClientLoginPage() {
  const agency = await getAgencyProfile();

  return (
    <ClientLoginForm
      businessName={agency.businessName}
      logoUrl={agency.logoUrl}
      heroImageUrl={agency.heroImageUrl}
    />
  );
}
