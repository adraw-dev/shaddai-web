import path from "node:path";
import type {
  Category,
  Channel,
  Media,
  Product,
  ProductSpec,
  RichTextBlock,
  RichTextInline,
} from "@/domain/catalog";
import { imageInfo } from "./image-size";
import type { CmsCatalog, CmsCategoryData, CmsImageRef, CmsProductData } from "./types";

/**
 * CMS experimental → tipos de dominio. ÚNICO lugar que traduce la forma del CMS (plan §12.2).
 */

// ---------------------------------------------------------------- Imágenes

/**
 * Las fotos del catálogo siguen en este repositorio (`docs/referencia/productos/imagenes/`) y el CMS
 * guarda su ruta. `scripts/sync-catalog-images.mjs` (predev/prebuild) las copia a `public/catalogo/`.
 */
const IMAGE_SOURCE_DIR = "docs/referencia/productos/imagenes/";
export const IMAGE_PUBLIC_PREFIX = "/catalogo/";

function parseImages(raw: string | undefined): CmsImageRef[] {
  if (!raw) return [];
  try {
    const value: unknown = JSON.parse(raw);
    return Array.isArray(value)
      ? value.filter((v): v is CmsImageRef => !!v && typeof v === "object" && typeof v.path === "string")
      : [];
  } catch {
    return [];
  }
}

function mapImage(ref: CmsImageRef, fallbackAlt: string): Media | undefined {
  const rel = path.posix.normalize(ref.path);
  if (!rel.startsWith(IMAGE_SOURCE_DIR) || rel.includes("..")) return undefined;
  const info = imageInfo(path.join(process.cwd(), rel));
  if (!info) return undefined;
  const src = IMAGE_PUBLIC_PREFIX + rel.slice(IMAGE_SOURCE_DIR.length).split("/").map(encodeURIComponent).join("/");
  return {
    alt: ref.alt?.trim() || fallbackAlt,
    width: info.width,
    height: info.height,
    variants: [{ src, width: info.width, mime: info.mime }],
  };
}

// ---------------------------------------------------------------- Texto enriquecido

const ENTITIES: Record<string, string> = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " " };

const decode = (s: string) =>
  s.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, e: string) => {
    if (e[0] === "#") {
      const code = e[1] === "x" || e[1] === "X" ? parseInt(e.slice(2), 16) : Number(e.slice(1));
      return Number.isFinite(code) ? String.fromCodePoint(code) : m;
    }
    return ENTITIES[e.toLowerCase()] ?? m;
  });

/**
 * HTML del editor del CMS → bloques del dominio. Solo se reconocen párrafos, títulos, citas, listas,
 * negrita, cursiva y saltos de línea; cualquier otra etiqueta se descarta y se conserva su texto.
 */
export function htmlToRichText(html: string | undefined): RichTextBlock[] {
  const blocks: RichTextBlock[] = [];
  let current: { type: "paragraph" | "quote" | "heading"; level?: 3 | 4; children: RichTextInline[] } | null = null;
  let list: { ordered: boolean; items: RichTextInline[][] } | null = null;
  let item: RichTextInline[] | null = null;
  let quote = 0;
  const marks = { bold: 0, italic: 0 };

  const flush = () => {
    if (current) {
      const children = tidy(current.children);
      if (children.length) {
        blocks.push(
          current.type === "heading"
            ? { type: "heading", level: current.level ?? 3, children }
            : { type: current.type, children },
        );
      }
    }
    current = null;
  };
  const closeList = () => {
    if (list) {
      const items = list.items.map(tidy).filter((i) => i.length);
      if (items.length) blocks.push({ type: "list", ordered: list.ordered, items });
    }
    list = null;
    item = null;
  };
  const push = (text: string) => {
    const target = item ?? (current ??= { type: quote ? "quote" : "paragraph", children: [] }).children;
    const node: RichTextInline = { text };
    if (marks.bold) node.bold = true;
    if (marks.italic) node.italic = true;
    const last = target[target.length - 1];
    if (last && !!last.bold === !!node.bold && !!last.italic === !!node.italic) last.text += text;
    else target.push(node);
  };

  for (const token of (html ?? "").match(/<!--[\s\S]*?-->|<\/?[a-zA-Z][^>]*>|[^<]+/g) ?? []) {
    if (token.startsWith("<!--")) continue;
    const tag = token.match(/^<(\/?)([a-zA-Z0-9]+)/);
    if (!tag) {
      const text = decode(token);
      if (!text.trim() && !current && !item) continue; // espacio entre bloques
      if (list && !item) continue; // texto suelto entre <li>
      push(text);
      continue;
    }
    const closing = tag[1] === "/";
    const name = tag[2].toLowerCase();
    switch (name) {
      case "p":
      case "div":
        if (!item) flush();
        break;
      case "h1": case "h2": case "h3": case "h4": case "h5": case "h6":
        flush();
        // h1 es el nombre del producto y h2 los títulos de la ficha: la descripción empieza en h3.
        if (!closing) current = { type: "heading", level: Math.min(4, Math.max(3, Number(name[1]) + 1)) as 3 | 4, children: [] };
        break;
      case "blockquote":
        flush();
        quote = Math.max(0, quote + (closing ? -1 : 1));
        break;
      case "ul":
      case "ol":
        flush();
        closeList();
        if (!closing) list = { ordered: name === "ol", items: [] };
        break;
      case "li":
        if (closing) item = null;
        else {
          list ??= { ordered: false, items: [] };
          item = [];
          list.items.push(item);
        }
        break;
      case "br":
        if (current || item) push("\n");
        break;
      case "strong":
      case "b":
        marks.bold = Math.max(0, marks.bold + (closing ? -1 : 1));
        break;
      case "em":
      case "i":
        marks.italic = Math.max(0, marks.italic + (closing ? -1 : 1));
        break;
      default: // a, span, img…: transparentes o descartados
        break;
    }
  }
  flush();
  closeList();
  return blocks;
}

