import type { NextConfig } from "next";

/**
 * Sitio 100 % estático: el mismo `out/` se publica en Vercel y Cloudflare Pages.
 * Ver docs/PLAN_DESARROLLO.md §7.5 y §11.
 *
 * Con `output: "export"` NO aplican `redirects()`, `headers()`, `rewrites()`,
 * Server Actions, proxy ni ISR. Redirecciones y cabeceras se definen por
 * plataforma (`vercel.json` y `public/_redirects` / `public/_headers`).
 *
 * `cacheComponents` y `partialPrefetching` (activados por el scaffold) se
 * desactivaron a propósito: dependen de runtime de servidor.
 */
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
