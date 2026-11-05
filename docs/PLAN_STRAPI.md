# Shaddai Colombia — Plan de la fase Strapi + catálogo

> Sub-plan derivado de [`PLAN_DESARROLLO.md`](PLAN_DESARROLLO.md) §12 y §15. Ese documento sigue siendo la fuente de verdad de diseño y arquitectura; aquí solo se concreta la fase de CMS. Iniciado el 2026-11-05 en la rama `feat/strapi-catalogo`.

## 1. Decisiones tomadas (confirmadas por el usuario el 2026-11-05)

| ID | Decisión | Motivo |
|---|---|---|
| ST-01 | **Strapi 5 vive en `cms/`** dentro de este repositorio, con su propio `package.json` y `node_modules` | Un solo historial; los hostings de Strapi aceptan una subcarpeta como raíz. Next excluye `cms/` de `tsconfig` y ESLint |
| ST-02 | **Taxonomía curada**: *canales* (HORECA, VENDING, RETAIL, MAQUILA; muchos-a-muchos) + **una categoría por tipo de producto** (§3) | Las categorías de WooCommerce mezclan canales, tipos y etiquetas (FOOD SERVICE, COCTELERÍA) y 8 productos no tienen tipo |
| ST-03 | **Precios importados y visibles** (precio regular y de oferta). Cada producto conserva `priceVisible` para ocultarlo y mostrar «Cotizar» | Así lo hace la tienda actual |
| ST-04 | Alcance de la primera entrega: **S-1, S-2 y S-3** | S-4 (búsqueda/filtros), S-5 (cesta), S-6 (webhook + corte) y S-7 (blog) quedan después |
| ST-05 | Base de datos **SQLite en local**; la de producción se decide con el hosting (D-21) | Cero configuración para empezar; Strapi cambia de cliente por variables |
| ST-06 | La descripción larga usa el editor **Blocks** de Strapi y se renderiza con un componente propio (`features/catalog/rich-text.tsx`) | Sin dependencias nuevas en Next (§7.3); Blocks es JSON estructurado, sin HTML arbitrario |

## 2. Fuente de los datos

`docs/referencia/productos/productos.json` (78 productos extraídos de la WooCommerce Store API pública con `scripts/scrape-productos.mjs`) y sus imágenes en `docs/referencia/productos/imagenes/<slug>/`. **No se inventa nada**: lo que no está en la fuente queda vacío.

## 3. Modelo de contenido en Strapi

**Collection types**

| Tipo | Campos |
|---|---|
| `channel` | `name`, `slug` (uid), `shortDescription`, `order` |
| `category` | `name`, `slug` (uid), `description?`, `order`, `image?`, `products` (inversa) |
| `brand` | `name`, `slug` (uid) |
| `product` | `name`, `slug` (uid = slug de WooCommerce, conserva URLs), `sku` (único), `shortDescription`, `description` (Blocks), `images` (múltiples), `category` (N:1), `channels` (N:M), `brand` (N:1), `presentation`, `packaging`, `dosage`, `servingsPerPack`, `unitsPerBox`, `invimaRegistry`, `flavors`, `coffeeVariety`, `price` (COP, entero), `compareAtPrice` (precio antes de oferta), `priceVisible`, `featured`, `legacyId`, `legacyUrl`, `seo` (componente) |

**Componente** `shared.seo`: `metaTitle`, `metaDescription`, `shareImage`.

**Draft & Publish** activo en `product`: el sitio solo lee publicados.

**Pendiente (S-1, no bloquea):** *single type* `site-settings` (hoy `content/site.ts`). Se crea cuando se migre el contenido del sitio al CMS.

**Categorías curadas** (clasificación por nombre del producto en el script de importación; se corrigen después en el panel):

| Orden | Slug | Nombre | Productos |
|---|---|---|---|
| 1 | `lattes-y-leches` | Lattes y leches | 10 |
| 2 | `capuchinos` | Capuchinos | 6 |
| 3 | `cafe` | Café | 4 |
| 4 | `chocolates-y-maltas` | Chocolates y maltas | 5 |
| 5 | `tes-y-aromaticas` | Tés y aromáticas | 8 |
| 6 | `granizados-y-bebidas-frias` | Granizados y bebidas frías | 11 |
| 7 | `helados` | Helados | 4 |
| 8 | `siropes-y-salsas` | Siropes y salsas | 12 |
| 9 | `perlas-explosivas` | Perlas explosivas | 9 |
| 10 | `escarchadores-y-cocteleria` | Escarchadores y coctelería | 7 |
| 11 | `accesorios` | Accesorios | 2 |

