import type { Product } from "@/domain/catalog";
import { ProductCard } from "./product-card";

type ProductGridProps = {
  products: Product[];
  headingLevel?: 2 | 3;
};

/**
 * Filas densas de tarjetas compactas: 2 columnas en móvil, 3 → 4 → 5 y 6 en escritorio ancho
 * (≈ 176 px por tarjeta dentro del contenedor de 1200 px).
 */
export function ProductGrid({ products, headingLevel }: ProductGridProps) {
  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {products.map((product) => (
        <li key={product.slug}>
          <ProductCard product={product} headingLevel={headingLevel} />
        </li>
      ))}
    </ul>
  );
}
