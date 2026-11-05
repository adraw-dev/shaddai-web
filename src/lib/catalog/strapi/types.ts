/**
 * Forma de las respuestas de la API REST de Strapi 5 (docs/PLAN_STRAPI.md §3).
 * SOLO `lib/catalog/strapi/*` conoce estos tipos (plan §12.2): el resto del sitio usa `domain/`.
 * Strapi 5 devuelve documentos «planos» (sin `attributes`) identificados por `documentId`.
 */

export type StrapiImageFormat = {
  url: string;
  width: number;
  height: number;
  mime: string;
};

export type StrapiMedia = {
  id: number;
  documentId: string;
  url: string;
  width: number | null;
  height: number | null;
  mime: string;
  alternativeText: string | null;
  formats: Partial<Record<"thumbnail" | "small" | "medium" | "large", StrapiImageFormat>> | null;
};

export type StrapiTextNode = { type: "text"; text: string; bold?: boolean; italic?: boolean };
export type StrapiLinkNode = { type: "link"; url: string; children: StrapiTextNode[] };
export type StrapiInlineNode = StrapiTextNode | StrapiLinkNode;

export type StrapiBlock =
  | { type: "paragraph" | "quote"; children: StrapiInlineNode[] }
  | { type: "heading"; level: 1 | 2 | 3 | 4 | 5 | 6; children: StrapiInlineNode[] }
  | { type: "list"; format: "ordered" | "unordered"; children: { type: "list-item"; children: StrapiInlineNode[] }[] }
  | { type: "image" | "code"; [key: string]: unknown };

export type StrapiCategory = {
  documentId: string;
  name: string;
  slug: string;
  description: string | null;
  order: number | null;
  image?: StrapiMedia | null;
  products?: { count: number };
};

export type StrapiProduct = {
  documentId: string;
  name: string;
  slug: string;
  sku: string | null;
  shortDescription: string | null;
  description: StrapiBlock[] | null;
  images?: StrapiMedia[] | null;
  category?: Pick<StrapiCategory, "slug" | "name"> | null;
  channels?: { slug: string }[];
  brand?: { name: string } | null;
  presentation: string | null;
  packaging: string | null;
  dosage: string | null;
  servingsPerPack: string | null;
  unitsPerBox: string | null;
  invimaRegistry: string | null;
  flavors: string | null;
  coffeeVariety: string | null;
  price: number | null;
  compareAtPrice: number | null;
  priceVisible: boolean | null;
  featured: boolean | null;
  seo?: {
    metaTitle: string | null;
    metaDescription: string | null;
    shareImage?: StrapiMedia | null;
  } | null;
};

export type StrapiCollection<T> = {
  data: T[];
  meta: { pagination: { page: number; pageSize: number; pageCount: number; total: number } };
};
