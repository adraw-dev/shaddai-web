---
name: Shaddai Colombia
description: Distribuidor de insumos para café con sede en Medellín; web de cotización sobria, cálida y rápida.
colors:
  brand-900: "#25094b"
  brand-700: "#4a1d8a"
  brand-300: "#c9b6ee"
  cream-50: "#fbf6ee"
  cream-100: "#f3eadb"
  ink: "#1b1230"
  muted: "#5b4a78"
  accent: "#c4161c"
  accent-strong: "#a50f16"
  accent-soft: "#ff6b6b"
  copper: "#7c341c"
  whatsapp: "#0e7a43"
  whatsapp-strong: "#0b6e3b"
typography:
  display:
    fontFamily: "Bricolage Grotesque, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.5rem, 1.7rem + 3.6vw, 5rem)"
    fontWeight: 800
    lineHeight: 1.02
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Bricolage Grotesque, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.75rem, 1.4rem + 1.6vw, 2.75rem)"
    fontWeight: 700
    lineHeight: 1.12
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Bricolage Grotesque, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.25rem, 1.12rem + 0.6vw, 1.625rem)"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "-0.01em"
  lead:
    fontFamily: "Hanken Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.125rem, 1.06rem + 0.35vw, 1.375rem)"
    fontWeight: 400
    lineHeight: 1.55
  body:
    fontFamily: "Hanken Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Hanken Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 600
    lineHeight: 1.5
rounded:
  control: "12px"
  card: "16px"
  sheet: "40px"
  sheet-md: "48px"
  full: "9999px"
spacing:
  gutter-sm: "16px"
  gutter-md: "24px"
  gutter-lg: "32px"
  container: "1200px"
  section-y: "64px"
  section-y-md: "96px"
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.cream-50}"
    rounded: "{rounded.control}"
    height: "44px"
    padding: "0 20px"
  button-primary-hover:
    backgroundColor: "{colors.accent-strong}"
  button-primary-lg:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.cream-50}"
    rounded: "{rounded.control}"
    height: "56px"
    padding: "0 28px"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "inherit"
    rounded: "{rounded.control}"
    height: "44px"
    padding: "0 20px"
  field:
    backgroundColor: "#ffffff"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    height: "48px"
    padding: "0 16px"
  whatsapp-fab:
    backgroundColor: "{colors.whatsapp}"
    textColor: "#ffffff"
    rounded: "{rounded.full}"
    size: "56px"
---

# Design System: Shaddai Colombia

## Overview

**Creative North Star: "El Mostrador de Confianza"** *(propuesta; pendiente de confirmación del usuario)*

Un distribuidor serio que trata a su cliente de tú a tú. La web se parece a un buen mostrador de proveedor: ordenado, directo y con calidez de oficio. El morado profundo de la marca da formalidad y peso; la crema y el rojo del logo traen el calor del café. El producto real es el protagonista y cada elemento decorativo tiene que ganarse su lugar.

La densidad es media y la voz es clara y comercial, sin adornos. La página se organiza en bandas de color de ancho completo (morado, crema, crema cálida) que se superponen como hojas con el borde superior redondeado: ese cambio de tono y de forma es el único recurso de ritmo entre secciones. El movimiento es breve y explica algo (entrada del título, revelado de listas, estado del header), nunca decora.

Rechazos confirmados: rejillas de tarjetas idénticas con ícono en recuadro, rótulos sobre los títulos (*eyebrows*), numeraciones decorativas, degradados y efectos de vidrio, y cualquier dato o cifra comercial que el cliente no haya confirmado.

**Key Characteristics:**
- Bandas de color a página completa; el morado ocupa buena parte de la superficie (estrategia *Committed*).
- Un solo acento (rojo del logo, oscurecido para cumplir AA) y una sola acción primaria: cotizar por WhatsApp.
- Tipografía con carácter en los titulares y cuerpo humanista de alta legibilidad.
- Movimiento solo con `transform` y `opacity`; todo se ve completo sin JavaScript o con `prefers-reduced-motion`.

## Colors

Morado de marca como fondo envolvente, crema como base y el rojo del logo como único acento; el cobre del borde del logo queda como detalle cálido.

