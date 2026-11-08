'use strict';

/**
 * Exporta el catálogo en un JSON neutral (sin ids de Strapi) para cargarlo en otro CMS.
 * Rama experimental `exp/cms-experimental`; formato documentado en docs/CMS_EXPERIMENTAL.md.
 *
 * Reutiliza la limpieza y clasificación de scripts/seed.js, así que el resultado es el mismo
 * contenido que hoy se carga en Strapi. Las relaciones se expresan por `slug`.
 *
 * Uso (desde cms/):  npm run export:catalog
 * Salida:            docs/cms-experimental/catalogo.json
 */

const fs = require('node:fs');
const path = require('node:path');
const {
  SOURCE_DIR,
  CHANNELS,
  CATEGORIES,
  CHANNEL_BY_WOO_CATEGORY,
  BRAND_NAME_FIX,
  slugify,
  categoryOf,
  toProductData,
} = require('./seed');

const REPO_ROOT = path.resolve(__dirname, '../..');
const OUT_FILE = path.join(REPO_ROOT, 'docs/cms-experimental/catalogo.json');

const toPosix = (p) => p.split(path.sep).join('/');

const products = JSON.parse(fs.readFileSync(path.join(SOURCE_DIR, 'productos.json'), 'utf8'));

const brandSlugOf = (raw) => slugify(BRAND_NAME_FIX[raw] ?? raw);

const brands = [...new Set(products.flatMap((p) => p.marcas))]
  .map((raw) => ({ slug: brandSlugOf(raw), name: BRAND_NAME_FIX[raw] ?? raw }))
  .sort((a, b) => a.name.localeCompare(b.name, 'es'));

const catalog = {
  formatVersion: 1,
  source: 'docs/referencia/productos/productos.json (WooCommerce de shaddaicolombia.com)',
  currency: 'COP',
  channels: CHANNELS,
  categories: CATEGORIES.map(({ match, ...c }) => ({ ...c, description: null })),
  brands,
  products: products.map((p) => {
    const data = toProductData(p);
    const category = categoryOf(p);
    if (!category) throw new Error(`Producto sin categoría: ${p.titulo}`);
    return {
      ...data,
      descriptionHtml: p.descripcion_html || p.descripcion_corta_html || null,
      images: p.imagenes_locales.map((rel, i) => ({
        path: toPosix(path.relative(REPO_ROOT, path.join(SOURCE_DIR, rel))),
        alt: data.name,
        isCover: i === 0,
      })),
      category,
      channels: [...new Set(p.categorias.map((c) => CHANNEL_BY_WOO_CATEGORY[c]).filter(Boolean))],
      brand: p.marcas[0] ? brandSlugOf(p.marcas[0]) : null,
      featured: false,
      seo: null,
      status: 'published',
    };
  }),
};

fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true });
fs.writeFileSync(OUT_FILE, `${JSON.stringify(catalog, null, 2)}\n`);
console.log(
  `Exportado ${toPosix(path.relative(REPO_ROOT, OUT_FILE))}: ${catalog.products.length} productos, ` +
    `${catalog.categories.length} categorías, ${catalog.channels.length} canales, ${catalog.brands.length} marcas.`,
);
