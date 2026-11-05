// Extrae el catálogo de https://www.shaddaicolombia.com (WooCommerce Store API pública)
// y descarga las imágenes de cada producto.
//
// Uso:  node --use-system-ca scripts/scrape-productos.mjs [carpeta-salida]
// Salida por defecto: docs/referencia/productos/
//   productos.json   → datos completos (incluye descripciones en HTML y texto plano)
//   productos.csv    → una fila por producto (UTF-8 con BOM, separador ";", abre en Excel)
//   imagenes/<slug>/ → imágenes originales de cada producto
//
// Sin dependencias: solo APIs nativas de Node 22.

import { mkdir, writeFile, access } from "node:fs/promises";
import path from "node:path";

const BASE = "https://www.shaddaicolombia.com/wp-json/wc/store/v1";
const OUT = path.resolve(process.argv[2] ?? "docs/referencia/productos");
const IMG_DIR = path.join(OUT, "imagenes");
const UA = "Mozilla/5.0 (catalogo-shaddai)";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function get(url, tries = 3) {
  for (let i = 1; ; i++) {
    try {
      const res = await fetch(url, { headers: { "User-Agent": UA, Accept: "application/json" } });
      if (!res.ok) throw new Error(`HTTP ${res.status} en ${url}`);
      return res;
    } catch (err) {
      if (i >= tries) throw err;
      await sleep(1000 * i);
    }
  }
}

const decodeEntities = (s) =>
  s
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;|&apos;/g, "'");

const htmlToText = (html = "") =>
  decodeEntities(
    html
      .replace(/<li[^>]*>/gi, "\n• ")
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/(p|div|h[1-6]|li|ul|ol|tr)>/gi, "\n")
      .replace(/<[^>]+>/g, ""),
  )
    .replace(/[ \t]+/g, " ")
    .replace(/ *\n */g, "\n")
    .replace(/\n{2,}/g, "\n")
    .replace(/•\s*\n/g, "• ")
    .trim();

const formatPrice = (minor, prices) => {
  if (minor === "" || minor == null) return null;
  return Number(minor) / 10 ** prices.currency_minor_unit;
};

async function fetchAllProducts() {
  const all = [];
  for (let page = 1; ; page++) {
    const res = await get(`${BASE}/products?per_page=100&page=${page}&orderby=id&order=asc`);
    const items = await res.json();
    all.push(...items);
    const totalPages = Number(res.headers.get("x-wp-totalpages") ?? 1);
    console.log(`Página ${page}/${totalPages}: ${items.length} productos`);
    if (page >= totalPages || items.length === 0) break;
  }
  return all;
}

async function fileExists(p) {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

async function downloadImage(url, destDir) {
  const name = decodeURIComponent(new URL(url).pathname.split("/").pop());
  const dest = path.join(destDir, name);
  if (!(await fileExists(dest))) {
    const res = await get(url);
    await writeFile(dest, Buffer.from(await res.arrayBuffer()));
  }
  return path.relative(OUT, dest).split(path.sep).join("/");
}

function mapProduct(p) {
  const pr = p.prices;
  return {
    id: p.id,
    titulo: decodeEntities(p.name),
    sku: p.sku || null,
    tipo: p.type,
    url: p.permalink,
    precio: formatPrice(pr.price, pr),
    precio_regular: formatPrice(pr.regular_price, pr),
    precio_oferta: p.on_sale ? formatPrice(pr.sale_price, pr) : null,
    rango_precio: pr.price_range
      ? { min: formatPrice(pr.price_range.min_amount, pr), max: formatPrice(pr.price_range.max_amount, pr) }
      : null,
    moneda: pr.currency_code,
    en_stock: p.is_in_stock,
    marcas: (p.brands ?? []).map((b) => decodeEntities(b.name)),
    categorias: p.categories.map((c) => decodeEntities(c.name)),
    etiquetas: p.tags.map((t) => decodeEntities(t.name)),
    atributos: p.attributes.map((a) => ({ nombre: a.name, valores: a.terms.map((t) => t.name) })),
    descripcion_corta: htmlToText(p.short_description),
    descripcion: htmlToText(p.description),
    descripcion_corta_html: p.short_description,
    descripcion_html: p.description,
    imagenes_url: p.images.map((i) => i.src),
    imagenes_locales: [],
    variaciones: [],
    _variationIds: p.variations.map((v) => v.id),
  };
}

const csvCell = (v) => {
  const s = Array.isArray(v) ? v.join(" | ") : v == null ? "" : String(v);
  return /[";\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

async function main() {
  await mkdir(IMG_DIR, { recursive: true });
  const raw = await fetchAllProducts();
  const productos = raw.map(mapProduct);

  for (const prod of productos) {
    // Variaciones (productos variables): SKU y precio propios.
    for (const vid of prod._variationIds) {
      const v = await (await get(`${BASE}/products/${vid}`)).json();
      prod.variaciones.push({
        id: v.id,
        sku: v.sku || null,
        atributos: v.variation,
        precio: formatPrice(v.prices.price, v.prices),
        precio_regular: formatPrice(v.prices.regular_price, v.prices),
        en_stock: v.is_in_stock,
        imagen_url: v.images[0]?.src ?? null,
      });
      if (v.images[0]?.src && !prod.imagenes_url.includes(v.images[0].src)) prod.imagenes_url.push(v.images[0].src);
    }
    delete prod._variationIds;

    const safeSlug = decodeURIComponent(prod.url.split("/").filter(Boolean).pop() ?? "")
      .normalize("NFD")
      .replace(/[^a-z0-9-]/gi, "")
      .replace(/-{2,}/g, "-")
      .replace(/^-|-$/g, "")
      .toLowerCase();
    const dir = path.join(IMG_DIR, safeSlug || String(prod.id));
    await mkdir(dir, { recursive: true });
    for (const src of prod.imagenes_url) {
      try {
        prod.imagenes_locales.push(await downloadImage(src, dir));
      } catch (err) {
        console.warn(`  ⚠ No se pudo descargar ${src}: ${err.message}`);
      }
    }
    console.log(`✓ ${prod.titulo} (${prod.imagenes_locales.length} img)`);
  }

  await writeFile(path.join(OUT, "productos.json"), JSON.stringify(productos, null, 2) + "\n");

  const cols = [
    ["id", "id"], ["titulo", "titulo"], ["sku", "sku"], ["precio", "precio"],
    ["precio_regular", "precio_regular"], ["precio_oferta", "precio_oferta"], ["moneda", "moneda"],
    ["marca", "marcas"], ["categorias", "categorias"], ["etiquetas", "etiquetas"],
    ["descripcion_corta", "descripcion_corta"], ["descripcion", "descripcion"],
    ["imagenes_url", "imagenes_url"], ["imagenes_locales", "imagenes_locales"], ["url", "url"],
  ];
  const rows = productos.map((p) => {
    const precio = p.rango_precio ? `${p.rango_precio.min} - ${p.rango_precio.max}` : p.precio;
    return cols.map(([, k]) => csvCell(k === "precio" ? precio : p[k])).join(";");
  });
  await writeFile(
    path.join(OUT, "productos.csv"),
    "﻿" + [cols.map(([h]) => h).join(";"), ...rows].join("\r\n") + "\r\n",
  );

  console.log(`\nListo: ${productos.length} productos → ${OUT}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
