# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Next.js (App Router) + React + TypeScript + Tailwind CSS v4, publicado como sitio estático (`output: "export"`) para desplegar el mismo artefacto en Vercel y Cloudflare Pages. El usuario pidió React o Next.js y dos destinos de despliegue; la exportación estática fue recomendada y adoptada (ver `docs/PLAN_DESARROLLO.md` §7).

## Users

Dueños, administradores y compradores de **centros de negocio** que preparan y venden bebidas de café: cafeterías, restaurantes y hoteles (HORECA), operadores de máquinas expendedoras (VENDING), empresas que producen para terceros (MAQUILA) y comercios minoristas (RETAIL). No es el consumidor de café en casa.

Situación probable (hipótesis a validar, no dato confirmado): consultan desde el celular, entre servicios, comparando proveedores en Medellín y otras ciudades. Su trabajo: abastecerse de insumos de calidad con buena rentabilidad y pedir una cotización con tiempos de entrega y costos.

## Product Purpose

Presentar a Shaddai Colombia como proveedor de insumos para bebidas de café y llevar al visitante a **cotizar** (por WhatsApp o formulario). Éxito: el visitante entiende qué vende Shaddai, si atiende su tipo de negocio y cómo cotizar, y lo hace. Reemplaza progresivamente el sitio actual (WordPress + WooCommerce); en la primera fase solo hay Landing y Contáctenos, y la tienda sigue en el sitio actual.

## Positioning

Distribuidor con sede en Medellín que **selecciona** productos destacados del mercado colombiano por marca, trayectoria, investigación y desarrollo y, sobre todo, por el aroma, sabor y calidad de la taza final. Nació comercializando máquinas especializadas para preparar y vender bebidas de café y snacks, y de ahí pasó a distribuir los insumos que esas máquinas preparan. Todas las líneas pasan por procesos BPM (Buenas Prácticas de Manufactura).

## Operating Context

- Sede: Carrera 81 # 36-79, diagonal al VIVA Laureles, Medellín, Colombia.
- Horario: lunes a viernes 8:00 a. m. – 4:00 p. m.; sábado 8:00 a. m. – 11:00 a. m.; domingos y festivos cerrado.
- Flujo comercial actual: cotización por WhatsApp pidiendo **nombre y lugar de envío** para responder con tiempos de entrega y costos; también asesoría personalizada con los pedidos.
- Canales y líneas: HORECA, VENDING, MAQUILA, RETAIL; líneas destacadas Lattes, Café y Capuccinos. Hoy el catálogo vive en WooCommerce.

## Capabilities and Constraints

- Alcance de la primera fase: Landing (`/`) y Contáctenos (`/contactenos/`), más header, footer, botón flotante de WhatsApp, 404 y SEO técnico.
- Fuera de alcance: tienda, catálogo, carrito, precios, Strapi, blog «Novedades», analítica, modo oscuro.
- Fase futura independiente: catálogo gestionado con Strapi (productos, categorías, imágenes, descripciones, precios, información comercial), con cotización por WhatsApp.
- Restricciones técnicas: sin servidor propio (formulario hacia un endpoint externo + WhatsApp); redirecciones y cabeceras por plataforma.
- **Decisiones de producto sin cerrar** (ver `docs/PLAN_DESARROLLO.md` §17): destino del formulario (D-02), política de tratamiento de datos (D-03), tratamiento «usted» vs «tú» (D-09), grafía «Capuccinos» (D-10), URL exacta de la tienda (D-11), si Shaddai fabrica o solo distribuye (D-18).

## Brand Commitments

- Dos nombres: **Shaddai Colombia** (marca de la web, registrada *ShaddaiColombia®*) y **Shaddai Insumos S.A.S.** (razón social; la usan Facebook, Instagram y el chat de WhatsApp). Cómo presentarlos está por confirmar (D-06).
- Frase de cabecera: «Insumos de Calidad». Título del bloque principal: «Procuramos por el sabor de un buen café».
- Logo existente: óvalo con la leyenda «Shaddai Insumos» (`public/images/brand/shaddai-logo.png`, provisional). Color `theme-color` del sitio actual: `#25094b`.
- La frase poética sobre el grano de café (historia de la empresa) es la pieza más emocional del texto actual y debe conservarse; su texto literal falta (D-07).

## Evidence on Hand

- `docs/referencia/Sobre_nosotros_Shaddai_Colombia.md`: contenido de la página «Sobre nosotros» actual.
- `docs/activos-provisionales.md`: logo, 3 imágenes de producto (320 px), 3 fotos de galería; con sus limitaciones.
- Video de YouTube `NYPI5JoMi4M`.
- **Ausencias que no se deben fabricar:** testimonios, cifras de clientes o ventas, años de trayectoria, certificaciones distintas de «procesos BPM», premios, precios, tiempos de entrega, cobertura geográfica, textos de VENDING, MAQUILA y RETAIL más allá de su definición de una línea.
- **Contradicción por resolver (D-18):** el flyer de redes del sitio actual dice «Somos fabricantes»; el texto del sitio dice que no producen todo lo que venden. No afirmar ninguna de las dos hasta confirmarlo con el cliente.

## Product Principles

1. **Cotizar es la acción:** una sola acción primaria en toda la web, siempre la misma, siempre al alcance.
2. **Verdad comercial:** ningún dato, cifra o promesa que el cliente no haya confirmado; el faltante se marca, no se rellena.
3. **Cada idea una sola vez:** el contenido se organiza por jerarquía comercial, no se copia en bloque del sitio original.
4. **Rápida y ligera en el celular:** el rendimiento y la claridad pesan más que el espectáculo.
5. **Preparada para crecer:** lo que se construye hoy no debe rehacerse cuando llegue el catálogo con Strapi.

## Accessibility & Inclusion

WCAG 2.2 nivel AA como estándar requerido: operable por teclado, contraste suficiente, `prefers-reduced-motion` respetado, formularios con etiquetas y errores asociados, áreas táctiles de al menos 44 px. Contenido en español de Colombia.
