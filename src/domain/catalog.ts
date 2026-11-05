/**
 * Tipos de dominio del negocio (plan §12.3). Independientes de la fuente de datos:
 * hoy se alimentan de `src/content/`; en la fase de Strapi, de un mapper (lib/catalog/strapi/*).
 * Los componentes SOLO conocen estos tipos, nunca la forma de Strapi.
 */

export type MediaVariant = {
  src: string;
  /** Ancho intrínseco en px (para `srcset`). */
  width: number;
  /** Tipo MIME, p. ej. `image/avif`, `image/webp`, `image/png`. */
  mime?: string;
};

export type Media = {
  /** Texto alternativo en español. Cadena vacía = decorativa. */
  alt: string;
  /** Dimensiones de la variante de referencia (evita CLS). */
  width: number;
  height: number;
  variants: MediaVariant[];
  blurDataUrl?: string;
};

export type Channel = {
  slug: "horeca" | "vending" | "maquila" | "retail";
  name: string;
  /** Definición de una línea (MD §1). */
  shortDescription: string;
  description?: string;
  /** Productos que Shaddai menciona para el canal. */
  highlights?: string[];
  image?: Media;
  href: string;
};

export type ProductLine = {
  slug: string;
  name: string;
  description: string;
  image: Media;
};

export type Category = {
  slug: string;
  name: string;
  description?: string;
  channel?: Channel["slug"];
  image?: Media;
  order: number;
};

export type Price = {
  amount: number;
  currency: "COP";
  unit?: string;
  /** false = se muestra «Cotizar» en lugar del precio. */
  visible: boolean;
};

export type Product = {
  slug: string;
  name: string;
  category: Category["slug"];
  channels: Channel["slug"][];
  shortDescription: string;
  description?: string;
  images: Media[];
  presentation?: string;
  sku?: string;
  price?: Price;
  featured: boolean;
};
