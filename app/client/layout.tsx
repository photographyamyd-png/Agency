import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getAgencyProfile } from "@/lib/agency/profile";
import { ClientNav } from "@/components/layout/client-nav";

export default async function ClientPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (session?.user?.role === "admin") {
    redirect("/dashboard");
  }

  const agency = await getAgencyProfile();

  return (
    <div className="min-h-screen bg-background">
      <ClientNav businessName={agency.businessName} logoUrl={agency.logoUrl} />
      <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
      <footer className="border-t border-border-bright bg-band-b py-6">
        <p className="text-center text-xs text-muted">
          Powered by {agency.businessName}
          {agency.email ? (
            <>
              {" "}
              ·{" "}
              <a href={`mailto:${agency.email}`} className="text-accent-bright hover:underline">
                {agency.email}
              </a>
            </>
          ) : null}
        </p>
      </footer>
    </div>
  );
}
