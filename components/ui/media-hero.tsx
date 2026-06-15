import Image from "next/image";
import { cn } from "@/lib/utils";

interface MediaHeroProps {
  imageUrl: string;
  imageAlt?: string;
  className?: string;
  children: React.ReactNode;
  overlay?: "heavy" | "medium" | "light";
}

const overlayClasses = {
  heavy: "from-background/95 via-background/80 to-background/60",
  medium: "from-background/90 via-background/60 to-transparent",
  light: "from-background/70 via-background/40 to-transparent",
};

export function MediaHero({
  imageUrl,
  imageAlt = "",
  className,
  children,
  overlay = "medium",
}: MediaHeroProps) {
  return (
    <div className={cn("relative overflow-hidden", className)}>
      <Image
        src={imageUrl}
        alt={imageAlt}
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-r",
          overlayClasses[overlay]
        )}
        aria-hidden
      />
      <div className="relative">{children}</div>
    </div>
  );
}
