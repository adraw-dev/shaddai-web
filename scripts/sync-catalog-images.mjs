#!/usr/bin/env node
/**
 * Solo con CATALOG_SOURCE=cms (CMS experimental, docs/CMS_EXPERIMENTAL.md): copia las fotos del catálogo
 * de `docs/referencia/productos/imagenes/` a `public/catalogo/`, desde donde las sirve el sitio estático.
 * El CMS guarda la ruta de cada foto, no la foto. `public/catalogo/` no se versiona.
 *
 * Corre solo antes de `npm run dev` y `npm run build` (predev/prebuild); con otra fuente no hace nada.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

// Misma precedencia que Next: lo ya definido en el entorno gana, luego .env.local y luego .env.
for (const file of [".env.local", ".env"]) {
  const full = path.join(root, file);
  if (fs.existsSync(full)) process.loadEnvFile(full);
}

if (process.env.CATALOG_SOURCE?.trim() !== "cms") process.exit(0);

const from = path.join(root, "docs/referencia/productos/imagenes");
const to = path.join(root, "public/catalogo");

fs.rmSync(to, { recursive: true, force: true });
fs.cpSync(from, to, { recursive: true });
const count = fs.readdirSync(to, { recursive: true }).filter((f) => fs.statSync(path.join(to, f)).isFile()).length;
console.log(`Catálogo (CMS): ${count} imágenes copiadas a public/catalogo/.`);
