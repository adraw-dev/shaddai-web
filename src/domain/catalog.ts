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
  /** Página del canal en el catálogo. Ausente = no hay enlace válido (se consulta por WhatsApp). */
  href?: string;
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
  /** Productos publicados en la categoría (para ocultar las vacías). */
  productCount: number;
};

export type Price = {
  amount: number;
  /** Precio anterior cuando hay oferta (se muestra tachado). */
  compareAtAmount?: number;
  currency: "COP";
  unit?: string;
  /** false = se muestra «Cotizar» en lugar del precio. */
  visible: boolean;
};

/** Texto enriquecido mínimo (subconjunto de los «Blocks» de Strapi, sin HTML arbitrario). */
export type RichTextInline = { text: string; bold?: boolean; italic?: boolean };

export type RichTextBlock =
  | { type: "paragraph" | "quote"; children: RichTextInline[] }
  | { type: "heading"; level: 2 | 3 | 4; children: RichTextInline[] }
  | { type: "list"; ordered: boolean; items: RichTextInline[][] };

/** Dato de ficha técnica ya rotulado (presentación, dosificación, INVIMA…). */
export type ProductSpec = { label: string; value: string };

export type Seo = {
  title?: string;
  description?: string;
  image?: Media;
};

export type Product = {
  slug: string;
  name: string;
  category: Pick<Category, "slug" | "name">;
  channels: Channel["slug"][];
  brand?: string;
  shortDescription: string;
  description: RichTextBlock[];
  images: Media[];
  presentation?: string;
  /** Ficha técnica en el orden en que se muestra. */
  specs: ProductSpec[];
  sku?: string;
  price?: Price;
  featured: boolean;
  seo?: Seo;
};
