'use strict';

/**
 * Carga inicial del catálogo en Strapi (docs/PLAN_STRAPI.md §2–§3).
 *
 * Fuente: docs/referencia/productos/productos.json + imagenes/<slug>/ (extraídos de la tienda actual
 * con scripts/scrape-productos.mjs). No inventa datos: lo que no está en la fuente queda vacío.
 *
 * Uso (desde cms/):
 *   npm run seed                 crea o actualiza canales, categorías, marcas y productos
 *   npm run seed -- --images     vuelve a subir las imágenes aunque el producto ya tenga
 *   npm run seed -- --dry        solo muestra la clasificación, sin escribir nada
 *
 * Idempotente: los productos se identifican por `legacyId` (id de WooCommerce); canales, categorías y
 * marcas por `slug`. Las imágenes solo se suben si el producto aún no tiene (o con --images).
 * Tras la carga inicial, el contenido se edita en el panel: volver a ejecutar el seed SOBRESCRIBE
 * los campos importados de los productos existentes.
 */

const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

const SOURCE_DIR = path.resolve(__dirname, '../../docs/referencia/productos');
const args = new Set(process.argv.slice(2));
const DRY = args.has('--dry');
const FORCE_IMAGES = args.has('--images');

// --- Taxonomía curada (PLAN_STRAPI §3) ---------------------------------------------------------

/** Canales: mismos textos que src/content/channels.ts (MD §1). */
const CHANNELS = [
  { slug: 'horeca', name: 'HORECA', shortDescription: 'Hoteles, restaurantes y cafeterías', order: 1 },
  { slug: 'vending', name: 'VENDING', shortDescription: 'Máquinas expendedoras', order: 2 },
  { slug: 'maquila', name: 'MAQUILA', shortDescription: 'Producción para terceros', order: 3 },
  { slug: 'retail', name: 'RETAIL', shortDescription: 'Venta minorista', order: 4 },
];

/** Categorías de WooCommerce que corresponden a un canal. */
const CHANNEL_BY_WOO_CATEGORY = { HORECA: 'horeca', VENDING: 'vending', RETAIL: 'retail' };

/**
 * Categorías por tipo de producto. Se asignan por el nombre del producto (normalizado, sin tildes);
 * gana la PRIMERA regla que coincide, por eso las más específicas van primero.
 */
const CATEGORIES = [
  { slug: 'lattes-y-leches', name: 'Lattes y leches', order: 1, match: /leche vending|mezcla deslactosada|chai latte|^latte|golden food/ },
  { slug: 'capuchinos', name: 'Capuchinos', order: 2, match: /cappuccino/ },
  { slug: 'cafe', name: 'Café', order: 3, match: /^cafe|cafe soluble|cafe en grano|cafe instantaneo/ },
  { slug: 'chocolates-y-maltas', name: 'Chocolates y maltas', order: 4, match: /chocolate|brune/ },
  { slug: 'tes-y-aromaticas', name: 'Tés y aromáticas', order: 5, match: /te en polvo|aromatica|matcha/ },
  { slug: 'granizados-y-bebidas-frias', name: 'Granizados y bebidas frías', order: 6, match: /granizado|limonada de coco|pina colada|frappe/ },
  { slug: 'helados', name: 'Helados', order: 7, match: /helado/ },
  { slug: 'siropes-y-salsas', name: 'Siropes y salsas', order: 8, match: /syrup|salsa chamoy/ },
  { slug: 'perlas-explosivas', name: 'Perlas explosivas', order: 9, match: /perlas explosivas/ },
  { slug: 'escarchadores-y-cocteleria', name: 'Escarchadores y coctelería', order: 10, match: /escarchador|azucar sabor|sal limon|sal mexicana|zumo de limon/ },
  { slug: 'accesorios', name: 'Accesorios', order: 11, match: /bomba dosificadora|mezcladores/ },
];

/**
 * Orden de evaluación: reglas específicas antes que las genéricas (p. ej. «Granizado de CAFÉ» es un
 * granizado, no café; «Chocolate» antes que «leche»).
 */
const MATCH_ORDER = [
  'accesorios', 'perlas-explosivas', 'siropes-y-salsas', 'escarchadores-y-cocteleria', 'helados',
  'granizados-y-bebidas-frias', 'cafe', 'capuchinos', 'chocolates-y-maltas', 'lattes-y-leches', 'tes-y-aromaticas',
];

/** Corrección mínima de marcas escritas en minúsculas en la fuente. */
const BRAND_NAME_FIX = { 'compañia nacional de chocolates': 'Compañía Nacional de Chocolates' };

