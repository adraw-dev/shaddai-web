# Activos provisionales — procedencia

Descargados el **2026-11-04** del sitio actual (`https://www.shaddaicolombia.com/wp-content/uploads/…`) con autorización del usuario. Son **provisionales**: el cliente es el dueño de los activos y debe entregar los originales (plan D-05). Las rutas de origen salen del MD fuente; las de íconos y galería se dedujeron del mismo directorio `2020/05/` y respondieron 200.

> **Actualización F5 (2026-11-05):** los originales descargados viven ahora en `assets-src/images/` (fuera de `public/`). `scripts/optimize-images.mjs` genera las variantes AVIF + WebP + respaldo en `public/images/` y el manifiesto `src/content/images.generated.json`. Al recibir originales de mayor resolución (D-05): reemplazar el archivo en `assets-src/images/`, ajustar `widths` en el script si hace falta y volver a ejecutarlo. Los nombres de la columna «Archivo en el repo» son hoy los **originales** en `assets-src/images/…`.

| Archivo en el repo | Origen | Tamaño real | Uso previsto | Observación |
|---|---|---|---|---|
| `public/images/brand/shaddai-logo.png` | `2020/05/shadday-Colombia-Logo-alpha.png` | 486×297 px, RGBA | Header, footer | Óvalo rojo con borde cobre y leyenda «Shaddai Insumos». **Pedir SVG o PNG ≥ 1200 px.** El archivo original se llama «shadday» (error) |
| `public/images/products/linea-cafe.png` | `2020/05/coffee-item-1.png` | 320×320, RGBA | Línea «Café» | Taza de café negro vista desde arriba, fondo transparente |
| `public/images/products/linea-lattes.png` | `2020/05/coffee-item-2.png` | 320×320, RGBA | Línea «Lattes» | Taza con espuma espolvoreada |
| `public/images/products/linea-capuccinos.png` | `2020/05/coffee-item-3.png` | 320×320, RGBA | Línea «Capuccinos» | Taza de café con leche |
| `galeria-1.jpg` | `2020/05/gallery-coffee-image-1.jpg` | 800×800 | **No se usa** en el sitio (conservada solo como original) | Macarons con polvo de café; no aparecen en el MD |
| `public/images/gallery/galeria-2.jpg` | `2020/05/gallery-coffee-image-2-1.jpg` | 800×800 | Galería | Taza oscura con granos |
| `public/images/gallery/galeria-3.jpg` | `2020/05/gallery-coffee-image-5.jpg` | 800×800 | Galería | Granos de café en cuenco |

## Fotos de banco (Propuesta B, 2026-11-05)

Descargadas de **Pexels** (licencia Pexels: uso comercial libre y sin atribución obligatoria; no se vende la foto sin transformar). Se eligieron por encajar con la paleta cálida y por no mostrar marcas ni letreros de terceros. Originales en `assets-src/images/stock/`; variantes AVIF/WebP/JPEG en `public/images/stock/` (generadas con `scripts/optimize-images.mjs`).

| Archivo (original) | Foto | Autor | Dónde se usa |
|---|---|---|---|
| `latte-vertido-crema.jpg` | [Person Pouring Milk on Mug Making Latte Art](https://www.pexels.com/photo/person-pouring-milk-on-mug-making-latte-art-6166751/) | Olha Ruskykh | «La mejor taza servida» (junto al texto de «café fresco») |
| `cafeteria-barista-luminosa.jpg` | [Man Working in Kitchen](https://www.pexels.com/photo/man-working-in-kitchen-5461592/) (barista junto a una máquina espresso) | Amelia Hallsworth | Panel HORECA de «Canales» |
| `latte-arte-manos.jpg` | [Person Pouring Milk on Coffee](https://www.pexels.com/photo/person-pouring-milk-on-coffee-302891/) | Chevanon Photography | Esquina del video en «Nuestra historia» |

**Son imágenes ilustrativas**, no muestran clientes, instalaciones ni productos de Shaddai. Los textos alternativos describen lo que se ve, sin afirmar nada de la empresa. **Reemplazar por fotos propias del cliente cuando las entregue (D-05).** Si se publica atribución, usar la columna «Autor».

Se probaron y **descartaron**: Unsplash (bloquea las descargas automatizadas con una verificación antichatbot; no se evadió) y Wikimedia Commons (fotos con letreros y marcas de terceros: «French Coffee Shop», «Mojo», «Kikka»). No se usaron fotos de máquinas de vending ni de bolsas de café en estantería: las disponibles mostraban marcas ajenas o máquinas de bebidas, no de café.

## Limitaciones conocidas

- **Resolución insuficiente para pantallas de alta densidad:** las imágenes de producto miden 320×320 px. En un *hero* grande se verán borrosas. Solicitar originales (mínimo 1200 px de lado, fondo transparente) antes de F3-02.
- **Optimizadas en F5-06:** AVIF + WebP + respaldo en varios anchos (la landing descarga ~32 kB de imágenes en un navegador moderno).
- **Fotos de galería de aire genérico** (parecen de banco de imágenes): confirmar con el cliente que le representan y que tiene licencia.

## No incorporados (decisión deliberada)

| Archivo | Motivo |
|---|---|
| `2025/05/Shaddai-Insumos-S.A.S.webp` (imagen para redes, 853×1066) | Es un **flyer** con afirmaciones comerciales («Somos fabricantes», «SIN problemas de compactación», «Excelente espuma y cremosidad», listado de productos) que **no están en el MD** y que contradicen su texto («no producen todo lo que venden»). No se usa hasta que el cliente confirme (plan D-18). Además, su formato vertical no sirve como `og:image` |
| `2020/05/icon-1.png`, `icon-2.png`, `icon-3.png` (58×58 px) | Demasiado pequeños; los pilares «La mejor taza servida» se resuelven tipográficamente (sin íconos en recuadro) y, si hace falta ícono, se dibuja en SVG |
