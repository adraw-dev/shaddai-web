/**
 * Forma de las respuestas del CMS experimental (copiaSanity, docs/CMS_EXPERIMENTAL.md).
 * SOLO `lib/catalog/cms/*` conoce estos tipos (plan §12.2): el resto del sitio usa `domain/`.
 *
 * El CMS guarda cada documento como un objeto libre (`data`) cuyas claves son las de Strapi en
 * minúsculas (el importador quita mayúsculas: `shortDescription` → `shortdescription`). Las relaciones
 * se guardaron como texto con el `slug` del destino, y las imágenes como el JSON de `catalogo.json`.
 */

export type CmsDocument<T> = {
  id: string;
  typeId: string;
  /** null = nunca publicado (o retirado). El sitio solo lee lo publicado. */
  published: T | null;
  publishedAt: string | null;
};

export type CmsChannelData = {
  slug: string;
  name: string;
  shortdescription?: string;
  order?: number;
};

export type CmsCategoryData = {
  slug: string;
  name: string;
  description?: string;
  order?: number;
};

export type CmsBrandData = {
  slug: string;
  name: string;
};

/** Elemento del campo `images` (texto con JSON). `path` es relativo a la raíz de este repositorio. */
export type CmsImageRef = { path: string; alt?: string; isCover?: boolean };

export type CmsProductData = {
  name: string;
  slug: string;
  sku?: string;
  shortdescription?: string;
  /** HTML limitado del editor (p, strong, em, ul/ol/li, br). */
  description?: string;
  presentation?: string;
  price?: number;
  compareatprice?: number;
  pricevisible?: boolean;
  packaging?: string;
  dosage?: string;
  servingsperpack?: string;
  unitsperbox?: string;
  invimaregistry?: string;
  flavors?: string;
  coffeevariety?: string;
  /** JSON de `CmsImageRef[]`. */
  images?: string;
  /** Slug de la categoría. */
  category?: string;
  /** Slugs de canal separados por coma («horeca, retail»). */
  channels?: string;
  /** Slug de la marca. */
  brand?: string;
  featured?: boolean;
};

export type CmsCatalog = {
  channels: CmsChannelData[];
  categories: CmsCategoryData[];
  brands: CmsBrandData[];
  products: CmsProductData[];
};
