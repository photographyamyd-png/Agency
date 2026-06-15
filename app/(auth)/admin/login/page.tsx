import { getAgencyProfile } from "@/lib/agency/profile";
import { AdminLoginForm } from "@/components/auth/admin-login-form";

export default async function AdminLoginPage() {
  const agency = await getAgencyProfile();
  const adminEmail = process.env.ADMIN_EMAIL?.trim() ?? "";
  const googleConfigured = Boolean(
    process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
  );
  const devLoginEnabled = Boolean(
    adminEmail && process.env.DEV_ADMIN_PASSWORD && !googleConfigured
  );

  return (
    <AdminLoginForm
      businessName={agency.businessName}
      logoUrl={agency.logoUrl}
      heroImageUrl={agency.heroImageUrl}
      adminEmailConfigured={Boolean(adminEmail)}
      googleConfigured={googleConfigured}
      devLoginEnabled={devLoginEnabled}
      adminEmailHint={adminEmail ? maskEmail(adminEmail) : undefined}
    />
  );
}

function maskEmail(email: string) {
  const [local, domain] = email.split("@");
  if (!domain) return "•••";
  const visible = local.slice(0, 2);
  return `${visible}•••@${domain}`;
}