### Primary
- **Morado Noche** (#25094b): fondo de hero, canales, cierre y header; texto principal sobre crema. Color `theme-color` del sitio actual.
- **Morado Lavanda** (#4a1d8a): enlaces y énfasis sobre fondos claros.
- **Lavanda Suave** (#c9b6ee): texto secundario sobre morado (9.4:1).

### Secondary
- **Rojo Oficio** (#c4161c): acento y CTA principal; texto crema sobre él da 5.6:1. Es el rojo del logo, oscurecido: el rojo exacto del logo (#ed2121) da solo 4.3:1 con blanco y **vive únicamente en el logo**.
- **Rojo Fuerte** (#a50f16): estado *hover* del CTA.
- **Coral Claro** (#ff6b6b): acento como **texto** sobre morado (6.2:1).

### Tertiary
- **Cobre Tostado** (#7c341c): detalle cálido tomado del borde del logo (8.3:1 sobre crema).
- **Verde WhatsApp** (#0e7a43, hover #0b6e3b): exclusivo del botón flotante de WhatsApp (5.4:1 con blanco).

### Neutral
- **Crema Base** (#fbf6ee): fondo claro por defecto.
- **Crema Cálida** (#f3eadb): fondo de la sección de historia y la ubicación.
- **Tinta Morada** (#1b1230): texto sobre crema (16.6:1) y fondo del footer.
- **Gris Violeta** (#5b4a78): texto secundario sobre crema (7.2:1).

### Named Rules
**The One Action Rule.** El rojo de acento se reserva a la acción primaria («Cotizar por WhatsApp») y a pocos énfasis. Si todo es rojo, nada lo es.
**The Logo Red Rule.** El rojo exacto del logo (#ed2121) no se usa como fondo de texto ni como texto: queda en la imagen del logo.
**The Dark Accent Rule.** Sobre morado, el texto de acento es Coral Claro, nunca el Rojo Oficio. Sobre claro, nunca un acento de brillo medio por debajo de 4.5:1.

## Typography

**Display Font:** Bricolage Grotesque (con `ui-sans-serif, system-ui`)
**Body Font:** Hanken Grotesk (con `ui-sans-serif, system-ui`)

**Character:** Titulares firmes, algo expresivos, junto a un cuerpo neutro y muy legible. Ambas se autoalojan con `next/font`; solo se descargan los archivos latinos usados (74 kB).

### Hierarchy
- **Display** (800, `clamp(2.5rem → 5rem)`, 1.02): solo el título del hero y de la 404. Máximo 5rem.
- **Headline** (700, `clamp(1.75rem → 2.75rem)`, 1.12): título de cada sección.
- **Title** (600, `clamp(1.25rem → 1.625rem)`, 1.25): nombres de línea de producto y de canal.
- **Lead** (400, `clamp(1.125rem → 1.375rem)`, 1.55): párrafo de apertura de cada sección.
- **Body** (400, 1rem, 1.6): texto corrido; medida de 65–75 caracteres.
- **Label** (600, 0.875rem, 1.5): etiquetas de campo, mensajes de error, texto de ayuda.

### Named Rules
**The Balanced Heading Rule.** Todo `h1–h3` usa `text-wrap: balance`; los párrafos, `text-wrap: pretty`.
**The No-Reflex-Face Rule.** No usar Fraunces, Playfair, Space Grotesk, IBM Plex, Inter como display, DM Sans/Serif, Outfit, Plus Jakarta Sans ni Instrument Sans sin una razón escrita (lista de la skill `impeccable`).

## Layout

Contenedor centrado de 1200 px máx. con gutter de 16 px (móvil), 24 px (≥ 640) y 32 px (≥ 1024). Mobile-first; puntos de referencia probados: 360, 390, 768, 1024, 1280 y 1536 px, sin desbordamiento horizontal. Las composiciones son asimétricas: encabezado y acción a un lado, lista editorial al otro (columnas 0.85fr/1.15fr y similares) y una sola columna bajo 1024 px. El relleno vertical de sección es de 64 px (96 px desde 768) más el solape de la hoja siguiente (40/48 px). Las áreas táctiles miden al menos 44 px (controles de formulario, 48 px).

## Elevation & Depth

Híbrido: la jerarquía se da sobre todo por **capas de color** (bandas que se superponen como hojas), y las sombras aparecen solo en elementos que flotan.

### Shadow Vocabulary
- **Card** (`box-shadow: 0 1px 2px rgb(27 18 48 / 0.06), 0 10px 28px -10px rgb(27 18 48 / 0.18)`): reservada; hoy no hay tarjetas elevadas.
- **Raised** (`box-shadow: 0 1px 2px rgb(27 18 48 / 0.1), 0 14px 32px -12px rgb(27 18 48 / 0.32)`): botón flotante de WhatsApp, panel del menú móvil.
- **Header al hacer scroll** (`box-shadow: 0 1px 0 rgb(251 246 238 / 0.08), 0 12px 24px -14px rgb(0 0 0 / 0.5)`): separa el header fijo del contenido.

### Named Rules
**The Sheet Rule.** El ritmo entre secciones lo dan el cambio de tono y el borde superior redondeado de cada «hoja», no las sombras ni los divisores decorativos.
**The No-Halo Rule.** Toda sombra lleva desplazamiento y desenfoque; nunca un resplandor de color sin desplazamiento.

## Shapes

Esquinas redondeadas y sobrias. Controles y botones a 12 px; contenedores y fotos a 16 px; las hojas de sección con radio igual a su solape (40 px / 48 px); solo el botón flotante y el botón de reproducir son circulares. Los radios son concéntricos (radio externo = interno + relleno). Las fotos llevan un contorno de 1 px a 10 % de opacidad (blanco sobre morado, negro sobre claro). Los bordes estructurales son de 1 px a baja opacidad; no hay bordes laterales de color.

## Components

### Buttons
- **Shape:** radio de control (12 px); alto 44 px (`md`) o 56 px (`lg`); peso 600.
- **Primary:** fondo Rojo Oficio, texto Crema; con ícono de WhatsApp cuando la acción es cotizar.
- **Hover / Focus:** hover a Rojo Fuerte en ≤ 150 ms; `scale(0.96)` al presionar; foco con anillo doble (acento + halo del fondo) de 3 px.
- **Secondary:** contorno de 2 px y texto que heredan el color de la sección (crema sobre morado, tinta sobre crema); *hover* con relleno al 10 %.

### Fields
- **Style:** fondo crema sobre morado; blanco con borde de tinta al 55 % sobre crema (3.9:1), de 2 px y 48 px de alto. Etiqueta visible siempre; ayuda y error asociados.
- **State:** error con borde de acento, texto del error y sacudida de 320 ms (solo `transform`); el error nunca depende solo del color.

### Section links
- **Arrow link:** texto con color de énfasis de la sección y flecha que se desplaza 4 px al pasar el cursor; área ≥ 44 px.

### Header / Navigation
- **Style:** barra fija morada con logo, navegación y CTA; bajo 1024 px, menú móvil con panel que se despliega (grid-rows, 280 ms) y que es `inert` al cerrarse.

### WhatsApp button
- **Style:** círculo de 56 px verde, fijo abajo a la derecha, con el área segura de iOS; se oculta en Contáctenos.

### Motion
- **Tokens:** `--ease-out-soft: cubic-bezier(0.16, 1, 0.3, 1)`, `--ease-ui: cubic-bezier(0.2, 0, 0, 1)`; 150 ms (estados), 280 ms (menús), 700 ms (revelados).
- **Inventario permitido:** entrada del título del hero (palabra por palabra, una vez), revelado de listas al entrar al viewport (una vez), sombra del header, microinteracciones de botones y enlaces, sacudida/trazo del formulario y fundido entre páginas (mejora progresiva).

## Do's and Don'ts

### Do:
- **Do** mantener una sola acción primaria («Cotizar por WhatsApp») en toda la web.
- **Do** componer con jerarquía real (columna principal + filas compactas), no con tarjetas iguales.
- **Do** usar solo tokens del tema (`bg-brand-900`, `text-accent`, `rounded-control`…); nada de colores o tamaños sueltos.
- **Do** verificar contraste ≥ 4.5:1 (3:1 en texto grande y bordes de control) antes de añadir un par de colores.
- **Do** dejar visible todo el contenido sin JavaScript y con `prefers-reduced-motion`.
- **Do** marcar con `TODO(contenido)` cualquier texto o dato que falte, en lugar de inventarlo.

### Don't:
- **Don't** usar el rojo exacto del logo (#ed2121) como fondo de texto ni como texto.
- **Don't** añadir rótulos sobre los títulos, números de sección, degradados, vidrio esmerilado ni bordes laterales de color.
- **Don't** usar `transition: all`, animar propiedades que no sean `transform`/`opacity`, ni añadir efectos de scroll (parallax, *scroll-jacking*).
- **Don't** poner WebGL/3D, partículas ni suavizado de scroll: se descartaron para la v1 (plan §6).
- **Don't** afirmar cifras, certificaciones, cobertura, precios ni si Shaddai fabrica o solo distribuye hasta que el cliente lo confirme.