/** Atributos de WooCommerce → campos del producto. «Línea» y «Productor» no se importan (redundantes). */
const ATTRIBUTE_FIELDS = {
  'Opción de empaque': 'packaging',
  'Dosificación': 'dosage',
  'Porciones por empaque': 'servingsPerPack',
  'Cantidad por caja (Mayorista)': 'unitsPerBox',
  'Registro INVIMA': 'invimaRegistry',
  'Sabor(es)': 'flavors',
  'Variedad de café': 'coffeeVariety',
};

// --- Utilidades de texto ---------------------------------------------------------------------------

const normalize = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

const slugify = (s) =>
  normalize(s).replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

/** Quita emojis y símbolos decorativos (✅ 👍 🍵 …) que en la tienda actual adornan los textos. */
const stripEmoji = (s) =>
  s
    .replace(/[‍︎️⃣`]/g, '')
    // Espacio (no cadena vacía): en la fuente el emoji a veces es el único separador entre palabras.
    .replace(/[\p{Extended_Pictographic}\u{1F1E6}-\u{1F1FF}\u{1F3FB}-\u{1F3FF}]/gu, ' ');

/** Unifica unidades (gms, grms, gr, g. → g; mls → ml) y corrige erratas tipo «l5OOg» (letras por dígitos). */
const normalizeSize = (s) =>
  s
    .replace(/\b[lI]?\d*O[\dO]*(?=\s*g)/g, (m) => m.replace(/^[lI]/, '1').replace(/O/g, '0'))
    .replace(/(\d+(?:[.,]\d+)?)\s*(?:grms|grs|gms|gm|gr|g)\b\.?/gi, '$1 g')
    .replace(/(\d+(?:[.,]\d+)?)\s*mls?\b\.?/gi, '$1 ml')
    .replace(/(\d+(?:[.,]\d+)?)\s*kg\b\.?/gi, '$1 kg')
    .replace(/\.$/, '')
    .trim();

const cleanLine = (s) => stripEmoji(s).replace(/\s+/g, ' ').replace(/\s+([,.;:])/g, '$1').trim();

const cleanName = (s) => cleanLine(s).replace(/[\s\-–—]+$/g, '').replace(/^[\s\-–—]+/g, '');

const decodeEntities = (s) =>
  s
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;|&apos;/g, "'");

/** Primera frase descriptiva de la descripción corta (se descartan eslóganes cortos y viñetas). */
function shortDescriptionOf(product) {
  const lines = product.descripcion_corta.split('\n').map(cleanLine).filter(Boolean);
  const candidate = lines.find((l) => l.length >= 40 && !/^(opción|presentación|porciones|cantidad|dosificación)/i.test(l)) ?? lines[0] ?? '';
  return candidate.length > 300 ? `${candidate.slice(0, 297).replace(/\s+\S*$/, '')}…` : candidate;
}

/** «Presentación comercial» declarada en la descripción; si no, el tamaño que aparece en el nombre. */
function presentationOf(product) {
  const declared = product.descripcion_corta.match(/Presentaci[oó]n comercial:?\s*([^\n]+)/i);
  if (declared) return normalizeSize(cleanLine(declared[1]).replace(/^:\s*/, ''));
  const size = product.titulo.match(/(\d+(?:[.,]\d+)?)\s*(kg|grms|grs|gms|gr|g|mls|ml|litros?|unidades)\b/i);
  return size ? normalizeSize(`${size[1]} ${size[2]}`) : undefined;
}

// --- HTML de WooCommerce → bloques de Strapi (editor «Blocks») -------------------------------------

/**
 * Conversión deliberadamente limitada: encabezados, párrafos, citas, listas, negrita y cursiva.
 * Los enlaces se convierten en texto (apuntan a la tienda actual, que se va a reemplazar) y se
 * descartan imágenes, botones y separadores.
 */
function htmlToBlocks(html) {
  const blocks = [];
  let cur = null; // bloque que recibe texto en línea
  let list = null;
  let quote = 0;
  let skip = 0; // dentro de <button>
  const marks = { bold: 0, italic: 0 };

  const open = (block) => {
    blocks.push(block);
    cur = block;
  };
  const close = () => {
    cur = null;
  };
  const pushText = (raw) => {
    if (skip) return;
    let text = stripEmoji(decodeEntities(raw)).replace(/[ \t\r\n]+/g, ' ');
    if (!cur) {
      if (!text.trim()) return;
      if (list) return; // texto suelto entre <li>
      open({ type: 'paragraph', children: [] });
    }
    const node = { type: 'text', text };
    if (marks.bold) node.bold = true;
    if (marks.italic) node.italic = true;
    const last = cur.children[cur.children.length - 1];
    if (last && !!last.bold === !!node.bold && !!last.italic === !!node.italic) last.text += text;
    else cur.children.push(node);
  };

  const tokens = html.match(/<!--[\s\S]*?-->|<\/?[a-zA-Z0-9]+[^>]*>|[^<]+/g) ?? [];
  for (const token of tokens) {
    if (token.startsWith('<!--')) continue;
    const tag = token.match(/^<(\/?)([a-zA-Z0-9]+)/);
    if (!tag) {
      pushText(token);
      continue;
    }
    const closing = tag[1] === '/';
    const name = tag[2].toLowerCase();

    switch (name) {
      case 'h1': case 'h2': case 'h3': case 'h4': case 'h5': case 'h6':
        if (closing) close();
        else open({ type: 'heading', level: Math.max(2, Number(name[1])), children: [] });
        break;
      case 'blockquote':
        if (closing) { quote = Math.max(0, quote - 1); close(); }
        else { quote++; open({ type: 'quote', children: [] }); }
        break;
      case 'p': case 'div':
        if (cur?.type === 'list-item') break;
        if (quote && cur?.type === 'quote') {
          if (!closing && cur.children.some((c) => c.text.trim())) pushText('\n');
          break;
        }
        close();
        break;
      case 'ul': case 'ol':
        if (closing) { list = null; close(); }
        else { close(); list = { type: 'list', format: name === 'ol' ? 'ordered' : 'unordered', children: [] }; blocks.push(list); }
        break;
      case 'li':
        if (closing) { cur = null; break; }
        if (!list) { list = { type: 'list', format: 'unordered', children: [] }; blocks.push(list); }
        cur = { type: 'list-item', children: [] };
        list.children.push(cur);
        break;
      case 'br':
        if (cur) cur.children.push({ type: 'text', text: '\n' });
        break;
      case 'strong': case 'b':
        marks.bold += closing ? -1 : 1;
        break;
      case 'em': case 'i':
        marks.italic += closing ? -1 : 1;
        break;
      case 'button':
        skip += closing ? -1 : 1;
        break;
      default: // a, span, img, hr…: transparentes o descartados
        break;
    }
  }

  // Limpieza: fusionar, recortar espacios y descartar bloques vacíos.
  const tidy = (children) => {
    const merged = [];
    for (const c of children) {
      const last = merged[merged.length - 1];
      if (last && !!last.bold === !!c.bold && !!last.italic === !!c.italic) last.text += c.text;
      else merged.push({ ...c });
    }
    for (const c of merged) c.text = c.text.replace(/ *\n */g, '\n').replace(/ {2,}/g, ' ');
    if (merged[0]) merged[0].text = merged[0].text.replace(/^\s+/, '');
    if (merged.at(-1)) merged.at(-1).text = merged.at(-1).text.replace(/\s+$/, '');
    const kept = merged.filter((c) => c.text !== '');
    return kept.length ? kept : null;
  };

  return blocks
    .map((b) => {
      if (b.type === 'list') {
        const items = b.children.map((li) => ({ ...li, children: tidy(li.children) })).filter((li) => li.children);
        return items.length ? { ...b, children: items } : null;
      }
      const children = tidy(b.children);
      return children ? { ...b, children } : null;
    })
    .filter(Boolean);
}

// --- Imágenes ----------------------------------------------------------------------------------------

const MIME = { '.webp': 'image/webp', '.avif': 'image/avif', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png' };

/** Misma imagen (mismo contenido) repetida entre productos → se sube una sola vez. */
const uploadedByHash = new Map();

async function uploadImage(strapi, relPath, alt) {
  const filepath = path.join(SOURCE_DIR, relPath);
  if (!fs.existsSync(filepath)) {
    strapi.log.warn(`Imagen no encontrada: ${relPath}`);
    return null;
  }
  const buffer = fs.readFileSync(filepath);
  const hash = crypto.createHash('sha1').update(buffer).digest('hex');
  if (uploadedByHash.has(hash)) return uploadedByHash.get(hash);

  const ext = path.extname(filepath).toLowerCase();
  const baseName = slugify(stripEmoji(path.basename(filepath, ext))) || 'imagen';
  const [file] = await strapi
    .plugin('upload')
    .service('upload')
    .upload({
      data: { fileInfo: { name: `${baseName}${ext}`, alternativeText: alt } },
      files: { filepath, originalFilename: `${baseName}${ext}`, mimetype: MIME[ext] ?? 'application/octet-stream', size: buffer.length },
    });
  uploadedByHash.set(hash, file.id);
  return file.id;
}

// --- Carga -------------------------------------------------------------------------------------------

async function upsertBySlug(strapi, uid, slug, data) {
  const docs = strapi.documents(uid);
  const existing = await docs.findFirst({ filters: { slug } });
  if (existing) return docs.update({ documentId: existing.documentId, data });
  return docs.create({ data: { ...data, slug } });
}

function categoryOf(product) {
  const title = normalize(product.titulo);
  const slug = MATCH_ORDER.find((s) => CATEGORIES.find((c) => c.slug === s).match.test(title));
  return slug ?? null;
}

function toProductData(product) {
  const data = {
    name: cleanName(product.titulo),
    // Slug de WooCommerce (conserva la URL) normalizado a ASCII: algunos llevan tildes o emojis,
    // que el UID de Strapi no admite. Las URL antiguas se redirigen en S-6.
    slug: slugify(stripEmoji(decodeURIComponent(new URL(product.url).pathname.split('/').filter(Boolean).pop()))),
    sku: product.sku || null,
    shortDescription: shortDescriptionOf(product),
    description: htmlToBlocks(product.descripcion_html || product.descripcion_corta_html),
    presentation: presentationOf(product) ?? null,
    // Precio vigente = el de oferta si existe; el regular queda como «antes».
    price: product.precio ?? null,
    compareAtPrice: product.precio_oferta && product.precio_regular > product.precio ? product.precio_regular : null,
    priceVisible: true,
    legacyId: product.id,
    legacyUrl: product.url,
  };
  for (const field of Object.values(ATTRIBUTE_FIELDS)) data[field] = null;
  for (const attr of product.atributos) {
    const field = ATTRIBUTE_FIELDS[attr.nombre];
    if (field) data[field] = attr.valores.map(cleanLine).filter(Boolean).join(', ') || null;
  }
  return data;
}

async function main() {
  const products = JSON.parse(fs.readFileSync(path.join(SOURCE_DIR, 'productos.json'), 'utf8'));

  const unclassified = products.filter((p) => !categoryOf(p));
  if (unclassified.length) {
    throw new Error(`Productos sin categoría (ajustar CATEGORIES): ${unclassified.map((p) => p.titulo).join(' | ')}`);
  }

  if (DRY) {
    for (const p of products) {
      const d = toProductData(p);
      console.log(`${categoryOf(p).padEnd(28)} ${d.name}  [${d.presentation ?? '—'}]  ${d.price}${d.compareAtPrice ? ` (antes ${d.compareAtPrice})` : ''}`);
    }
    console.log(`\n${products.length} productos (modo --dry, no se escribió nada).`);
    return;
  }

  const { createStrapi, compileStrapi } = require('@strapi/strapi');
  const app = await createStrapi(await compileStrapi()).load();
  app.log.level = 'warn';
  const strapi = app;

  try {
    const channelIds = {};
    for (const { slug, ...data } of CHANNELS) {
      channelIds[slug] = (await upsertBySlug(strapi, 'api::channel.channel', slug, data)).documentId;
    }

    const categoryIds = {};
    for (const { slug, match, ...data } of CATEGORIES) {
      categoryIds[slug] = (await upsertBySlug(strapi, 'api::category.category', slug, data)).documentId;
    }

    const brandIds = {};
    for (const raw of new Set(products.flatMap((p) => p.marcas))) {
      const name = BRAND_NAME_FIX[raw] ?? raw;
      brandIds[raw] = (await upsertBySlug(strapi, 'api::brand.brand', slugify(name), { name })).documentId;
    }

    const docs = strapi.documents('api::product.product');
    let created = 0;
    let updated = 0;
    for (const [index, product] of products.entries()) {
      const data = toProductData(product);
      data.category = categoryIds[categoryOf(product)];
      data.channels = [...new Set(product.categorias.map((c) => CHANNEL_BY_WOO_CATEGORY[c]).filter(Boolean))].map((s) => channelIds[s]);
      data.brand = product.marcas[0] ? brandIds[product.marcas[0]] : null;

      const existing = await docs.findFirst({ filters: { legacyId: product.id }, populate: ['images'], status: 'draft' });
      if (!existing?.images?.length || FORCE_IMAGES) {
        const ids = [];
        for (const rel of product.imagenes_locales) {
          const id = await uploadImage(strapi, rel, data.name);
          if (id) ids.push(id);
        }
        data.images = ids;
      }

      if (existing) {
        await docs.update({ documentId: existing.documentId, data, status: 'published' });
        updated++;
      } else {
        await docs.create({ data, status: 'published' });
        created++;
      }
      process.stdout.write(`\r${index + 1}/${products.length} ${data.name.slice(0, 60).padEnd(60)}`);
    }
    console.log(`\nListo: ${created} productos creados, ${updated} actualizados, ${uploadedByHash.size} imágenes subidas.`);
  } finally {
    await app.destroy();
  }
}

// Reutilizado por scripts/export-catalog.js: la carga solo corre si se invoca este archivo directamente.
if (require.main === module) {
  main().then(
    () => process.exit(0),
    (err) => {
      console.error(err);
      process.exit(1);
    },
  );
}

module.exports = {
  SOURCE_DIR,
  CHANNELS,
  CATEGORIES,
  CHANNEL_BY_WOO_CATEGORY,
  BRAND_NAME_FIX,
  slugify,
  categoryOf,
  toProductData,
};
