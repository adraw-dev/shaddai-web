import type {
  Category,
  Channel,
  Media,
  MediaVariant,
  Product,
  ProductSpec,
  RichTextBlock,
  RichTextInline,
} from "@/domain/catalog";
import type { StrapiBlock, StrapiCategory, StrapiInlineNode, StrapiMedia, StrapiProduct } from "./types";

/**
 * Strapi → tipos de dominio. ÚNICO lugar que traduce la forma de Strapi (plan §12.2).
 * `baseUrl` convierte las rutas relativas del proveedor local (`/uploads/…`) en absolutas.
 */

const absolute = (url: string, baseUrl: string) => (/^https?:\/\//.test(url) ? url : `${baseUrl}${url}`);

/** Variantes para `srcset`: los `formats` que genera Strapi + el original, de menor a mayor ancho. */
export function mapMedia(file: StrapiMedia, baseUrl: string, fallbackAlt: string): Media | undefined {
  if (!file.width || !file.height) return undefined;
  const variants: MediaVariant[] = Object.values(file.formats ?? {})
    .filter((f) => f && f.width < file.width!)
    .map((f) => ({ src: absolute(f.url, baseUrl), width: f.width, mime: f.mime }));
  variants.push({ src: absolute(file.url, baseUrl), width: file.width, mime: file.mime });
  variants.sort((a, b) => a.width - b.width);

  return {
    alt: file.alternativeText?.trim() || fallbackAlt,
    width: file.width,
    height: file.height,
    variants,
  };
}

const inline = (nodes: StrapiInlineNode[]): RichTextInline[] =>
  nodes
    .flatMap((node) => (node.type === "link" ? node.children : [node]))
    .filter((node) => node.text !== "")
    .map(({ text, bold, italic }) => ({ text, ...(bold ? { bold } : {}), ...(italic ? { italic } : {}) }));

/** Solo los bloques que el sitio sabe mostrar; imágenes y código del editor se ignoran. */
export function mapRichText(blocks: StrapiBlock[] | null): RichTextBlock[] {
  const result: RichTextBlock[] = [];
  for (const block of blocks ?? []) {
    switch (block.type) {
      case "paragraph":
      case "quote": {
        const children = inline(block.children);
        if (children.length) result.push({ type: block.type, children });
        break;
      }
      case "heading": {
        const children = inline(block.children);
        // h1 es el nombre del producto y h2 los títulos de la ficha: la descripción empieza en h3.
        const level = Math.min(4, Math.max(3, block.level + 1)) as 3 | 4;
        if (children.length) result.push({ type: "heading", level, children });
        break;
      }
      case "list": {
        const items = block.children.map((item) => inline(item.children)).filter((item) => item.length);
        if (items.length) result.push({ type: "list", ordered: block.format === "ordered", items });
        break;
      }
    }
  }
  return result;
}

/** Ficha técnica con rótulos en español; solo los campos con valor. */
function specsOf(product: StrapiProduct): ProductSpec[] {
  const rows: [string, string | null | undefined][] = [
    ["Presentación", product.presentation],
    ["Marca", product.brand?.name],
    ["Sabores", product.flavors],
    ["Variedad de café", product.coffeeVariety],
    ["Empaque", product.packaging],
    ["Porciones por empaque", product.servingsPerPack],
    ["Dosificación", product.dosage],
    ["Cantidad por caja (mayorista)", product.unitsPerBox],
    ["Registro INVIMA", product.invimaRegistry],
    ["Referencia (SKU)", product.sku],
  ];
  return rows
    .map(([label, value]) => ({ label, value: value?.trim() ?? "" }))
    .filter((row) => row.value !== "");
}

const CHANNEL_SLUGS: readonly Channel["slug"][] = ["horeca", "vending", "maquila", "retail"];
const isChannelSlug = (slug: string): slug is Channel["slug"] =>
  (CHANNEL_SLUGS as readonly string[]).includes(slug);

export function mapProduct(product: StrapiProduct, baseUrl: string): Product | undefined {
  // Un producto sin categoría no tiene URL (/productos/[categoria]/[slug]/): se omite.
  if (!product.category) return undefined;

  const images = (product.images ?? [])
    .map((file) => mapMedia(file, baseUrl, product.name))
    .filter((media): media is Media => !!media);

  const price =
    product.price != null
      ? {
          amount: product.price,
          compareAtAmount:
            product.compareAtPrice != null && product.compareAtPrice > product.price ? product.compareAtPrice : undefined,
          currency: "COP" as const,
          visible: product.priceVisible ?? true,
        }
      : undefined;

  const shareImage = product.seo?.shareImage ? mapMedia(product.seo.shareImage, baseUrl, product.name) : undefined;

  return {
    slug: product.slug,
    name: product.name,
    category: { slug: product.category.slug, name: product.category.name },
    channels: (product.channels ?? []).map((c) => c.slug).filter(isChannelSlug),
    brand: product.brand?.name,
    shortDescription: product.shortDescription?.trim() ?? "",
    description: mapRichText(product.description),
    images,
    presentation: product.presentation ?? undefined,
    specs: specsOf(product),
    sku: product.sku ?? undefined,
    price,
    featured: product.featured ?? false,
    seo: product.seo
      ? {
          title: product.seo.metaTitle ?? undefined,
          description: product.seo.metaDescription ?? undefined,
          image: shareImage,
        }
      : undefined,
  };
}

export function mapCategory(category: StrapiCategory, baseUrl: string, productCount: number): Category {
  return {
    slug: category.slug,
    name: category.name,
    description: category.description ?? undefined,
    image: category.image ? mapMedia(category.image, baseUrl, category.name) : undefined,
    order: category.order ?? 0,
    productCount,
  };
}
