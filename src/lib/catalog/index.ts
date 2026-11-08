import { catalogUrl as legacyCatalogUrl, channels } from "@/content/channels";
import { productLines } from "@/content/product-lines";
import type { Category, Channel, Product, ProductLine } from "@/domain/catalog";
import { getCatalogEnv } from "@/lib/env";
import { fetchCatalog as fetchCmsCatalog } from "./cms/client";
import { mapCategory as mapCmsCategory, mapProduct as mapCmsProduct } from "./cms/mapper";
import { fetchCategories, fetchProducts } from "./strapi/client";
import { mapCategory, mapProduct } from "./strapi/mapper";

/**
 * Punto de acceso a datos del catálogo (plan §12.2): API estable que consume la UI.
 *
 * - `CATALOG_SOURCE=static` (por defecto): canales y líneas desde `src/content/`; sin catálogo propio
 *   (listas vacías) y los CTA apuntan a la tienda actual.
 * - `CATALOG_SOURCE=strapi`: categorías y productos desde Strapi vía `./strapi/*` (fetch + mapper).
 * - `CATALOG_SOURCE=cms`: lo mismo desde el CMS experimental vía `./cms/*` (docs/CMS_EXPERIMENTAL.md).
 *
 * Las funciones son `async`: los componentes de servidor hacen `await` sin saber de dónde vienen los datos.
 */

/** true = el sitio genera /productos/ con datos de un CMS. */
export function isCatalogEnabled(): boolean {
  return getCatalogEnv().source !== "static";
}

const byName = (a: Product, b: Product) => a.name.localeCompare(b.name, "es");

/** Destino de «Conoce nuestro catálogo»: el catálogo propio si existe; si no, la tienda actual. */
export function getCatalogUrl(): string {
  return isCatalogEnabled() ? "/productos/" : legacyCatalogUrl;
}

export async function getChannels(): Promise<Channel[]> {
  return channels;
}

export async function getProductLines(): Promise<ProductLine[]> {
  return productLines;
}

/** Todos los productos publicados, ordenados por nombre. */
export async function getProducts(): Promise<Product[]> {
  const catalog = getCatalogEnv();
  if (catalog.source === "cms") {
    const cms = await fetchCmsCatalog();
    return cms.products
      .map((product) => mapCmsProduct(product, cms))
      .filter((product): product is Product => !!product)
      .sort(byName);
  }
  if (catalog.source !== "strapi") return [];
  const products = await fetchProducts();
  return products
    .map((product) => mapProduct(product, catalog.strapiUrl))
    .filter((product): product is Product => !!product);
}

/** Categorías con al menos un producto publicado, en el orden definido en el CMS. */
export async function getCategories(): Promise<Category[]> {
  const catalog = getCatalogEnv();
  if (catalog.source === "cms") {
    const [cms, products] = await Promise.all([fetchCmsCatalog(), getProducts()]);
    return cms.categories
      .map((category) => mapCmsCategory(category, products.filter((p) => p.category.slug === category.slug).length))
      .filter((category) => category.productCount > 0)
      .sort((a, b) => a.order - b.order || a.name.localeCompare(b.name, "es"));
  }
  if (catalog.source !== "strapi") return [];
  const [categories, products] = await Promise.all([fetchCategories(), getProducts()]);
  return categories
    .map((category) =>
      mapCategory(category, catalog.strapiUrl, products.filter((p) => p.category.slug === category.slug).length),
    )
    .filter((category) => category.productCount > 0);
}

export async function getCategoryBySlug(slug: string): Promise<Category | undefined> {
  return (await getCategories()).find((category) => category.slug === slug);
}

export async function getProductsByCategory(slug: string): Promise<Product[]> {
  return (await getProducts()).filter((product) => product.category.slug === slug);
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  return (await getProducts()).find((product) => product.slug === slug);
}

/**
 * Con `output: "export"`, `generateStaticParams` no puede devolver una lista vacía (error de build).
 * Sin catálogo (CATALOG_SOURCE=static) se genera un único parámetro marcador cuya página responde
 * `notFound()`: el build no falla y la ruta no enlaza ni aparece en el sitemap.
 */
export const CATALOG_PLACEHOLDER = "sin-catalogo";

export function withPlaceholder<T extends Record<string, string>>(params: T[], placeholder: T): T[] {
  return params.length ? params : [placeholder];
}

/** URL interna de una ficha de producto (plan §12.4). */
export const productHref = (product: Pick<Product, "slug" | "category">) =>
  `/productos/${product.category.slug}/${product.slug}/`;

export const categoryHref = (category: Pick<Category, "slug">) => `/productos/${category.slug}/`;
