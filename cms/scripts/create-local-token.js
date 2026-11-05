'use strict';

/**
 * SOLO DESARROLLO LOCAL (docs/PLAN_STRAPI.md §6).
 * Crea un API token «Read-only» para que el build de Next lea el catálogo y lo escribe en el
 * `.env.local` de la raíz del repositorio (ignorado por git) junto a CATALOG_SOURCE y STRAPI_URL.
 * El valor del token no se imprime. Si ya existe un token con el mismo nombre, se regenera.
 *
 * Uso (desde cms/):  npm run token:local
 * En producción el token se crea a mano en el panel (Settings → API Tokens) y se configura como
 * variable de build en Vercel / Cloudflare Pages.
 */

const fs = require('node:fs');
const path = require('node:path');

const TOKEN_NAME = 'web-build (local)';
const ENV_FILE = path.resolve(__dirname, '../../.env.local');
const STRAPI_URL = `http://localhost:${process.env.PORT || 1337}`;

function setEnvVars(file, vars) {
  let content = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '';
  for (const [key, value] of Object.entries(vars)) {
    const line = `${key}=${value}`;
    const pattern = new RegExp(`^#?\\s*${key}=.*$`, 'm');
    content = pattern.test(content) ? content.replace(pattern, line) : `${content.replace(/\s*$/, '')}\n${line}\n`;
  }
  fs.writeFileSync(file, content);
}

async function main() {
  const { createStrapi, compileStrapi } = require('@strapi/strapi');
  const app = await createStrapi(await compileStrapi()).load();
  app.log.level = 'warn';

  try {
    const tokens = app.service('admin::api-token');
    const existing = await tokens.getByName(TOKEN_NAME);
    if (existing) await tokens.revoke(existing.id);

    const { accessKey } = await tokens.create({
      name: TOKEN_NAME,
      description: 'Lectura del catálogo para el build local de Next (creado por scripts/create-local-token.js).',
      type: 'read-only',
      lifespan: null,
    });

    setEnvVars(ENV_FILE, { CATALOG_SOURCE: 'strapi', STRAPI_URL, STRAPI_API_TOKEN: accessKey });
    console.log(`Token «${TOKEN_NAME}» creado y guardado en ${ENV_FILE} (CATALOG_SOURCE=strapi, STRAPI_URL=${STRAPI_URL}).`);
  } finally {
    await app.destroy();
  }
}

main().then(
  () => process.exit(0),
  (err) => {
    console.error(err);
    process.exit(1);
  },
);
