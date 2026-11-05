# Activos provisionales — procedencia

Descargados el **2026-11-04** del sitio actual (`https://www.shaddaicolombia.com/wp-content/uploads/…`) con autorización del usuario. Son **provisionales**: el cliente es el dueño de los activos y debe entregar los originales (plan D-05). Las rutas de origen salen del MD fuente; las de íconos y galería se dedujeron del mismo directorio `2020/05/` y respondieron 200.

| Archivo en el repo | Origen | Tamaño real | Uso previsto | Observación |
|---|---|---|---|---|
| `public/images/brand/shaddai-logo.png` | `2020/05/shadday-Colombia-Logo-alpha.png` | 486×297 px, RGBA | Header, footer | Óvalo rojo con borde cobre y leyenda «Shaddai Insumos». **Pedir SVG o PNG ≥ 1200 px.** El archivo original se llama «shadday» (error) |
| `public/images/products/linea-cafe.png` | `2020/05/coffee-item-1.png` | 320×320, RGBA | Línea «Café» | Taza de café negro vista desde arriba, fondo transparente |
| `public/images/products/linea-lattes.png` | `2020/05/coffee-item-2.png` | 320×320, RGBA | Línea «Lattes» | Taza con espuma espolvoreada |
| `public/images/products/linea-capuccinos.png` | `2020/05/coffee-item-3.png` | 320×320, RGBA | Línea «Capuccinos» | Taza de café con leche |
| `public/images/gallery/galeria-1.jpg` | `2020/05/gallery-coffee-image-1.jpg` | 800×800 | Galería (a decidir en F3) | Macarons con polvo de café |
| `public/images/gallery/galeria-2.jpg` | `2020/05/gallery-coffee-image-2-1.jpg` | 800×800 | Galería | Taza oscura con granos |
| `public/images/gallery/galeria-3.jpg` | `2020/05/gallery-coffee-image-5.jpg` | 800×800 | Galería | Granos de café en cuenco |

## Limitaciones conocidas

- **Resolución insuficiente para pantallas de alta densidad:** las imágenes de producto miden 320×320 px. En un *hero* grande se verán borrosas. Solicitar originales (mínimo 1200 px de lado, fondo transparente) antes de F3-02.
- **Sin optimizar:** se publican tal cual hasta F5-06 (AVIF/WebP, varios anchos).
- **Fotos de galería de aire genérico** (parecen de banco de imágenes): confirmar con el cliente que le representan y que tiene licencia.

## No incorporados (decisión deliberada)

| Archivo | Motivo |
|---|---|
| `2025/05/Shaddai-Insumos-S.A.S.webp` (imagen para redes, 853×1066) | Es un **flyer** con afirmaciones comerciales («Somos fabricantes», «SIN problemas de compactación», «Excelente espuma y cremosidad», listado de productos) que **no están en el MD** y que contradicen su texto («no producen todo lo que venden»). No se usa hasta que el cliente confirme (plan D-18). Además, su formato vertical no sirve como `og:image` |
| `2020/05/icon-1.png`, `icon-2.png`, `icon-3.png` (58×58 px) | Demasiado pequeños; los pilares «La mejor taza servida» se resuelven tipográficamente (sin íconos en recuadro) y, si hace falta ícono, se dibuja en SVG |
