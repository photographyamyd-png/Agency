import Image from "next/image";
import { resolveHeroImage } from "@/lib/images/defaults";
import { cn } from "@/lib/utils";

interface AuthLayoutProps {
  heroImageUrl?: string | null;
  children: React.ReactNode;
}

export function AuthLayout({ heroImageUrl, children }: AuthLayoutProps) {
  const image = resolveHeroImage(heroImageUrl);

  return (
    <div className="relative flex min-h-screen items-center justify-center px-4">
      <Image
        src={image}
        alt=""
        fill
        className="object-cover"
        sizes="100vw"
        priority
      />
      <div className="absolute inset-0 bg-background/85 backdrop-blur-sm" aria-hidden />
      <div
        className={cn(
          "relative w-full max-w-sm space-y-6 rounded-xl border border-border-bright",
          "bg-surface-raised p-8 shadow-2xl shadow-black/50"
        )}
      >
        {children}
      </div>
    </div>
  );
}
