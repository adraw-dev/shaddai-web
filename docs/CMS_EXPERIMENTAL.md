# Shaddai Colombia — Estructura del catálogo para el CMS experimental

> Rama `exp/cms-experimental` (iniciada el 2026-11-07). Objetivo: probar un CMS nuevo hecho por un tercero
> como alternativa a Strapi. Este documento describe **qué hay que modelar** y **cómo viene el archivo de
> importación**. El modelo de origen es el de Strapi ([`PLAN_STRAPI.md`](PLAN_STRAPI.md) §3); nada aquí
> cambia lo que está en `main`.

## 1. Archivo de importación

`docs/cms-experimental/catalogo.json` — se regenera con:

```bash
cd cms && npm run export:catalog
```

Usa la misma limpieza y clasificación que `cms/scripts/seed.js` (sin emojis, unidades normalizadas, categoría
asignada, descripción convertida a bloques), así que es el mismo contenido que hoy carga Strapi.
**No inventa datos:** lo que no viene en la fuente queda en `null`.

Contenido actual: **78 productos, 11 categorías, 4 canales, 10 marcas, 174 imágenes** (todos los productos
son simples: sin variaciones).

```jsonc
{
  "formatVersion": 1,
  "source": "…",
  "currency": "COP",
  "channels":   [ /* Canal */ ],
  "categories": [ /* Categoría */ ],
  "brands":     [ /* Marca */ ],
  "products":   [ /* Producto */ ]
}
```

Las relaciones se expresan **por `slug`** (no hay ids de base de datos): el importador debe crear primero
canales, categorías y marcas, y luego resolver los slugs de cada producto.

## 2. Entidades

### Canal (`channels`) — 4 registros fijos

| Campo | Tipo | Req. | Notas |
|---|---|---|---|
| `slug` | string (único) | ✔ | `horeca`, `vending`, `maquila`, `retail` |
| `name` | string (único) | ✔ | `HORECA`, `VENDING`… |
| `shortDescription` | string | | «Hoteles, restaurantes y cafeterías» |
| `order` | entero | | Orden de aparición |

### Categoría (`categories`) — tipo de producto, 11 registros

| Campo | Tipo | Req. | Notas |
|---|---|---|---|
| `slug` | string (único) | ✔ | Forma la URL `/productos/[categoria]/` |
| `name` | string (único) | ✔ | |
| `description` | texto | | Vacía por ahora |
| `order` | entero | | |
| `image` | imagen (1) | | Aún sin asignar; no va en el JSON |

### Marca (`brands`) — 10 registros

| Campo | Tipo | Req. | Notas |
|---|---|---|---|
| `slug` | string (único) | ✔ | |
| `name` | string (único) | ✔ | |

### Producto (`products`)

| Campo | Tipo | Req. | Notas |
|---|---|---|---|
| `name` | string | ✔ | |
| `slug` | string (único) | ✔ | Forma la URL `/productos/[categoria]/[slug]/`; viene del slug de WooCommerce |
| `sku` | string (único) | | Todos los productos actuales lo tienen |
| `shortDescription` | texto ≤ 300 | | Una frase para tarjetas y meta |
| `description` | texto enriquecido | | Ver §3 |
| `descriptionHtml` | HTML | | Original de WooCommerce, por si el CMS prefiere HTML. **No se publica tal cual**: trae enlaces a la tienda vieja y emojis |
| `images` | lista de imágenes | | `{ path, alt, isCover }`; `path` relativo a la raíz del repo, la primera es la portada |
| `category` | relación N:1 → Categoría | ✔ | Slug |
| `channels` | relación N:M → Canal | | Lista de slugs; 1 producto sin canal |
| `brand` | relación N:1 → Marca | | Slug o `null` (1 producto sin marca) |
| `presentation` | string | | Tamaño comercial normalizado («1000 g», «750 ml») |
| `packaging` | string | | Opción de empaque |
| `dosage` | texto | | Dosificación |
| `servingsPerPack` | string | | Porciones por empaque |
| `unitsPerBox` | string | | Cantidad por caja (mayorista) |
| `invimaRegistry` | string | | Registro INVIMA |
| `flavors` | string | | Sabores separados por coma |
| `coffeeVariety` | string | | Variedad de café |
| `price` | entero (COP) | | Precio vigente (el de oferta si existe) |
| `compareAtPrice` | entero (COP) | | Precio «antes» cuando hay oferta |
| `priceVisible` | booleano | | `true` por defecto; `false` → el sitio muestra «Cotizar» |
| `featured` | booleano | | `false` por defecto |
| `seo` | objeto | | `{ metaTitle ≤ 70, metaDescription ≤ 160, shareImage }`; hoy `null` |
| `status` | `published` \| `draft` | ✔ | El sitio solo lee publicados (borradores obligatorios en productos) |
| `legacyId` | entero (único) | | **Privado** — id de WooCommerce; sirve para reimportar sin duplicar |
| `legacyUrl` | string | | **Privado** — URL vieja; se usa para las redirecciones |

Los campos de ficha técnica (`presentation` … `coffeeVariety`) son texto libre a propósito: la fuente no es
uniforme («20 Unidades», «71 tazas de 7 onz»).

## 3. Descripción larga (`description`)

Viene en el formato **Blocks** de Strapi (JSON, sin HTML). Tipos usados:

```jsonc
{ "type": "heading", "level": 2, "children": [ /* texto */ ] }   // niveles 2–6
{ "type": "paragraph", "children": [ /* texto */ ] }
{ "type": "quote", "children": [ /* texto */ ] }
{ "type": "list", "format": "unordered" | "ordered",
  "children": [ { "type": "list-item", "children": [ /* texto */ ] } ] }
// texto:
{ "type": "text", "text": "…", "bold": true, "italic": true }  // bold/italic opcionales; "\n" = salto de línea
```

Si el CMS nuevo usa otro formato (Markdown, Portable Text, HTML), lo más simple es convertir desde estos
bloques: son 4 tipos y 2 marcas. Como respaldo está `descriptionHtml`.

## 4. Lo que el sitio necesita del CMS

El sitio es estático: lee el catálogo **solo durante el build** desde `src/lib/catalog/` (contrato en
`src/domain/catalog.ts`). Para conectar otro CMS basta con una fuente nueva junto a
`lib/catalog/strapi/` (cliente + mapper) que devuelva los mismos tipos de `domain/`, y elegirla con
`CATALOG_SOURCE`. Requisitos mínimos de la API:

1. Listar canales, categorías y productos publicados (con paginación o todo de una vez).
2. Buscar categoría y producto por `slug`.
3. Incluir en el producto sus relaciones (categoría, canales, marca) y las imágenes con URL absoluta,
   ancho/alto y, si las hay, variantes de tamaño.
4. Acceso de solo lectura con token (el token nunca llega al navegador).

## 5. Pendientes heredados

- D-23: el cliente aún no revisa la taxonomía ni los textos importados (mayúsculas, errores como «Narural»).
- D-24: precios por confirmar (vigencia, IVA).
- Las categorías no tienen imagen todavía.
