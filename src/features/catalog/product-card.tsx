import Link from "next/link";
import { ArrowRightIcon } from "@/components/icons";
import { Picture } from "@/components/media/picture";
import type { Product } from "@/domain/catalog";
import { productHref } from "@/lib/catalog";
import { catalogContent } from "./catalog-content";
import { PriceTag } from "./price-tag";

type ProductCardProps = {
  product: Product;
  /** Nivel del título según la jerarquía de la página. */
  headingLevel?: 2 | 3;
};

/**
 * Tarjeta compacta de producto. Toda el área es clicable (enlace estirado sobre el título), pero
 * solo el nombre es el texto del enlace: el lector de pantalla no lee la tarjeta entera.
 *
 * Hover / foco (plan §5.5, «Tarjetas de producto»): la foto se atenúa y desenfoca un poco y aparece
 * «Ver más». El botón es decorativo (`aria-hidden`): la acción real es el enlace del título.
 * `hover:` en Tailwind v4 solo aplica con puntero que admite hover, así que en táctil no aparece.
 * Las fotos de la fuente tienen fondo blanco: el marco es blanco para que no se vea el recorte.
 */
export function ProductCard({ product, headingLevel = 3 }: ProductCardProps) {
  const Title = `h${headingLevel}` as const;
  const cover = product.images[0];

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-card bg-white shadow-card ring-1 ring-espresso-900/8 transition-[box-shadow] duration-200 ease-ui hover:shadow-raised has-[a:focus-visible]:ring-2 has-[a:focus-visible]:ring-copper">
      {/* La foto vive en una caja absoluta: una imagen vertical no puede estirar el cuadrado. */}
      <div className="relative aspect-square overflow-hidden">
        {cover ? (
          <div className="absolute inset-3 sm:inset-4 [&_picture]:block [&_picture]:size-full">
          <Picture
            media={cover}
            sizes="(min-width: 1280px) 11rem, (min-width: 1024px) 18vw, (min-width: 768px) 23vw, (min-width: 640px) 30vw, 46vw"
            className="size-full object-contain transition-[opacity,filter] duration-200 ease-ui group-hover:opacity-55 group-hover:blur-[2px] group-has-[a:focus-visible]:opacity-55 group-has-[a:focus-visible]:blur-[2px] motion-reduce:transition-none"
          />
          </div>
        ) : null}
        <span aria-hidden="true" className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <span className="inline-flex min-h-9 translate-y-1 items-center gap-1.5 rounded-full bg-espresso-900 px-4 text-sm font-semibold text-cream-50 opacity-0 shadow-raised transition-[opacity,translate] duration-200 ease-out-soft group-hover:translate-y-0 group-hover:opacity-100 group-has-[a:focus-visible]:translate-y-0 group-has-[a:focus-visible]:opacity-100 motion-reduce:translate-y-0">
            {catalogContent.seeMore}
            <ArrowRightIcon size={14} />
          </span>
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-1 border-t border-espresso-900/6 px-3 pt-3 pb-3.5 text-ink sm:px-4">
        <Title className="line-clamp-2 text-sm leading-snug font-semibold text-pretty">
          <Link
            href={productHref(product)}
            className="after:absolute after:inset-0 after:rounded-card focus-visible:outline-none"
          >
            {product.name}
          </Link>
        </Title>
        {product.presentation ? <p className="text-xs text-muted">{product.presentation}</p> : null}
        <PriceTag price={product.price} size="sm" className="mt-auto pt-1.5" />
      </div>
    </article>
  );
}
