import Image from "next/image";
import { cn } from "@/lib/utils";

interface ImageCardProps {
  imageUrl: string;
  imageAlt: string;
  title: string;
  description: string;
  className?: string;
}

export function ImageCard({
  imageUrl,
  imageAlt,
  title,
  description,
  className,
}: ImageCardProps) {
  return (
    <article
      className={cn(
        "group overflow-hidden rounded-xl border border-border-bright bg-surface-raised shadow-lg shadow-black/30 transition-transform hover:-translate-y-1",
        className
      )}
    >
      <div className="relative aspect-[16/9] overflow-hidden">
        <Image
          src={imageUrl}
          alt={imageAlt}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
      </div>
      <div className="p-6">
        <h3 className="font-semibold text-lg">{title}</h3>
        <p className="mt-2 text-sm text-muted leading-relaxed">{description}</p>
      </div>
    </article>
  );
}
