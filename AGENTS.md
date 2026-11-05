# Shaddai Colombia — guía para agentes

**Antes de cualquier tarea lee [`docs/PLAN_DESARROLLO.md`](docs/PLAN_DESARROLLO.md)**: es la fuente de verdad de diseño, arquitectura y roadmap. Si una decisión no está ahí, no se improvisa: se agrega primero al plan (sección 17) y se confirma con el usuario. Fuente de contenido: `docs/referencia/Sobre_nosotros_Shaddai_Colombia.md`.

## Reglas esenciales (resumen de la sección 16 del plan)

1. **No inventar información comercial** (cifras, clientes, precios, certificaciones, plazos). Faltantes → `TODO(contenido)` y registrarlo en la sección 17 del plan.
2. **No instalar dependencias** que no estén en la sección 7.3 del plan. Si hace falta una, justificarla por escrito y actualizar la tabla.
3. **Contenido en `src/content/`, no en componentes.** Datos de contacto solo en `content/site.ts`; WhatsApp solo vía `lib/whatsapp.ts`; variables de entorno solo vía `lib/env.ts`.
4. **Componentes de servidor por defecto**; `"use client"` solo con estado o efectos.
5. **Un solo sistema de estilos:** Tailwind v4 + tokens. Sin colores/tamaños sueltos, sin `transition: all`, sin CSS-in-JS.
6. **Animación solo del inventario (plan §5.5)**, con `prefers-reduced-motion` respetado y contenido visible sin JS.
7. **Accesibilidad desde la primera línea:** foco visible, etiquetas, contraste AA, áreas táctiles ≥ 44 px.
8. **Verificar el renderizado real** (móvil 360 px y desktop) antes de dar por terminada una tarea visual.
9. **Una tarea del roadmap = un commit pequeño.** Este repo vive en `Shaddai/` (tiene su propio `.git`; la carpeta personal del usuario es otro repo: no tocarlo).
10. **Strapi y catálogo** se rigen por [`docs/PLAN_STRAPI.md`](docs/PLAN_STRAPI.md) (CMS en `cms/`, proyecto Node aparte). Siguen fuera de alcance: carrito, blog, analítica, modo oscuro.

## Particularidades técnicas

- **Sitio estático** (`output: "export"`): no hay Route Handlers dinámicos, Server Actions, `redirects()`/`headers()` de `next.config`, ISR ni proxy. Redirecciones y cabeceras van por plataforma (`vercel.json`, `public/_redirects`, `public/_headers`).
- Tailwind se integra mediante el loader `@tailwindcss/turbopack` que generó `create-next-app` (ver `next.config.ts`).
- **Hidratación:** no modificar `<html>`/`<head>` con scripts en línea antes de hidratar (p. ej. añadir una clase `js`): React lo detecta como error de hidratación y, en desarrollo, el enrutador de Next queda sin inicializar y las ediciones provocan recargas completas. El estado oculto de `Reveal` usa `@media (scripting: enabled)`. Si algo debe cambiar `<html>` en el cliente, usar `suppressHydrationWarning` solo en ese elemento y entender por qué.
- Scripts: `npm run dev` · `npm run build` (genera `out/`) · `npm run lint` · `npm run typecheck`.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
