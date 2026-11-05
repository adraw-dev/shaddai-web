import Link from "next/link";
import type { Category } from "@/domain/catalog";
import { categoryHref } from "@/lib/catalog";
import { cn } from "@/lib/cn";
import { catalogContent } from "./catalog-content";

type CategoryNavProps = {
  categories: Category[];
  /** Categoría de la página actual (se marca con aria-current). */
  current?: string;
};

/**
 * Navegación entre categorías. En móvil es una fila desplazable (sin desbordar la página); desde
 * `sm` se reparte en varias líneas. Áreas táctiles de 44 px.
 */
export function CategoryNav({ categories, current }: CategoryNavProps) {
  return (
    <nav aria-label={catalogContent.index.categoriesLabel} className="-mx-4 sm:mx-0">
      <ul className="flex snap-x gap-2 overflow-x-auto px-4 pb-2 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0">
        {categories.map((category) => {
          const active = category.slug === current;
          return (
            <li key={category.slug} className="shrink-0 snap-start">
              <Link
                href={categoryHref(category)}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-sm font-semibold whitespace-nowrap ring-1 transition-[background-color,color] duration-150 ease-ui",
                  active
                    ? "bg-espresso-900 text-cream-50 ring-espresso-900"
                    : "bg-white/70 text-espresso-900 ring-espresso-900/15 hover:bg-white",
                )}
              >
                {category.name}
                <span className={cn("tabular-nums", active ? "text-sand-300" : "text-muted")}>
                  {category.productCount}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
