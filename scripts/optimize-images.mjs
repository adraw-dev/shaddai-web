#!/usr/bin/env node
/**
 * Optimiza las imágenes de `assets-src/images/**` hacia `public/images/**` (AVIF + WebP + respaldo)
 * en varios anchos, y genera `src/content/images.generated.json` (manifiesto que consume el contenido).
 *
 * Por qué un script y no `next/image`: el sitio es estático (docs/PLAN_DESARROLLO.md §7.2).
 * Por qué no hay `sharp` en package.json: se usa solo aquí y de forma puntual (§7.3). Dos formas de correrlo:
 *
 *   npm install --no-save sharp && node scripts/optimize-images.mjs
 *   SHARP_DIR=/ruta/donde/esta/instalado/sharp node scripts/optimize-images.mjs
 *
 * Cuando el cliente entregue originales de mayor resolución (plan D-05): reemplazarlos en
 * `assets-src/images/`, ajustar `widths` abajo si hace falta y volver a correr el script.
 * Los archivos generados SÍ se versionan (el build no depende de sharp).
 */
import fs from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(
  process.env.SHARP_DIR ? path.join(process.env.SHARP_DIR, "noop.js") : import.meta.url,
);
const sharp = require("sharp");

/**
 * `widths` = anchos a generar (nunca mayores que el original: no se amplía).
 * `fallback` = formato de respaldo para navegadores sin AVIF/WebP (PNG si hay transparencia, JPEG si es foto).
 */
const sources = [
  { key: "logo", file: "brand/shaddai-logo.png", widths: [200, 400], fallback: "png" },
  { key: "linea-lattes", file: "products/linea-lattes.png", widths: [176, 320], fallback: "png" },
  { key: "linea-cafe", file: "products/linea-cafe.png", widths: [176, 320], fallback: "png" },
  { key: "linea-capuccinos", file: "products/linea-capuccinos.png", widths: [176, 320], fallback: "png" },
  { key: "hero", file: "gallery/galeria-2.jpg", widths: [480, 800], fallback: "jpeg" },
  { key: "calidad", file: "gallery/galeria-3.jpg", widths: [320, 640], fallback: "jpeg" },
  // galeria-1.jpg (macarons) no se usa en el sitio: se conserva solo como original.
];

const encoders = {
  avif: (img) => img.avif({ quality: 55, effort: 6 }),
  webp: (img) => img.webp({ quality: 78, effort: 6 }),
  png: (img) => img.png({ palette: true, quality: 85, effort: 10, compressionLevel: 9 }),
  jpeg: (img) => img.jpeg({ quality: 78, mozjpeg: true, progressive: true }),
};
const mimes = { avif: "image/avif", webp: "image/webp", png: "image/png", jpeg: "image/jpeg" };
const ext = { avif: "avif", webp: "webp", png: "png", jpeg: "jpg" };

const manifest = {};
let totalOut = 0;

for (const item of sources) {
  const input = path.join(root, "assets-src/images", item.file);
  const meta = await sharp(input).metadata();
  const dir = path.dirname(item.file);
  const base = path.basename(item.file, path.extname(item.file));
  const outDir = path.join(root, "public/images", dir);
  fs.mkdirSync(outDir, { recursive: true });

  const widths = [...new Set(item.widths.map((w) => Math.min(w, meta.width)))].sort((a, b) => a - b);
  const variants = [];

  // Orden = prioridad en <picture>: AVIF, WebP y, al final, el respaldo.
  for (const format of ["avif", "webp", item.fallback]) {
    // El respaldo solo se genera al ancho mayor (basta para navegadores antiguos).
    const list = format === item.fallback ? [widths[widths.length - 1]] : widths;
    for (const width of list) {
      const name = `${base}-${width}.${ext[format]}`;
      const target = path.join(outDir, name);
      await encoders[format](sharp(input).resize({ width, withoutEnlargement: true })).toFile(target);
      const size = fs.statSync(target).size;
      totalOut += size;
      variants.push({ src: `/images/${dir}/${name}`, width, mime: mimes[format] });
      console.log(`${(size / 1024).toFixed(1).padStart(7)} kB  ${dir}/${name}`);
    }
  }

  manifest[item.key] = { width: meta.width, height: meta.height, variants };
}

const manifestPath = path.join(root, "src/content/images.generated.json");
fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`\nTotal generado: ${(totalOut / 1024).toFixed(0)} kB → ${path.relative(root, manifestPath)}`);