/** Une nodos con las mismas marcas, recorta espacios en los extremos y quita los vacíos. */
function tidy(nodes: RichTextInline[]): RichTextInline[] {
  const out = nodes.map((n) => ({ ...n, text: n.text.replace(/[ \t]+/g, " ").replace(/ *\n */g, "\n") }));
  // Un salto al final de un fragmento no debe dejar sangría al inicio del siguiente (p. ej. negrita tras <br>).
  out.forEach((n, i) => {
    if (i > 0 && out[i - 1].text.endsWith("\n")) n.text = n.text.trimStart();
  });
  if (out[0]) out[0].text = out[0].text.trimStart();
  if (out.at(-1)) out.at(-1)!.text = out.at(-1)!.text.trimEnd();
  return out.filter((n) => n.text !== "");
}

// ---------------------------------------------------------------- Producto y categoría

const text = (v: unknown) => (typeof v === "string" ? v.trim() : "");
const num = (v: unknown) => (typeof v === "number" && Number.isFinite(v) ? v : undefined);

const CHANNEL_SLUGS: readonly Channel["slug"][] = ["horeca", "vending", "maquila", "retail"];
const isChannelSlug = (slug: string): slug is Channel["slug"] =>
  (CHANNEL_SLUGS as readonly string[]).includes(slug);

function specsOf(product: CmsProductData, brand: string | undefined): ProductSpec[] {
  const rows: [string, unknown][] = [
    ["Presentación", product.presentation],
    ["Marca", brand],
    ["Sabores", product.flavors],
    ["Variedad de café", product.coffeevariety],
    ["Empaque", product.packaging],
    ["Porciones por empaque", product.servingsperpack],
    ["Dosificación", product.dosage],
    ["Cantidad por caja (mayorista)", product.unitsperbox],
    ["Registro INVIMA", product.invimaregistry],
    ["Referencia (SKU)", product.sku],
  ];
  return rows.map(([label, value]) => ({ label, value: text(value) })).filter((row) => row.value !== "");
}

export function mapProduct(product: CmsProductData, catalog: CmsCatalog): Product | undefined {
  const name = text(product.name);
  const slug = text(product.slug);
  // Sin categoría publicada no hay URL (/productos/[categoria]/[slug]/): se omite.
  const category = catalog.categories.find((c) => c.slug === text(product.category));
  if (!name || !slug || !category) return undefined;

  const brand = catalog.brands.find((b) => b.slug === text(product.brand))?.name;
  const images = parseImages(product.images)
    .sort((a, b) => Number(!!b.isCover) - Number(!!a.isCover))
    .map((ref) => mapImage(ref, name))
    .filter((media): media is Media => !!media);

  const amount = num(product.price);
  const compareAt = num(product.compareatprice);
  const price =
    amount != null
      ? {
          amount,
          compareAtAmount: compareAt != null && compareAt > amount ? compareAt : undefined,
          currency: "COP" as const,
          visible: product.pricevisible ?? true,
        }
      : undefined;

  return {
    slug,
    name,
    category: { slug: category.slug, name: category.name },
    channels: [...new Set(text(product.channels).split(",").map((s) => s.trim().toLowerCase()))].filter(isChannelSlug),
    brand,
    shortDescription: text(product.shortdescription),
    description: htmlToRichText(product.description),
    images,
    presentation: text(product.presentation) || undefined,
    specs: specsOf(product, brand),
    sku: text(product.sku) || undefined,
    price,
    featured: product.featured ?? false,
  };
}

export function mapCategory(category: CmsCategoryData, productCount: number): Category {
  return {
    slug: category.slug,
    name: category.name,
    description: text(category.description) || undefined,
    order: num(category.order) ?? 0,
    productCount,
  };
}
