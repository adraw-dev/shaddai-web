import { Picture } from "@/components/media/picture";
import type { Media } from "@/domain/catalog";
import { cn } from "@/lib/cn";
import { catalogContent } from "./catalog-content";

type ProductGalleryProps = {
  name: string;
  images: Media[];
};

/** Marco cuadrado blanco; la foto va en una caja absoluta para que una imagen vertical no lo estire. */
const frame = "relative aspect-square overflow-hidden rounded-card bg-white ring-1 ring-espresso-900/8";
const fit = "absolute [&_picture]:block [&_picture]:size-full";

/**
 * Galería sin JavaScript: la imagen principal grande (candidata a LCP) y el resto en una fila
 * desplazable con *scroll-snap*. Todas visibles, sin estado de cliente.
 */
export function ProductGallery({ name, images }: ProductGalleryProps) {
  const [main, ...rest] = images;
  if (!main) return null;

  return (
    <div role="group" aria-label={catalogContent.galleryLabel(name)} className="min-w-0 space-y-3">
      <div className={frame}>
        <div className={cn(fit, "inset-4 sm:inset-6")}>
          <Picture media={main} sizes="(min-width: 1024px) 34rem, 92vw" priority className="size-full object-contain" />
        </div>
      </div>
      {rest.length ? (
        <ul className="-mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
          {rest.map((image, i) => (
            <li key={`${image.variants[0]?.src}-${i}`} className={cn(frame, "w-28 shrink-0 snap-start sm:w-32")}>
              <div className={cn(fit, "inset-2")}>
                <Picture media={image} sizes="8rem" className="size-full object-contain" />
              </div>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
