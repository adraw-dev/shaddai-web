import type { Media } from "@/domain/catalog";
import { cn } from "@/lib/cn";

/**
 * Imagen responsive sin `next/image` (plan §7.2): `<picture>` + `srcset` + dimensiones explícitas.
 * Recibe el tipo de dominio `Media`: hoy variantes locales; con Strapi, sus `formats`.
 *
 * - Variantes con `mime` distinto de la última se emiten como <source type=…> (AVIF/WebP primero).
 * - `priority` → imagen candidata a LCP: `fetchpriority="high"` y sin carga diferida.
 * - width/height SIEMPRE presentes (evita CLS); `alt=""` solo si es decorativa.
 */
type PictureProps = {
  media: Media;
  sizes: string;
  priority?: boolean;
  className?: string;
};

const srcSet = (variants: Media["variants"]) =>
  variants.map((v) => `${v.src} ${v.width}w`).join(", ");

export function Picture({ media, sizes, priority = false, className }: PictureProps) {
  const fallbackMime = media.variants[media.variants.length - 1]?.mime;
  const fallbackVariants = media.variants.filter((v) => v.mime === fallbackMime || !v.mime);
  const modernMimes = [...new Set(media.variants.map((v) => v.mime).filter((m): m is string => !!m && m !== fallbackMime))];
  const fallbackSrc = fallbackVariants[fallbackVariants.length - 1]?.src ?? media.variants[0]?.src;

  return (
    <picture>
      {modernMimes.map((mime) => (
        <source
          key={mime}
          type={mime}
          srcSet={srcSet(media.variants.filter((v) => v.mime === mime))}
          sizes={sizes}
        />
      ))}
      <img
        src={fallbackSrc}
        srcSet={fallbackVariants.length > 1 ? srcSet(fallbackVariants) : undefined}
        sizes={sizes}
        width={media.width}
        height={media.height}
        alt={media.alt}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={priority ? "high" : undefined}
        className={cn("h-auto max-w-full", className)}
      />
    </picture>
  );
}
