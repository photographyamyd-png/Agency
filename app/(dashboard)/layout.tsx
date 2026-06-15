import { auth } from "@/auth";
import { Sidebar } from "@/components/layout/sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <div className="min-h-screen bg-background">
      <Sidebar user={session?.user} />
      <div className="md:pl-[260px]">{children}</div>
    </div>
  );
}