*«Capuchinos» sigue la recomendación de D-10 (pendiente de validar).*

## 4. Arquitectura en Next (S-2)

```
lib/catalog/index.ts          ← API estable (getChannels, getProductLines, getCategories,
        │                        getCategoryBySlug, getProducts, getProductBySlug)
        ├─ CATALOG_SOURCE=static  → content/* (sin catálogo: listas vacías)
        └─ CATALOG_SOURCE=strapi  → lib/catalog/strapi/
                                     ├─ client.ts   fetch + token + paginación
                                     ├─ types.ts    forma de la respuesta de Strapi (solo aquí)
                                     └─ mapper.ts   Strapi → tipos de domain/
```

- Variables solo de *build* (`CATALOG_SOURCE`, `STRAPI_URL`, `STRAPI_API_TOKEN`) leídas por `getCatalogEnv()` en `lib/env.ts`, que se evalúa de forma perezosa: nunca llega al navegador.
- Imágenes: `Media.variants` se construye con los `formats` de Strapi (`thumbnail`, `small`, `medium`, `large`) + el original.

## 5. Rutas (S-3)

`/productos/` (categorías + todos los productos) · `/productos/[categoria]/` · `/productos/[categoria]/[slug]/` (galería, precio, ficha técnica, descripción, «Cotizar por WhatsApp» con contexto de producto). Se generan en el *build* con `generateStaticParams`.

## 6. Cómo trabajar en local

```bash
cd cms && npm run develop          # panel en http://localhost:1337/admin
cd cms && npm run seed             # importa categorías, canales, marcas, productos e imágenes (idempotente)
```

Crear en el panel un **API token de solo lectura** (*Settings → API Tokens → Read-only*) y ponerlo en `.env.local` de la raíz junto a `CATALOG_SOURCE=strapi` y `STRAPI_URL=http://localhost:1337`.

## 7. Criterios de aceptación de esta entrega

*Estado al 2026-11-05 (verificado en local):*

- [x] `cms/` arranca; los 4 tipos y el componente existen; el *seed* deja 78 productos publicados con 113 imágenes únicas, categoría, canales y marca.
- [x] Rol *Public* sin permisos (`/api/products` → 403); el sitio lee con token de solo lectura.
- [x] Con `CATALOG_SOURCE=strapi`, `npm run build` genera 96 páginas (catálogo, 11 categorías, 78 fichas) y el sitemap las incluye.
- [x] Con `CATALOG_SOURCE=static`, el build funciona como en la Fase 1 (las rutas dinámicas generan solo el marcador `sin-catalogo` → 404; Next exige al menos un parámetro con `output: "export"`).
- [x] `lint` y `typecheck` en verde; renderizado verificado en 360 y 1280 px (sin desbordamiento horizontal, un `h1`, objetivos táctiles ≥ 44 px).
- [x] Ningún componente fuera de `lib/catalog/strapi/` conoce la forma de Strapi.

**Notas de la carga inicial (para D-23):** «Golden Food» dice 310 g en el nombre y 270 g en su descripción (se tomó 270 g); los nombres conservan la grafía de WooCommerce (mayúsculas, «Narural», «Rojos1000grms»); los slugs se normalizaron a ASCII.

## 8. Decisiones abiertas de esta fase

Registradas en `PLAN_DESARROLLO.md` §17 como D-21 a D-24. D-21 y D-22 se resolvieron el 2026-11-05 (§9).

## 9. Despliegue del CMS en Render (D-21/D-22)

**Decisión (usuario, 2026-11-05):** Strapi en **Render**, desde este mismo repositorio (`rootDir: cms`), con PostgreSQL gestionado de Render y las imágenes en un **disco persistente** de Render. Todo está declarado en [`render.yaml`](../render.yaml) (*Blueprint*).

