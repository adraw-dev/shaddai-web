# Shaddai Colombia — nueva web

Sitio estático (Next.js App Router + TypeScript + Tailwind CSS v4). La guía de diseño, arquitectura y roadmap está en [`docs/PLAN_DESARROLLO.md`](docs/PLAN_DESARROLLO.md); las reglas para agentes de código, en [`AGENTS.md`](AGENTS.md).

**Estado:** Fase 1 (configuración y estructura base) — ver el plan, sección 13.

## Requisitos

- Node.js 22 o superior (`.nvmrc`), npm.

## Puesta en marcha

```bash
npm install
cp .env.example .env.local   # ajustar valores; ver "Variables de entorno"
npm run dev
```

## Scripts

| Script | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build estático → carpeta `out/` |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |

Para ver el build estático localmente: `npx serve out` (no es dependencia del proyecto).

## Variables de entorno

Plantilla completa y comentada en [`.env.example`](.env.example). `src/lib/env.ts` las valida y **hace fallar el build** si falta alguna obligatoria. Reglas:

- Las `NEXT_PUBLIC_*` son visibles en el navegador: **nunca** poner secretos en ellas. Las del catálogo (`CATALOG_SOURCE`, `STRAPI_URL`, `STRAPI_API_TOKEN`) son solo de build.
- Configurar las **mismas** variables en Vercel y Cloudflare Pages, en Production y Preview.
- `NEXT_PUBLIC_SITE_ENV=production` exige además `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_WHATSAPP_NUMBER` y `NEXT_PUBLIC_LEGACY_SITE_URL`.
- Si se define `NEXT_PUBLIC_CONTACT_ENDPOINT` (el formulario de Contáctenos envía datos), en producción también es obligatoria `NEXT_PUBLIC_PRIVACY_POLICY_URL`. Sin endpoint, el formulario solo ofrece el camino por WhatsApp.
- En **Git Bash para Windows**, un valor que empieza por `/` (p. ej. `NEXT_PUBLIC_PRIVACY_POLICY_URL=/politica/`) se convierte en una ruta de disco al pasarlo en la línea de comandos. Use `MSYS_NO_PATHCONV=1` o configúrelo en `.env.local`/en la plataforma de despliegue.

## Catálogo con Strapi (`cms/`)

El CMS es un proyecto Node aparte en [`cms/`](cms/) (Strapi 5, SQLite en local). Plan, modelo y decisiones: [`docs/PLAN_STRAPI.md`](docs/PLAN_STRAPI.md).

```bash
cd cms && npm install            # primera vez
cd cms && npm run seed           # carga los 78 productos de docs/referencia/productos (idempotente)
cd cms && npm run token:local    # token de solo lectura → .env.local (CATALOG_SOURCE=strapi)
cd cms && npm run develop        # panel en http://localhost:1337/admin (crear el usuario admin al entrar)
npm run build                    # con Strapi encendido: genera /productos/ en out/
```

Sin `CATALOG_SOURCE=strapi` el sitio se construye como antes (sin `/productos/`; los CTA van a la tienda actual).

## Despliegue (Vercel y Cloudflare Pages)

Mismo artefacto estático (`out/`) en ambas plataformas; detalle en el plan, sección 11.

| | Vercel | Cloudflare Pages |
|---|---|---|
| Framework preset | Next.js | Next.js (Static HTML Export) |
| Build command | `npm run build` | `npm run build` |
| Output directory | `out` | `out` |
| Node | 22 | variable `NODE_VERSION=22` |
| Variables | las de `.env.example` | las de `.env.example` |

> Mientras no se confirme el número de WhatsApp (plan D-01), el despliegue de humo debe usar `NEXT_PUBLIC_SITE_ENV=preview`: con `production` el build falla a propósito.

## Línea base técnica (medida en F1, 2026-11-04)

| Dato | Valor |
|---|---|
| Next.js | 16.4.5 (Turbopack) |
| React / React DOM | 19.3.0 |
| TypeScript | ^5 |
| Tailwind CSS | ^4 (loader `@tailwindcss/turbopack`) |
| JS de primera carga, página vacía | 132 kB gzip en navegadores modernos (170.7 kB con el polyfill `noModule`) |
| JS de primera carga, tras F5 | 141.9 kB (landing) · 143.1 kB (Contáctenos) |
| Imágenes de la landing (navegador moderno, 1x) | 32.4 kB (antes de optimizar: 599 kB) |
| Presupuesto de JS (plan §10.3) | ≤ 150 kB gzip |
| `npm audit --omit=dev` | 0 vulnerabilidades (las moderadas reportadas por `npm audit` son de herramientas de desarrollo ESLint) |

## Imágenes

Los originales viven en `assets-src/images/`; lo que se sirve (AVIF + WebP + respaldo, varios anchos) está en `public/images/` y se genera con un script puntual. `sharp` **no** es dependencia del proyecto:

```bash
npm install --no-save sharp
node scripts/optimize-images.mjs
```

El script también regenera `src/content/images.generated.json`, que consume `src/content/media.ts`. Los archivos generados se versionan: el build no necesita `sharp`.

## Estructura

Ver plan, sección 8.2. Resumen: `src/app` (rutas finas), `src/components` (ui, layout, media, motion, icons), `src/features` (home, contact), `src/content` (texto y datos de negocio), `src/domain` (tipos), `src/lib` (env, whatsapp, seo, catalog, integrations).