| Pieza | Valor | Motivo |
|---|---|---|
| Servicio web | `shaddai-cms`, plan *Starter*, región Virginia | El plan gratuito no admite disco y se duerme |
| Base de datos | `shaddai-cms-db`, plan `basic-256mb` | La PostgreSQL gratuita caduca a los 30 días |
| Imágenes | Disco `strapi-uploads` (1 GB) montado en `/var/data`; la carpeta pública de Strapi es `/var/data/public` (`PUBLIC_DIR`) | Sin disco, las subidas se pierden en cada despliegue. No se monta directamente en `public/uploads`: `strapi transfer` mueve esa carpeta para su copia de seguridad y un punto de montaje no se puede mover (`ASSETS_DIRECTORY_ERR`, visto el 2026-11-05) |
| Secretos | Generados por Render (`generateValue`) | Nunca se reutilizan los del `.env` local |
| Despliegues | Automáticos desde `main`, solo si cambia `cms/**` | Los cambios del sitio Next no redespliegan el CMS |

**Límites conocidos:** un servicio con disco funciona con **una sola instancia** y tiene una breve caída en cada despliegue. Las imágenes del sitio se sirven desde Render, así que si Strapi cae, también las fotos. Si eso molesta, se migra a Cloudflare R2 (proveedor S3 de Strapi) sin tocar el sitio Next. Si el build falla por memoria (`JavaScript heap out of memory`), subir el servicio a *Standard*.

### Paso a paso

1. **Código en `main`:** fusionar el PR del catálogo. El Blueprint despliega desde `main`.
2. **Cuenta de Render:** registrarse en render.com con GitHub y autorizar la app de Render en la organización `adraw-dev` (si no se es propietario de la organización, lo aprueba un propietario). Agregar un método de pago (los planes son de pago).
3. **Crear todo con el Blueprint:** *New → Blueprint* → elegir `adraw-dev/shaddai-web` → revisar que aparezcan `shaddai-cms` y `shaddai-cms-db` → *Apply*. El primer build tarda varios minutos; seguirlo en *Logs*.
4. **Usuario administrador:** abrir `https://<servicio>.onrender.com/admin` y registrar el primer administrador (correo real y contraseña fuerte). La primera persona que entra lo crea, así que hacerlo apenas termine el despliegue.
5. **Pasar el catálogo local a Render** (78 productos + imágenes, ya cargados en el SQLite local con `npm run seed`):
   1. En el panel de Render: *Settings → Transfer Tokens → Create new transfer token*, tipo **Push**, duración 7 días. Copiarlo.
   2. Detener el Strapi local si está encendido y ejecutar en local:
      ```bash
      cd cms && npx strapi transfer --to https://<servicio>.onrender.com/admin --to-token <TOKEN>
      ```
      Confirma que **borra** el contenido remoto (en el primer despliegue está vacío). Al terminar, eliminar el transfer token.

      **Red corporativa:** si falla con `self-signed certificate in certificate chain`, la red inspecciona HTTPS con su propio certificado. Repetir con `NODE_OPTIONS=--use-system-ca` (Node usa los certificados de Windows; verificado el 2026-11-05). En PowerShell: `$env:NODE_OPTIONS="--use-system-ca"` antes del comando. Nunca usar `NODE_TLS_REJECT_UNAUTHORIZED=0`.
6. **Token de lectura para Vercel:** *Settings → API Tokens → Create new API Token*: nombre `vercel-build`, tipo **Read-only**, duración *Unlimited*. Copiarlo (solo se muestra una vez).
7. **Variables en Vercel** (Production y Preview): `CATALOG_SOURCE=strapi`, `STRAPI_URL=https://<servicio>.onrender.com`, `STRAPI_API_TOKEN=<token>`. Volver a desplegar.
8. **Reconstruir el sitio al publicar (S-6):** en Vercel, *Settings → Git → Deploy Hooks* → crear uno para `main` y copiar la URL. En Strapi, *Settings → Webhooks → Create new webhook* con esa URL y los eventos de **Entry** *publish*, *unpublish* y *delete*. Probarlo con *Trigger*.
9. **Verificar:** `/productos/` en Vercel muestra los productos y las fotos cargan desde `onrender.com`.
