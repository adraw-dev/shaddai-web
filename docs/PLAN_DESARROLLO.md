# Shaddai Colombia — Plan de desarrollo de la nueva web

> **Estado:** planificación (no hay código). **Fecha:** 2026-11-04. **Alcance:** Fase 1 del producto (Landing + Contáctenos).
> **Para quién es este documento:** desarrolladores y agentes de código que participen después. Es la fuente de verdad de decisiones de diseño, arquitectura y orden de trabajo. **Si una decisión no está aquí, no se improvisa: se agrega primero a este documento** (sección 17, «Decisiones abiertas») y se confirma.
> **Fuente de contenido:** `Sobre_nosotros_Shaddai_Colombia.md` (en el repo irá a `docs/referencia/`, ver F1-07). Los datos duros que se necesitan están copiados en la sección 4 para que este documento sea autosuficiente.

---

## Índice

1. [Objetivo y alcance de la primera fase](#1-objetivo-y-alcance-de-la-primera-fase)
2. [Estructura de la Landing Page](#2-estructura-de-la-landing-page)
3. [Estructura de Contáctenos](#3-estructura-de-contáctenos)
4. [Distribución del contenido existente](#4-distribución-y-organización-del-contenido-existente)
5. [Lineamientos de diseño y UX](#5-lineamientos-de-diseño-y-experiencia-de-usuario)
6. [Skills de diseño instaladas](#6-skills-de-diseño-instaladas-y-su-propósito)
7. [Stack tecnológico](#7-stack-tecnológico-y-justificación)
8. [Arquitectura y carpetas](#8-arquitectura-y-estructura-de-carpetas)
9. [Componentes reutilizables](#9-estrategia-de-componentes-reutilizables)
10. [SEO, accesibilidad y rendimiento](#10-seo-accesibilidad-y-rendimiento)
11. [Despliegue en Vercel y Cloudflare Pages](#11-estrategia-de-despliegue-vercel-y-cloudflare-pages)
12. [Preparación para Strapi](#12-preparación-para-la-futura-integración-con-strapi)
13. [Roadmap de implementación](#13-roadmap-de-implementación)
14. [Criterios de aceptación](#14-criterios-de-aceptación)
15. [Fase futura independiente: Strapi + catálogo](#15-fase-futura-independiente-strapi--catálogo)
16. [Reglas de trabajo para agentes](#16-reglas-de-trabajo-para-agentes)
17. [Decisiones abiertas y datos faltantes](#17-decisiones-abiertas-y-datos-faltantes)

---

## 1. Objetivo y alcance de la primera fase

### 1.1 Objetivo

Construir una web **moderna, atractiva, rápida y responsive** para Shaddai Colombia, un distribuidor de insumos para bebidas de café con sede en Medellín cuyo cliente es el **centro de negocios** (cafeterías, restaurantes, máquinas dispensadoras, comercios), no el consumidor final. El éxito de la web es que un dueño de negocio entienda en segundos **qué vende Shaddai, si atiende su tipo de negocio y cómo cotizar**, y lo haga (WhatsApp o formulario).

La web reemplaza **progresivamente** al sitio actual (WordPress + WooCommerce). En esta fase la tienda y el carrito siguen en el sitio actual; la arquitectura queda lista para incorporarlos (sección 12 y 15).

### 1.2 Dentro del alcance (Fase 1)

| # | Entregable | Detalle |
|---|---|---|
| 1 | **Landing Page** (`/`) | Presenta empresa, líneas de producto, canales comerciales, propuesta de valor (BPM), historia y llamada a cotizar. |
| 2 | **Contáctenos** (`/contactenos/`) | Formulario, datos de contacto, horarios, ubicación/mapa, accesos a WhatsApp. |
| 3 | **Elementos globales** | Header, footer, botón flotante de WhatsApp, página 404, SEO técnico (metadatos, sitemap, robots, datos estructurados). |
| 4 | **Sistema de diseño ligero** | Tokens, componentes reutilizables, patrones de movimiento. |
| 5 | **Despliegue dual** | El mismo artefacto estático despliega en Vercel y Cloudflare Pages. |

### 1.3 Fuera del alcance (no implementar, no «dejar a medias»)

- Tienda, catálogo, carrito, checkout, cuentas de usuario, precios.
- Strapi / cualquier CMS (solo se *prepara* la estructura, sección 12).
- Blog «Novedades» y enlace «Entérate» (hoy vacío/roto; se documenta como futuro).
- Página «Sobre nosotros» independiente: su contenido se integra en la landing (sección 4).
- Modo oscuro conmutable, i18n multi-idioma, analítica, chat en vivo, buscador.
- 3D/WebGL, smooth-scroll con secuestro de scroll, cursores personalizados (ver sección 6.3).

---

## 2. Estructura de la Landing Page

**Modo de diseño (skill `impeccable`): _Persuade_** — el visitante decide y actúa; el diseño es el producto. Se permite una composición con carácter, no una plantilla genérica.

**Narrativa de la página** (orden pensado para la pregunta que se hace un comprador de insumos): *¿qué venden? → ¿atienden mi tipo de negocio? → ¿por qué confiar? → ¿quiénes son? → ¿cómo cotizo?*

| Orden | Sección | ID ancla | Tono de fondo | Propósito | Contenido (ver sección 4) |
|---|---|---|---|---|---|
| 0 | **Header** (global) | — | transparente → sólido al scroll | Navegar + CTA constante | Logo, nav: Productos · Canales · Nosotros · Contáctenos; botón «Cotizar por WhatsApp» |
| 1 | **Hero** | `#inicio` | Morado de marca (envolvente) | Declarar la propuesta y llevar a la acción | H1 basado en «Insumos de Calidad» / «Procuramos por el sabor de un buen café»; CTA primario **Cotizar por WhatsApp**; CTA secundario **Conoce Nuestro Catálogo**; imagen de producto real |
| 2 | **Líneas destacadas** | `#productos` | Crema | Qué vende Shaddai | **Lattes**, **Café**, **Capuccinos** (descripciones del MD) + CTA al catálogo. *Incluye* el mensaje «Café fresco» (se fusiona aquí y en 5; no es sección aparte) |
| 3 | **Canales comerciales** | `#canales` | Morado/tinta | Que el visitante se reconozca | **HORECA** (destacado, con el detalle del MD), **VENDING**, **MAQUILA**, **RETAIL** — cada uno con enlace a su categoría actual |
| 4 | **La mejor taza servida** | `#calidad` | Crema | Propuesta de valor + confianza | Tres pilares (*El mejor café · Leche de calidad · Mezclas perfectas*), sello **BPM**, cita sobre la primera impresión del café |
| 5 | **Nuestra historia** | `#nosotros` | Crema cálida | Humanizar y cerrar confianza | Origen (máquinas → insumos), frase poética del grano, video de YouTube (con fachada de carga diferida) |
| 6 | **Cierre: cotizar** | `#cotizar` | Morado de marca | Convertir | Mini-flujo *nombre + ciudad de envío* → abre WhatsApp con mensaje precargado; enlace a Contáctenos |
| — | **Footer** (global) | — | Tinta | Datos de referencia | Logo, razón social, contacto resumido, horarios, redes, legal |

**Reglas de composición** (derivadas de `no-ai-design-slop`; ver 5.6):
- Las tres líneas de producto y los tres pilares **no son tres tarjetas idénticas con ícono en recuadro**. Líneas = filas/bloques asimétricos guiados por imagen. Pilares = lista tipográfica con jerarquía, sin «icon tiles».
- Un solo punto focal por viewport y una sola acción primaria por sección.
- Cada sección alterna el tono de fondo para crear el ritmo y las «transiciones entre secciones» (sección 5.5).

---

## 3. Estructura de Contáctenos

Ruta: `/contactenos/` (con barra final, igual que el estilo de URLs del sitio actual).

| Orden | Bloque | Propósito | Contenido |
|---|---|---|---|
| 1 | **Encabezado compacto** | Orientar | H1 «Contáctenos» + una frase que diga qué ofrecen los canales (asesoría / cotización) |
| 2 | **Accesos rápidos** | Resolver sin formulario | Dos acciones WhatsApp con los **dos mensajes del MD**: *Asesoría personalizada* y *Cotizar*; llamar (dos móviles); correo |
| 3 | **Formulario** | Captura estructurada | Ver 3.1 |
| 4 | **Información** (columna lateral en desktop) | Datos de referencia | Dirección, horarios (tabla), redes sociales |
| 5 | **Ubicación** | Llegar | Tarjeta con dirección + «Cómo llegar» (enlace al mapa del MD); mapa embebido **opcional** y cargado bajo demanda |

### 3.1 Formulario

Pensado a partir del dato que el MD dice que Shaddai necesita para cotizar: **nombre + ciudad de envío**.

| Campo | Tipo | Requerido | Nota |
|---|---|---|---|
| Nombre | text | Sí | `autocomplete="name"` |
| Ciudad de envío | text | Sí | `autocomplete="address-level2"` |
| Teléfono / WhatsApp | tel | Sí | `autocomplete="tel"`, formato Colombia (`+57`) |
| Correo | email | No* | *Decisión abierta (17): hacerlo requerido si el envío es por correo |
| Tipo de negocio | select | No | HORECA · VENDING · MAQUILA · RETAIL · Otro |
| Mensaje | textarea | No | |
| Autorización de datos | checkbox | Sí | Texto y enlace a política: **pendiente del cliente** (ver 17, Ley 1581 de 2012) |
| *Honeypot* | oculto | — | Anti-spam sin dependencias |

**Dos formas de enviar (mismos datos y misma validación):**
1. **Enviar mensaje** → `POST` al endpoint configurado en `NEXT_PUBLIC_CONTACT_ENDPOINT` (proveedor por decidir, sección 17). Si la variable no existe, este botón no se muestra.
2. **Enviar por WhatsApp** → arma un enlace `wa.me` con el mensaje precargado (nombre, ciudad, tipo de negocio, mensaje). **No requiere backend.**

**Estados obligatorios:** inicial, validación por campo (mensaje asociado con `aria-describedby`), enviando (botón deshabilitado + texto), éxito (región `aria-live`, con opción de continuar por WhatsApp), error de red (reintentar sin perder lo escrito).

> **Por qué no hay horario «Abierto ahora»:** el horario depende de festivos colombianos; calcularlo en cliente daría información incorrecta. Se muestra la tabla fija del MD.

---

## 4. Distribución y organización del contenido existente

### 4.1 Datos duros (copiados del MD; usar tal cual)

| Dato | Valor |
|---|---|
| Marca web | **Shaddai Colombia** (registrada *ShaddaiColombia®*) |
| Razón social | **Shaddai Insumos S.A.S.** (la usan Facebook, Instagram y el chat de WhatsApp) |
| Frase de cabecera | «Insumos de Calidad» |
| Título de bloque principal | «Procuramos por el sabor de un buen café» |
| Móviles | +57 304 202 9533 · +57 314 691 5481 |
| Correo | ventasonline@shaddaicolombia.com |
| Dirección | Carrera 81 # 36-79, diagonal al VIVA Laureles, Medellín, Colombia |
| Mapa | https://maps.app.goo.gl/ojAfC4e3jedpU7KPA |
| Horario | Lun–vie 8:00 a. m.–4:00 p. m. · Sáb 8:00 a. m.–11:00 a. m. · Domingos y festivos: cerrado |
| Facebook | https://es-la.facebook.com/pages/category/Food---Beverage/Shaddai-Insumos-104529957585714/ |
| Instagram | https://www.instagram.com/shaddai.insumos/ |
| Video | YouTube `NYPI5JoMi4M` (usar `youtube-nocookie.com/embed/…` con fachada) |
| Color de marca | `#25094b` |
| Mensaje WhatsApp — Asesoría | Saludo cercano con emojis; ofrece asesoría personalizada con los pedidos y pregunta en qué pueden ayudar |
| Mensaje WhatsApp — Cotizar | Agradece el interés en los productos de Shaddai Insumos S.A.S. y pide **nombre y lugar de envío** para responder con tiempos de entrega y costos. Botón: «Cotizar» |

> Los textos exactos de los mensajes de WhatsApp **no están literales en el MD** (solo su descripción). Hay que obtenerlos del botón actual del sitio o redactarlos y validarlos con el cliente (17, D-08).

### 4.2 Mapa de contenido: de dónde viene cada pieza y dónde vive

Principio: **cada idea aparece una sola vez** en la web. El MD (sección 12) ya advierte que la página original repite contenido de la portada.

| Contenido del MD | Va en | Cómo se trata |
|---|---|---|
| §1 Quiénes son / Insumos de Calidad / «Procuramos por el sabor…» | Hero | Se condensa en H1 + subtítulo de 1–2 líneas |
| §1 Cuatro canales | Canales | Una tarjeta por canal |
| §2 Lattes / Café / Capuccinos (+ imágenes) | Líneas destacadas | Texto del MD, imágenes `coffee-item-2/1/3.png` |
| §2 «Conoce Nuestro Catálogo» | Hero (secundario) + Líneas | Enlaza a la tienda actual (ver 4.4) |
| §3 Historia + frase poética | Nuestra historia | Se conserva la frase poética (el MD la marca como la pieza más emocional). **El texto literal no está en el MD** → obtenerlo (D-07) |
| §3 Video YouTube | Nuestra historia | Fachada: miniatura + botón; el iframe se carga al hacer clic |
| §4 Café fresco («no hay segunda oportunidad para la primera impresión») | La mejor taza servida (cita) y línea «Café» | **No** es sección propia (evita repetir) |
| §5 HORECA (detalle + «Ver Productos») | Canales — tarjeta destacada | Es el único canal con detalle en el MD |
| §6 «La mejor taza servida» + 3 pilares + BPM | La mejor taza servida | Estructura propia, ver 2 |
| §6 Galería de 3 fotos | Líneas destacadas o Historia | Una sola ubicación; elegir en F3 según el diseño |
| §7 Novedades/blog | — | **Excluido de Fase 1** |
| §8 Horario | Contáctenos + Footer (resumen) | Tabla completa solo en Contáctenos |
| §9 Contacto y redes | Contáctenos (completo) + Footer (resumido) | Un único módulo de datos en `content/site.ts` |
| §10 WhatsApp | FAB global, Hero, Cierre, Contáctenos | Un solo helper (`lib/whatsapp.ts`) |
| §11 Identidad visual | Tokens y metadatos | Ver 5.2 y 10.1 |
| §12 Correcciones | Reglas de redacción (4.3) | |

### 4.3 Reglas de redacción

- Corregir lo señalado en el MD: *Calidad* (no «Calídad»), *búsqueda*, *Catálogo*, *máquinas*, *garantizarás/garantiza*.
- **Un solo registro de tratamiento.** Propuesta: **usted** (B2B, tono confiable). Confirmar en D-09.
- Nombre del producto «Capuccinos»: la grafía del MD no es la preferida en español (*capuchinos*, o la forma italiana *cappuccinos*). Confirmar con el cliente antes de publicar (D-10).
- **Prohibido inventar:** años de experiencia, número de clientes, certificaciones distintas de «procesos BPM», premios, cifras, testimonios, precios, tiempos de entrega, cobertura geográfica. Si un texto falta, se deja el marcador `TODO(contenido)` en `content/` y se lista en D-xx; no se rellena con texto genérico.
- **Vacíos de contenido ya identificados:** descripciones de VENDING, MAQUILA y RETAIL (el MD solo da su definición de una línea: *máquinas expendedoras*, *producción para terceros*, *venta minorista*). Hasta que el cliente entregue texto, esas tarjetas usan **solo** esa definición.
- Título de la `<title>` y meta descripción: el MD marca la actual como vacía. Propuesta (a validar): *«Shaddai Colombia | Insumos para café en Medellín»* y *«Distribuidor de insumos para café en Medellín: café, lattes y capuchinos para cafeterías, restaurantes, vending y retail. Cotice por WhatsApp.»*

### 4.4 Enlaces hacia la tienda actual (durante la Fase 1)

Las categorías del sitio actual existen y tienen URL conocida (MD §1): `/categoria/horeca/`, `/categoria/vending/`, `/categoria/maquila/`, `/categoria/retail/`, todas bajo `https://www.shaddaicolombia.com/`.
- Se construyen con `NEXT_PUBLIC_LEGACY_SITE_URL` + ruta. **La URL exacta de «la tienda» (home del catálogo) no está en el MD**: confirmarla (D-11).
- Estos enlaces están **centralizados** en `content/channels.ts`; en la fase de Strapi se reemplazan por rutas internas sin tocar componentes.

---

## 5. Lineamientos de diseño y experiencia de usuario

> **Estado de la dirección visual:** lo de abajo es una **propuesta fundamentada**. La skill `impeccable` exige confirmar la dirección con el usuario antes de construir (comando `shape` / flujo *new-work*). Eso es la tarea **F2-02**; hasta su cierre, los valores marcados «propuesta» no son definitivos. **Fijo (no negociable):** color de marca `#25094b`; animación sutil; rendimiento primero.

### 5.1 Tesis visual (propuesta)

*Abastecimiento serio con calidez de oficio.* Una marca de distribución B2B que se siente confiable (morado profundo, tipografía firme) y al mismo tiempo huele a café (crema, tostado, caramelo). Producto real como protagonista; ninguna decoración sin función.

**Estrategia de color: _Committed_** (impeccable): el morado de marca ocupa 30–60 % de la superficie en bandas de página completa (hero, canales, cierre), alternadas con crema. No es un acento esparcido sobre fondo blanco.

**Escena física (decide claro/oscuro):** un dueño de cafetería o comprador de un negocio en Medellín revisa proveedores desde el celular, con luz de día, entre servicios. → **Un solo tema claro-dominante, mobile-first.** No hay selector de modo oscuro.

### 5.2 Paleta (propuesta — derivada de `#25094b`)

Solo `#25094b` está documentado por el cliente; **el resto son derivados** y se confirman contra el logo real en F2-02. Contrastes calculados (WCAG 2.x) el 2026-11-04:

| Token | Valor | Uso | Contraste verificado |
|---|---|---|---|
| `--color-brand-900` | `#25094b` | Marca, fondos envolventes, texto sobre crema | sobre crema-50: **16.0:1** |
| `--color-brand-700` | `#4a1d8a` | Enlaces, énfasis secundario | sobre crema-50: **10.6:1** |
| `--color-brand-300` | `#c9b6ee` | Texto secundario sobre morado | sobre brand-900: **9.4:1** |
| `--color-cream-50` | `#fbf6ee` | Fondo base claro | — |
| `--color-cream-100` | `#f3eadb` | Fondo de sección cálida | texto brand-900: **14.4:1** |
| `--color-ink` | `#1b1230` | Texto principal | sobre crema-50: **16.6:1** |
| `--color-roast` | `#4a2c1a` | Detalles «tostado» | sobre crema-100: **10.6:1** |
| `--color-caramel` | `#d9902f` | Acento / CTA principal | sobre brand-900: **6.5:1**; texto `ink` sobre caramelo: **6.8:1** |
| `--color-caramel-deep` | `#9a5a0e` | Acento sobre claro (texto/enlaces) | sobre crema-50: **5.1:1** |
| `--color-whatsapp` | *(verde de marca WhatsApp, a definir)* | Solo botones de WhatsApp | verificar al definirlo |

> ⚠️ **Regla:** `--color-caramel` sobre crema da solo **2.45:1** → **prohibido como color de texto sobre claro**. Para texto de acento sobre claro, usar `--color-caramel-deep`.
> Definir en `@theme` de Tailwind v4 (colores en OKLCH o hex), con alias semánticos (`--surface`, `--on-surface`, `--accent`) para no usar tonos crudos en los componentes.

### 5.3 Tipografía (propuesta — por validar en F2-02)

- **Máximo dos familias**, autoalojadas con `next/font`, `display: swap`, subconjunto latino.
- **Display con carácter** (titulares, cifras) + **cuerpo humanista legible**. La skill `impeccable` desaconseja por reflejo estas familias: *Fraunces, Playfair, Cormorant, Lora, Crimson, Newsreader, Syne, Space Grotesk/Mono, IBM Plex, Inter como display, DM Sans/Serif, Outfit, Plus Jakarta Sans, Instrument Sans.* **No usarlas** salvo justificación escrita.
- Candidatos a evaluar en F2-02 (comprobar disponibilidad en `next/font/google`): *Bricolage Grotesque* (display) + *Hanken Grotesk* (cuerpo), o *Familjen Grotesk* + *Figtree*. Elegir una pareja y registrarla aquí.
- **Escala fluida** con `clamp()` (mobile 360 px → desktop 1440 px); cuerpo mínimo 16 px, interlineado 1.5–1.65, medida de línea 60–75 caracteres.
- `text-wrap: balance` en títulos, `text-wrap: pretty` en párrafos; `tabular-nums` si hay cifras; `-webkit-font-smoothing: antialiased` en la raíz.
- Roles tipográficos definidos como tokens: `display`, `h1`–`h3`, `lead`, `body`, `small`, `label`. Los componentes usan roles, no tamaños sueltos.

### 5.4 Imágenes e iconografía

- Producto real como protagonista (`coffee-item-*.png`, galería). Si la calidad de los archivos del sitio actual no alcanza para pantalla de alta densidad, **solicitar originales al cliente** (D-05). No usar fotos de stock genéricas de granos de café esparcidos.
- Íconos: **SVG propios en línea** (`currentColor`), un solo grosor de trazo (1.5 px junto a texto regular). Íconos de redes y WhatsApp como SVG locales (las librerías de íconos más usadas ya no incluyen marcas). Los `icon-1/2/3.png` del sitio actual se **redibujan como SVG** o se reutilizan si la calidad lo permite.
- Logo: pedir **SVG o PNG alta resolución**; el archivo actual se llama `shadday-…` (error de ortografía) → renombrar a `shaddai-colombia-logo.*`.
- Todas las imágenes: `width`/`height` explícitos (evita CLS), `alt` descriptivo en español (decorativas: `alt=""`), contorno de 1 px a baja opacidad (`oklch(0 0 0 / 0.1)`) para consistencia de profundidad.

### 5.5 Movimiento: principios, inventario y presupuesto

**Principio rector (de `no-ai-design-slop` y `make-interfaces-feel-better`):** el movimiento explica estado, jerarquía o continuidad. No se anima para «demostrar» que la página es interactiva. Sin pantalla de carga/preloader.

**CSS primero.** Tokens de movimiento (duración, easing, distancia) definidos una vez (patrón de `transitions-dev`) y reutilizados. Valores de partida:

| Token | Valor | Nota |
|---|---|---|
| `--ease-out-soft` | `cubic-bezier(0.16, 1, 0.3, 1)` | Entradas |
| `--ease-ui` | `cubic-bezier(0.2, 0, 0, 1)` | Cambios de estado |
| `--dur-fast` | 150 ms | hover, foco, color |
| `--dur-base` | 250–300 ms | menús, estados |
| `--dur-reveal` | 600–800 ms | revelado de secciones (una sola vez) |
| `--reveal-distance` | 16–20 px | `translateY` |
| `--stagger` | 60–100 ms | máximo 6 elementos por grupo |

**Inventario permitido (todo lo demás requiere actualizar este documento):**

| Dónde | Efecto | Técnica | Skill de referencia |
|---|---|---|---|
| Hero | Entrada escalonada del H1 por palabras, **una vez** | CSS + `IntersectionObserver`, contenido visible sin JS | `staggered-word-reveal` |
| Secciones | Revelado al entrar al viewport (fade + 16–20 px), **una vez** | Componente `Reveal` (IO) | `transitions-dev` · «Texts reveal» |
| Entre secciones | Cambio de tono de fondo (morado ↔ crema) con borde de sección con forma (curva/diagonal suave en CSS/SVG estático) | CSS estático | `impeccable` (`layout`, `animate`) |
| Header | Pasa de transparente a sólido al hacer scroll | CSS + 1 listener pasivo / IO | `make-interfaces-feel-better` |
| Botones | Hover ≤ 150 ms, `scale(0.96)` al presionar, flecha desplazable en enlaces «ver más» | CSS | `transitions-dev` · «Learn more hover»; `make-interfaces-feel-better` |
| Menú móvil | Despliegue con origen consciente | CSS | `transitions-dev` · «Menu dropdown»/«Panel reveal» |
| Formulario | Sacudida de error por campo; marca de éxito con trazo | CSS | `transitions-dev` · «Error state shake», «Success check» |
| Navegación entre páginas | Fundido corto vía *View Transitions* como **mejora progresiva** (si el navegador no la soporta, no pasa nada) | CSS `@view-transition` / API | `transitions-dev` · «Page…» |

**Reglas duras**
- Solo animar `transform` y `opacity` (y `filter` puntual). **Nunca** `transition: all`. `will-change` solo si hay tirones medibles.
- **`prefers-reduced-motion: reduce`** → sin desplazamientos ni escalonados; los contenidos aparecen completos y estáticos.
- Sin JS el contenido **debe ser visible** (los estados ocultos solo se aplican cuando JS ya está activo).
- El movimiento nunca es el único canal de feedback: siempre hay cambio de color, texto o ícono.
- Sin parallax, sin scroll-jacking, sin cursores personalizados, sin partículas, sin efectos de entrada en hover repetitivo.
- **Presupuesto:** ningún efecto puede degradar INP/LCP/CLS (objetivos en 10.3). Si una animación no cabe en CSS o necesita librería → pasa por la *puerta GSAP* (7.3).

### 5.6 Anti-patrones («AI slop») a evitar — checklist para revisión

Aplicar la skill `no-ai-design-slop` como filtro pasivo. Específicamente para esta web:
- ❌ Rejilla de 3 tarjetas idénticas con ícono en recuadro y título (líneas / pilares).
- ❌ «Eyebrows» en píldora sobre cada título, numeraciones decorativas, etiquetas de relleno.
- ❌ Degradados tipo *blob*, vidrio esmerilado, brillos/halos sin función, rejillas de fondo decorativas.
- ❌ Métricas, logos de clientes, testimonios o insignias inventados.
- ❌ Fondo crema + serif de moda + terracota «por defecto» sin relación con la marca (la paleta aquí parte de `#25094b`).
- ❌ Tarjetas dentro de tarjetas; sombras duras gratuitas.
- ✅ Cada elemento decorativo supera la **prueba de eliminación**: si se quita y la claridad mejora, se quita.

### 5.7 Responsive

- **Mobile-first.** Puntos de referencia de prueba: **360, 390, 768, 1024, 1280, 1536 px**. Tailwind: `sm 640 / md 768 / lg 1024 / xl 1280 / 2xl 1536` (por defecto, sin personalizar salvo necesidad documentada).
- Contenedor con ancho máximo (~1200–1280 px) y *gutter* de 16 px en móvil, 24–32 px en tablet/desktop.
- Áreas táctiles ≥ **44×44 px** (≥ 40×40 en desktop denso); no solapar áreas de dos controles.
- Nunca scroll horizontal de página. Imágenes y video con `aspect-ratio` reservado.
- Header: móvil con menú colapsable (botón con `aria-expanded`); desktop con navegación visible. El botón flotante de WhatsApp no puede tapar contenido ni controles del formulario.

### 5.8 UX y microcopy

- Una **acción primaria por sección** y siempre la misma en toda la web: *Cotizar por WhatsApp*.
- CTA con verbos concretos («Cotizar por WhatsApp», «Ver productos HORECA»); evitar «Click aquí».
- Mensajes de error: qué pasó + cómo corregir, en tono neutro y en el mismo registro (usted).
- Estados vacíos/errores de red/éxito del formulario diseñados, no por defecto del navegador.
- Enlaces `tel:`/`mailto:`/`wa.me` con texto visible y `aria-label` solo cuando el texto no basta.

---

## 6. Skills de diseño instaladas y su propósito

Instaladas el **2026-11-04** en `~/.claude/skills/`. Esta sección define **cuáles se usan, cuándo y para qué**, y cuáles se descartan para la v1.

### 6.1 Skills que se usan

| Skill | Propósito en este proyecto | Cuándo |
|---|---|---|
| **`impeccable`** | Skill rectora de diseño. Comandos: `init` (crea `PRODUCT.md`), `shape` (brief de UX antes de codificar), `typeset` (tipografía), `colorize`, `layout` (espaciado/jerarquía), `animate`, `adapt` (responsive), `clarify` (microcopy), `critique`/`audit` (revisión), `polish`, `optimize`, `document` (genera `DESIGN.md`). | F2 (init, shape, typeset, colorize) · F3–F4 (layout, clarify) · F5 (animate, adapt, optimize, polish, audit, document) |
| **`no-ai-design-slop`** | Filtro pasivo de calidad: evita defaults genéricos y exige que cada elemento tenga función. | Siempre que se agregue una sección, componente o efecto |
| **`make-interfaces-feel-better`** | Detalles de acabado: radios concéntricos, alineación óptica, sombras en capas, `scale(0.96)` al presionar, `text-wrap`, números tabulares, áreas táctiles, contorno de imágenes, grosor de íconos. | F2 (componentes) y F5 (pulido) |
| **`transitions-dev`** (+ **`transitions-polish`**) | Biblioteca de transiciones CSS portables con tokens de movimiento. Se usan solo: *Texts reveal*, *Menu dropdown / Panel reveal*, *Learn more hover*, *Error state shake*, *Success check*. `transitions-polish` afina duraciones/easings contra los tokens. | F2 (tokens) · F4 (form) · F5 (afinado) |
| **`staggered-word-reveal`** | Revelado palabra por palabra **solo del H1 del hero**, una vez, sin GSAP. | F5 |
| **`webgl-landing-steering`** | Se consultó como *marco de decisión*; la conclusión es **no usar WebGL** en la v1 (ver 6.2). | Decisión ya tomada |

### 6.2 Decisión documentada: sin WebGL/3D

Un distribuidor B2B de insumos necesita **claridad, velocidad y confianza**; su público entra desde el celular. WebGL añadiría peso, consumo de batería y riesgo de accesibilidad sin ayudar a cotizar. **Se descartan en la v1:** `threejs`, `threejs-*` (todas las variantes), `webgl-3d-object`, `globe-particles`, `background-grid-webgl`, `add-shader-cursor-trail`, `shaders-cursor-ripples`, `add-mouse-driven-orbit`, `build-threejs-scroll-worlds`, `build-interactive-particle-trail`, `ambient-section-particles`.

### 6.3 Otras skills descartadas para la v1 (y por qué)

| Skill | Motivo |
|---|---|
| `cinematic-gsap-lenis-motion-system`, `cinematic-scroll-storytelling`, `horizontal-scroll-scenes` | Suavizado/secuestro de scroll y escenas pinneadas: accesibilidad, rendimiento móvil y contra la instrucción de «no sobrecargar». |
| `build-awwwards-quality-sites` | Orientada a sitios de alto impacto de movimiento; el objetivo aquí es conversión B2B sobria. |
| `scroll-scrubbed-word-reveal`, `masked-reveal` | Duplican a `staggered-word-reveal` (que ya cubre el único caso de texto animado) y requieren más JS. |
| `atmosphere-background` | Fondos atmosféricos decorativos: no cumplen la prueba de eliminación. |

### 6.4 Skills condicionales (puerta GSAP)

`gsap-core`, `gsap-react`, `gsap-scrolltrigger`, `gsap-timeline`, `gsap-performance`: **solo** si, en F5, un momento de diseño aprobado no se puede resolver con CSS + `IntersectionObserver` (ver 7.3). Hasta entonces, no se instala `gsap`.

### 6.5 Skills ajenas al diseño que ya existen (no usar aquí)

`generate-migration-tasks`, `migrate-angular-to-react`: pertenecen al design system corporativo (Angular→React); **no aplican** a este proyecto.

> **Nota operativa sobre `impeccable`:** su primer paso (`impeccable context`) puede descargar un binario auxiliar la primera vez que corre. Un agente debe pedir aprobación al usuario antes de ejecutarlo.

---

## 7. Stack tecnológico y justificación

### 7.1 Decisión principal

**Next.js (App Router) + React + TypeScript + Tailwind CSS v4, publicado como _sitio estático_ (`output: 'export'`).**

**Versiones de referencia** (consultadas con `npm view` el 2026-11-04): `next 16.4.5`, `react 19.3.1`, `tailwindcss 4.3.4`, Node `v22` local. **Instaladas en F1** por `create-next-app`: `next 16.4.5`, `react`/`react-dom 19.3.0`, `typescript ^5`. **Regla:** usar las versiones que fije `create-next-app` al inicializar y registrarlas en el README; no forzar versiones mayores de TypeScript u otras herramientas si `create-next-app` no las trae.

### 7.2 Justificación

| Decisión | Motivo | Alternativa descartada |
|---|---|---|
| **Next.js + React** | Preferencia declarada. Metadatos, `sitemap`/`robots`, prerenderizado a HTML estático y estructura de rutas escalable. Coincide con convenciones de tus proyectos recientes (`my-app`: Next + TS + Tailwind 4 + ESLint 9 + Turbopack). | Vite+React: sin metadatos/SEO integrados |
| **Exportación estática** | Es **el único modo que garantiza el mismo artefacto en Vercel y Cloudflare Pages sin adaptadores**. La web de Fase 1 es 100 % contenido estático; el formulario no necesita servidor propio (7.4). Mejor TTFB, costo mínimo, sin fallos de runtime. | SSR/ISR: en Cloudflare exige un adaptador distinto (OpenNext sobre Workers) → dos pipelines distintos |
| **TypeScript estricto** | Contratos claros entre contenido, dominio y UI (clave para Strapi). | JS |
| **Tailwind CSS v4** | Convención ya usada (`my-app`). Tokens en CSS (`@theme`), sin config JS, bundle mínimo. | CSS Modules/Styled: sin ventaja aquí |
| **Sin librería de componentes (shadcn/Radix)** | El `anniversary-landing-page` arrastra decenas de paquetes `@radix-ui/*` que aquí no se necesitan. Los componentes requeridos (botón, campos, menú móvil, acordeón opcional) se resuelven con HTML nativo + ARIA. | shadcn/ui |
| **Sin `next/image`** | Con exportación estática exigiría `unoptimized` o un *loader* propio, y los *loaders* difieren por plataforma. Se usa un componente `<Picture>` con `<img srcset sizes width height loading decoding>` sobre archivos AVIF/WebP preoptimizados (y, en Strapi, sobre sus `formats` — sección 12). | `next/image` + loader por plataforma |
| **Sin librería de formularios/validación** | 6–7 campos: validación nativa + función propia pequeña, testeable. | react-hook-form + zod |
| **Íconos como SVG propios** | ~10 íconos; las marcas (WhatsApp, Instagram, Facebook) hay que dibujarlas igualmente. | lucide-react |

### 7.3 Dependencias: lista cerrada

**Producción (obligatorias):** `next`, `react`, `react-dom`.

**Desarrollo (las que genera `create-next-app` 16.4.5, instaladas en F1):** `typescript`, `@types/node`, `@types/react`, `@types/react-dom`, `tailwindcss`, `@tailwindcss/turbopack`, `eslint`, `eslint-config-next`. *(Esta versión integra Tailwind con el loader `@tailwindcss/turbopack` — configurado en `next.config.ts` — en lugar de `@tailwindcss/postcss`.)*

**Desarrollo (añadidas en F6, justificadas):**

| Paquete | Justificación | Cuándo |
|---|---|---|
| `vitest` | Pruebas unitarias de funciones puras críticas (`buildWhatsAppUrl`, validadores, `env`). | F6 |
| `@playwright/test` + `@axe-core/playwright` | Prueba E2E de navegación y formulario, capturas responsive y verificación automática de accesibilidad (lo que no se puede garantizar «a ojo»). | F6 |

**Condicional — _puerta GSAP_:** `gsap` (+ `@gsap/react`). Solo se instala si se cumplen **las tres**: (1) el momento está en el inventario de 5.5 o se agregó con aprobación; (2) se probó en CSS/IO y no alcanza; (3) se mide que no empeora LCP/INP, cargándolo de forma diferida solo en esa sección. Registrar la decisión en este documento.

**Prohibido sin actualizar esta tabla:** `framer-motion`/`motion`, `lenis`, `three`/`@react-three/*`, `lucide-react`, `@radix-ui/*`, `shadcn`, `clsx`/`tailwind-merge`/`cva` (se usa un helper `cn()` de 3 líneas), `axios`, `zod`, `react-hook-form`, librerías de carrusel.

### 7.4 Gestor de paquetes y scripts

- **npm** (como `my-app`; mantener `package-lock.json`). Confirmar en D-12 si se prefiere pnpm.
- Scripts: `dev` (`next dev --turbopack`), `build` (`next build`), `lint` (`eslint .`), `typecheck` (`tsc --noEmit`), `test`, `test:e2e`. La vista previa local del build estático se hace sirviendo `out/` con `npx serve out` (sin instalarlo como dependencia).
- **Node:** fijar versión LTS en `.nvmrc` y en `engines` del `package.json` (necesario también para Cloudflare Pages, sección 11).

### 7.5 Limitaciones de la exportación estática (conocidas y aceptadas)

- No hay *Route Handlers* ni *Server Actions* en tiempo de ejecución → el formulario usa un endpoint externo + WhatsApp (3.1).
- `redirects()`/`headers()` de `next.config` **no aplican** → redirecciones y cabeceras se definen por plataforma (11.4).
- `sitemap.ts`/`robots.ts` deben declararse estáticos (`export const dynamic = 'force-static'`).
- Sin ISR ni *draft preview*. Para Strapi se resuelve con reconstrucción por *webhook* (sección 12.5). Si en el futuro hiciera falta SSR/ISR/preview, la salida documentada es migrar a Vercel (nativo) o a OpenNext sobre Cloudflare Workers (verificar la documentación vigente de Cloudflare en ese momento).

---

## 8. Arquitectura y estructura de carpetas

### 8.1 Principios

1. **Rutas finas.** `app/**/page.tsx` solo compone secciones y define metadatos; no contiene marcado de negocio.
2. **El contenido no vive en los componentes.** Textos, enlaces y datos de negocio están en `src/content/` (tipado). Los componentes reciben datos por *props*.
3. **Dependencias unidireccionales:** `app → features → components → lib/domain`. Un componente de `components/ui` nunca importa de `features/`.
4. **Un solo lugar por responsabilidad:** datos de negocio (`content/site.ts`), enlaces WhatsApp (`lib/whatsapp.ts`), variables de entorno (`lib/env.ts`), SEO (`lib/seo.ts`).
5. **Componentes de servidor por defecto**; `"use client"` solo donde hay estado/efectos (menú móvil, formulario, `Reveal`, fachada de video).

### 8.2 Estructura propuesta

```
Shaddai/
├─ AGENTS.md                      # Puntero corto a este plan + reglas esenciales (F1-05)
├─ PRODUCT.md  DESIGN.md          # Generados por impeccable (init en F2, document en F5)
├─ README.md                      # Cómo correr, variables, despliegue
├─ .env.example                   # Plantilla de variables (se versiona); .env.local no
├─ .nvmrc  .gitignore  eslint.config.mjs  next.config.ts  postcss.config.mjs  tsconfig.json
├─ docs/
│  ├─ PLAN_DESARROLLO.md          # ESTE documento
│  └─ referencia/Sobre_nosotros_Shaddai_Colombia.md
├─ public/
│  ├─ images/
│  │  ├─ brand/                   # logo (svg/png), og-image
│  │  ├─ products/                # lattes / cafe / capuccinos (AVIF + WebP, varios anchos)
│  │  └─ gallery/
│  ├─ _headers                    # Cloudflare Pages: cabeceras de seguridad/caché
│  ├─ _redirects                  # Cloudflare Pages: redirecciones
│  └─ (favicon e íconos)
├─ vercel.json                    # Vercel: redirecciones y cabeceras equivalentes
├─ tests/                         # Playwright (e2e) — F6
└─ src/
   ├─ app/
   │  ├─ layout.tsx               # <html lang="es-CO">, fuentes, Header/Footer, metadatos base
   │  ├─ page.tsx                 # Landing (compone features/home)
   │  ├─ contactenos/page.tsx     # Contáctenos (compone features/contact)
   │  ├─ not-found.tsx            # 404
   │  ├─ sitemap.ts  robots.ts    # estáticos
   │  └─ globals.css              # @import tailwind; capas base; tokens (@theme)
   ├─ components/
   │  ├─ ui/                      # Primitivos sin lógica de negocio (9.1)
   │  ├─ layout/                  # Header, MobileNav, Footer, SkipLink, WhatsAppFab
   │  ├─ media/                   # Picture, VideoFacade
   │  ├─ motion/                  # Reveal, useInView (tokens en CSS)
   │  └─ icons/                   # SVG inline (WhatsApp, Instagram, Facebook, Phone, Mail, Pin, Clock, Arrow…)
   ├─ features/
   │  ├─ home/                    # Hero, ProductLines, Channels, ValueProp, Story, QuoteCta
   │  └─ contact/                 # ContactForm, QuickActions, ContactInfo, MapCard, validation.ts, submit.ts
   ├─ content/                    # Contenido tipado (único origen del texto en Fase 1)
   │  ├─ site.ts                  # marca, razón social, contacto, horarios, redes
   │  ├─ home.ts  contact.ts
   │  ├─ channels.ts  product-lines.ts
   │  └─ whatsapp-messages.ts
   ├─ domain/                     # Tipos del negocio, independientes de la fuente de datos (12)
   │  └─ catalog.ts               # Channel, ProductLine, Category, Product, Media, Price…
   └─ lib/
      ├─ env.ts                   # Lectura y validación de variables de entorno
      ├─ whatsapp.ts              # buildWhatsAppUrl(message, context?)
      ├─ seo.ts                   # helpers de metadatos y JSON-LD
      ├─ catalog/                 # Punto de acceso a datos (Fase 1: estático; futuro: Strapi) — 12
      ├─ integrations/            # Un adaptador por servicio externo (form, maps, analytics…) — 8.4
      └─ cn.ts                    # unión de clases (3 líneas)
```

**Alias de importación:** `@/*` → `src/*`. **Nombres:** archivos en *kebab-case* (excepto componentes `PascalCase.tsx`, siguiendo la salida de `create-next-app`); un componente por archivo; exportaciones con nombre.

### 8.3 Estilos

- **Tailwind v4** con tokens en `@theme` dentro de `globals.css` (colores, tipografía, radios, sombras, movimiento). Los componentes usan **clases utilitarias + tokens semánticos**; sin valores mágicos repetidos (colores en hex, píxeles sueltos).
- Variantes de componentes con un objeto de clases tipado (no una librería).
- CSS propio solo para: estados de revelado, `@view-transition`, `prefers-reduced-motion`, formas de borde de sección.
- **Nada de CSS-in-JS.** Un solo sistema de estilos.

### 8.4 Variables de entorno e integraciones futuras

**Patrón:** cada servicio externo vive detrás de **un adaptador** en `lib/integrations/<servicio>.ts` y **una variable de entorno validada** en `lib/env.ts`. Cambiar de proveedor = tocar un archivo.

| Variable | Alcance | Obligatoria | Uso |
|---|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | pública | Sí (prod) | URL canónica, `sitemap`, Open Graph, JSON-LD |
| `NEXT_PUBLIC_SITE_ENV` | pública | Sí | `production` \| `preview` \| `development` → controla `noindex` en previews |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | pública | Sí | Solo dígitos con indicativo (`57…`). **Falta confirmar cuál de los dos móviles es WhatsApp (D-01)** |
| `NEXT_PUBLIC_CONTACT_ENDPOINT` | pública | No | URL del servicio que recibe el formulario. Si falta, se oculta «Enviar mensaje» |
| `NEXT_PUBLIC_LEGACY_SITE_URL` | pública | Sí | `https://www.shaddaicolombia.com` — base para enlaces a la tienda actual |
| `NEXT_PUBLIC_MAPS_EMBED_URL` | pública | No | URL de `iframe` de mapa; si falta, solo enlace «Cómo llegar» |
| *(fase futura)* `CATALOG_SOURCE` | build | No | `static` \| `strapi` |
| *(fase futura)* `STRAPI_URL`, `STRAPI_API_TOKEN` | **solo build/servidor** | No | El token **nunca** lleva prefijo `NEXT_PUBLIC_` |

**Reglas:**
- Todo `NEXT_PUBLIC_*` termina en el HTML/JS público: **jamás poner secretos allí.** En un sitio estático solo hay secretos «de build» (p. ej. token de Strapi) y no llegan al navegador.
- `.env.example` se versiona con todas las claves y comentarios; `.env.local` está en `.gitignore`.
- `lib/env.ts` falla el *build* con un mensaje claro si falta una obligatoria en producción.
- Las mismas variables se configuran en **ambas** plataformas (11.3).

---

## 9. Estrategia de componentes reutilizables

### 9.1 Capas

| Capa | Carpeta | Contiene | Regla |
|---|---|---|---|
| **Primitivos** | `components/ui` | `Container`, `Section` (prop `tone`), `Heading`, `Text`, `Button`, `LinkButton`, `Card`, `Field`/`Input`/`Select`/`Textarea`/`Checkbox`, `VisuallyHidden` | Sin textos de negocio; estilo solo por tokens; accesibles por defecto |
| **Layout** | `components/layout` | `Header`, `MobileNav`, `Footer`, `SkipLink`, `WhatsAppFab` | Leen `content/site.ts` |
| **Medios** | `components/media` | `Picture` (srcset), `VideoFacade` (carga bajo demanda) | `width`/`height` obligatorios |
| **Movimiento** | `components/motion` | `Reveal` (envoltorio de IO), hook `useInView` | Respeta `prefers-reduced-motion`; contenido visible sin JS |
| **Características** | `features/*` | Secciones compuestas por primitivos | Reciben datos tipados por *props* |

### 9.2 Contratos clave (descripción, no implementación)

- **`Section`**: `tone: 'brand' | 'cream' | 'cream-warm' | 'ink'`, `id`, `aria-labelledby`; define fondo, color de texto y borde superior/inferior con forma.
- **`Button` / `LinkButton`**: variantes `primary` (caramelo), `secondary` (contorno), `whatsapp`; tamaños `md`/`lg`; renderiza `<a>` si recibe `href`. Estado de enfoque visible, `scale(0.96)` al presionar, área táctil ≥ 44 px.
- **`Picture`**: `sources: {src, width, type}[]`, `sizes`, `alt`, `width`, `height`, `priority?` (→ `fetchpriority="high"`, sin `loading="lazy"`).
- **`Reveal`**: `as`, `delay?`, `once` (siempre `true`); aplica clases de estado; no oculta contenido si no hay JS.
- **`WhatsAppFab` / botones de WhatsApp**: siempre construyen el enlace con `buildWhatsAppUrl()`; nunca texto/URL a mano.
- **Tipos de dominio**: `ProductLine`, `Channel` (hoy) y `Product`/`Category` (futuro) viven en `domain/`; los componentes de tarjeta reciben **tipos del dominio**, no estructuras de la fuente de datos (clave para 12).

### 9.3 Reglas de reutilización

1. Si un patrón aparece **dos veces**, se extrae a `components/ui`; con una sola aparición vive en su `feature`.
2. Prohibido duplicar estilos de botón/tarjeta/campo en una sección.
3. Ningún componente de `ui/` conoce a Shaddai (ni textos, ni rutas, ni números).
4. Cada componente interactivo documenta en su cabecera: teclado, roles ARIA y estados.

---

## 10. SEO, accesibilidad y rendimiento

### 10.1 SEO

| Tema | Decisión |
|---|---|
| Idioma | `<html lang="es-CO">`; contenido en español de Colombia |
| Metadatos | Por página con la API de metadatos de Next: `title` (plantilla `%s \| Shaddai Colombia`), `description` real (propuesta en 4.3), `canonical` desde `NEXT_PUBLIC_SITE_URL`, `openGraph`, `twitter` |
| Imagen social | Crear **1200×630** (la actual es 853×1066, vertical y no ideal); incluir marca y producto |
| Datos estructurados | JSON-LD `Organization` + `LocalBusiness` (nombre, `legalName` = Shaddai Insumos S.A.S., dirección, teléfono, `openingHoursSpecification`, `sameAs` con redes). Solo datos del MD |
| `sitemap.xml` / `robots.txt` | Generados estáticamente. En `preview` → `robots: noindex` y `X-Robots-Tag` (11.5) |
| Semántica | Un solo `h1` por página; jerarquía `h2`/`h3` sin saltos; `<header>`, `<main>`, `<footer>`, `<nav aria-label>`, `<section aria-labelledby>` |
| URLs | Con barra final (`trailingSlash: true`), minúsculas, sin acentos: `/contactenos/` |
| Migración | Mapa de redirecciones 301 desde URLs del sitio actual (`/sobre-nosotros/`, `/contactenos/`, etc.) definido antes del corte (11.4) |
| Favicon | Recortado correctamente a partir del logo en SVG/PNG de buena calidad |

### 10.2 Accesibilidad (objetivo: WCAG 2.2 nivel AA)

- **Teclado:** todo operable; orden lógico; `SkipLink` («Saltar al contenido») como primer elemento; foco visible de alto contraste (nunca `outline: none` sin reemplazo).
- **Formulario:** `<label>` visible por campo, `aria-describedby` para ayuda/error, `aria-invalid`, resumen de errores o foco al primer error, región `aria-live="polite"` para estado de envío, `autocomplete` correcto, no depender solo del color.
- **Menú móvil:** botón con `aria-expanded`/`aria-controls`, cierre con `Esc`, devolución del foco.
- **Contraste:** ≥ 4.5:1 texto normal, ≥ 3:1 texto grande y componentes (ver 5.2).
- **Movimiento:** `prefers-reduced-motion`; nada parpadea; sin autoplay de video.
- **Medios:** `alt` descriptivo; video con fachada accesible por teclado y título; mapa con alternativa textual (dirección).
- **Objetivos táctiles** ≥ 44 px. **Zoom** hasta 200 % sin pérdida de contenido; sin bloqueo de orientación.

### 10.3 Rendimiento (metas medibles)

| Métrica | Meta (móvil, 4G lento simulado) |
|---|---|
| LCP | ≤ 2.5 s |
| CLS | ≤ 0.1 |
| INP | ≤ 200 ms |
| Lighthouse (móvil) | Rendimiento ≥ 90 · Accesibilidad ≥ 95 · SEO ≥ 95 · Buenas prácticas ≥ 95 |
| JS de primera carga | **Línea base medida en F1 (página vacía): 132 kB gzip en navegadores modernos** (React + runtime de Next; +38.7 kB de polyfill `noModule` solo para navegadores antiguos, no se descarga en los modernos). **Presupuesto: ≤ 150 kB gzip** → todo el código de la app (menú, formulario, `Reveal`, video) dispone de ~18 kB. Medir al cerrar cada fase; si se rebasa, se revisa antes de seguir |
| Imagen del hero | ≤ ~150 kB (AVIF/WebP), `fetchpriority="high"`, dimensiones explícitas |
| Fuentes | ≤ 2 familias, solo pesos usados, `display: swap`, precarga de la de títulos |

**Medidas:** HTML 100 % prerenderizado; componentes de servidor por defecto; JS solo en menú, formulario, `Reveal`, video facade; video e iframes diferidos tras clic; imágenes con `srcset` y `loading="lazy"` salvo el *hero*; `Cache-Control` inmutable para activos con hash; sin librerías de animación en la v1; sin *scripts* de terceros en la v1.

---

## 11. Estrategia de despliegue (Vercel y Cloudflare Pages)

### 11.1 Principio

**Un solo artefacto, dos destinos.** `next build` con `output: 'export'` genera la carpeta `out/` (HTML/CSS/JS/estáticos). Ambas plataformas solo **sirven archivos estáticos**; no hay lógica específica de ninguna.

### 11.2 `next.config.ts` (intención)

`output: 'export'` · `trailingSlash: true` · `images: { unoptimized: true }` (salvaguarda; no se usa `next/image`) · sin `redirects()`/`headers()`. El scaffold activa `cacheComponents` y `partialPrefetching`: **se desactivaron** (dependen de runtime de servidor y no aplican a un sitio estático). La documentación vigente de la versión instalada está en `node_modules/next/dist/docs/` y confirma la lista de funciones no soportadas con exportación estática.

### 11.3 Configuración por plataforma

| | **Vercel** | **Cloudflare Pages** |
|---|---|---|
| Framework preset | Next.js (detecta la exportación estática) | Next.js (Static HTML Export) |
| Build command | `npm run build` | `npm run build` |
| Output directory | `out` (Vercel lo detecta; si no, fijarlo) | `out` |
| Node | Desde `engines`/ajuste de proyecto | Variable `NODE_VERSION` (o `.nvmrc`) alineada con la local |
| Variables | Las de 8.4, por entorno (Production/Preview) | Las mismas, por entorno (Production/Preview) |
| Redirecciones | `vercel.json` | `public/_redirects` |
| Cabeceras | `vercel.json` | `public/_headers` |
| Previews | Por rama/PR | Por rama/PR (`*.pages.dev`) |

> **Qué NO usar:** no depender de `@vercel/analytics`, *Edge Middleware*, `next/image` de Vercel, ni de `@cloudflare/next-on-pages` (la ruta de adaptador es la que se evita a propósito).

### 11.4 Redirecciones y cabeceras (definir por duplicado, mantener sincronizadas)

- **Redirecciones:** mapa antiguo → nuevo (p. ej. `/sobre-nosotros/` → `/#nosotros`). Se redacta una sola vez en una tabla en `README.md` y se transcribe a `vercel.json` y `public/_redirects`. Un test de F6 verifica ambas listas contra la tabla.
- **Cabeceras de seguridad** (equivalentes en ambos archivos): `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `X-Frame-Options: DENY` (o CSP `frame-ancestors`), `Permissions-Policy` mínima, y `Cache-Control: public, max-age=31536000, immutable` para `/_next/static/*`. Una **CSP** estricta se valora en F6 teniendo en cuenta el iframe de YouTube (`youtube-nocookie.com`) y el mapa.

### 11.5 Entornos

| Entorno | Rama | `NEXT_PUBLIC_SITE_ENV` | Indexación |
|---|---|---|---|
| Producción | `main` | `production` | Permitida |
| Preview | ramas/PR | `preview` | `noindex` (meta robots + `X-Robots-Tag` en `*.pages.dev`/`*.vercel.app`) |
| Local | — | `development` | — |

### 11.6 Estrategia de «reemplazo progresivo»

El sitio actual aloja la tienda (WooCommerce) en el dominio principal; mover solo la portada sin romperla requiere decidir cómo conviven. **Recomendación:** durante la Fase 1 publicar la nueva web en un **subdominio** (p. ej. `nuevo.` — por confirmar y sujeto a acceso al DNS, D-04), con los CTA de catálogo apuntando al sitio actual. El corte de dominio se hace cuando la fase de catálogo (15) esté lista, o antes con proxy/reglas por ruta si el cliente lo decide. Lista de verificación del corte en F6-09.

---

## 12. Preparación para la futura integración con Strapi

**Objetivo:** en la fase de CMS cambiar **solo la capa de datos** (`lib/catalog` + un *mapper*), sin tocar componentes de UI ni rutas existentes. **No se implementa nada de esto en la Fase 1** salvo lo marcado «preparar ahora» (cuesta poco y evita rehacer).

### 12.1 Qué se prepara ahora (Fase 1) y qué queda para después

| Preparar **ahora** (F1–F3) | Dejar **para después** (Fase 15) |
|---|---|
| Tipos de dominio en `src/domain/catalog.ts` (`Channel`, `ProductLine`, `Category`, `Product`, `Media`, `Price`) | Cliente HTTP de Strapi, tokens, paginación |
| `lib/catalog/index.ts` con funciones `getChannels()`, `getProductLines()` que **hoy leen `content/`** y devuelven tipos de dominio | `lib/catalog/strapi/*` y *mapper* Strapi → dominio |
| Tarjetas (`ProductLineCard`, `ChannelCard`) que reciben **tipos de dominio** | Páginas `/productos/…`, buscador, filtros |
| `Picture` basado en variantes `{src, width}` (compatible con los `formats` de Strapi) | Dominios de imágenes remotas, política de caché |
| `buildWhatsAppUrl(message, context?)` ya admite contexto de producto | Lista/cesta de cotización con varios productos |
| Variables `CATALOG_SOURCE`, `STRAPI_*` reservadas y documentadas | Configuración real |
| Rutas reservadas en este plan (12.4) | Implementación |

### 12.2 Capa de datos: un límite de módulo, no una arquitectura

```
UI (features/components)
        │  usa solo tipos de domain/
        ▼
lib/catalog/index.ts      ← API estable: getChannels(), getProductLines(), getCategories(), getProducts(), getProductBySlug()
        │  elige la fuente por CATALOG_SOURCE
        ├─► content/*.ts            (Fase 1: datos estáticos tipados)
        └─► lib/catalog/strapi/*    (Fase futura: fetch + mapper → dominio)
```

- **Funciones asíncronas desde el principio** (devuelven `Promise<…>` aunque hoy lean un objeto): al llegar Strapi, las páginas (componentes de servidor) ya hacen `await`.
- Sin interfaces/clases abstractas: un módulo con funciones y un *switch* por variable es suficiente.
- **El *mapper* es el único que conoce la forma de Strapi** (v5 devuelve documentos con `documentId`). Los componentes no deben leer `attributes` ni `data` de Strapi.

### 12.3 Modelo de dominio (forma, sin código)

| Tipo | Campos principales |
|---|---|
| `Channel` | `slug` (`horeca`…), `name`, `shortDescription`, `description?`, `image?`, `href` |
| `Category` | `slug`, `name`, `description?`, `channel?`, `image?`, `order` |
| `Product` | `slug`, `name`, `category`, `channels[]`, `shortDescription`, `description?`, `images: Media[]`, `presentation?`, `sku?`, `price?`, `featured`, `seo?` |
| `Media` | `alt`, `width`, `height`, `variants: {src, width, mime}[]`, `blurDataUrl?` |
| `Price` | `amount: number`, `currency: 'COP'`, `unit?`, `visible: boolean` *(el precio puede ocultarse y mostrarse «Cotizar»)* |

> Mapa Strapi (futuro): *Collection Types* `product`, `category`, `channel`; *Single Type* `site-settings` (contacto, horarios, redes → hoy `content/site.ts`); componente reutilizable `seo`. Campos de imagen con los `formats` generados por Strapi alimentan `Media.variants`.

### 12.4 Rutas reservadas (no crear aún)

`/productos/` · `/productos/[categoria]/` · `/productos/[categoria]/[slug]/`. Las URLs del sitio actual (`/categoria/horeca/`…) se mapearán con redirecciones al corte.

### 12.5 Estrategia de renderizado con Strapi

- **Datos en tiempo de *build*** (`generateStaticParams`) y **reconstrucción por *webhook***: Strapi → *Deploy Hook* de Vercel / de Cloudflare Pages. Mantiene el sitio 100 % estático y portable.
- Búsqueda/filtros: índice JSON generado en el *build* y filtrado en cliente (sin servidor).
- Si el cliente exigiera cambios «en vivo» sin rebuild o vista previa de borradores → reevaluar (7.5): ISR/SSR en Vercel o OpenNext en Cloudflare.
- Seguridad: `STRAPI_API_TOKEN` de solo lectura, con alcance mínimo, solo en variables de *build*.

### 12.6 Cotización por WhatsApp en el catálogo

Ya soportado por diseño: `buildWhatsAppUrl(template, { product })` incluye nombre/SKU/presentación; el flujo de la Fase 1 (*nombre + ciudad*) se mantiene. La cesta de varios ítems es parte de la fase futura.

---

## 13. Roadmap de implementación

Convenciones: **ID** = `F<fase>-<n>`. Una tarea = un commit (o un PR pequeño). **No avanzar de fase sin cumplir sus criterios de aceptación (sección 14).** Cada tarea indica su **skill** cuando aplica.

### Fase 1 — Configuración y estructura base

| ID | Tarea | Notas |
|---|---|---|
| F1-01 | **Inicializar repositorio git propio en `Shaddai/`** (`git init`), `.gitignore`, rama `main` | ⚠️ **Hoy la carpeta cuelga del repositorio git de `C:\Users\alvelez`** (sin commits). Sin un `git init` propio, los commits irían a ese repo. Es la **primera tarea** |
| F1-02 | Generar el proyecto con `create-next-app` (TypeScript, Tailwind, ESLint, App Router, `src/`, alias `@/*`, Turbopack, npm). Verificar flags con `--help` | Si hay conflicto con `docs/`, generar en una carpeta temporal y mover |
| F1-03 | `next.config.ts` (export estático, `trailingSlash`), `tsconfig` estricto, scripts (`typecheck`), `.nvmrc`/`engines` | 7.2, 7.4, 11.2 |
| F1-04 | Estructura de carpetas vacía según 8.2 (con `index`/archivos mínimos solo donde haga falta) | |
| F1-05 | `AGENTS.md` (puntero a este plan + 10 reglas clave de la sección 16) y `README.md` | |
| F1-06 | `lib/env.ts` + `.env.example` con todas las variables de 8.4 | Falla el build si falta una obligatoria en producción |
| F1-07 | Copiar el MD fuente a `docs/referencia/`; reunir activos de marca provisionales en `public/images/` y **registrar su procedencia** | La descarga de imágenes desde el sitio actual requiere aprobación del usuario; pedir originales (D-05) |
| F1-08 | Página mínima («en construcción», sin marca inventada) y **despliegue de humo en Vercel y Cloudflare Pages** | Detecta temprano problemas de pipeline, Node y variables |
| F1-09 | Registrar en el README las versiones reales instaladas y el tamaño base de JS (referencia del presupuesto 10.3) | |

### Fase 2 — Identidad visual y componentes globales

| ID | Tarea | Skill |
|---|---|---|
| F2-01 | Crear `PRODUCT.md` (audiencia, tono, anti-referencias, restricciones) a partir de las secciones 1, 4 y 5 | `impeccable init` |
| F2-02 | **Confirmar la dirección visual** con el usuario (brief); fijar paleta definitiva contra el logo real y la pareja tipográfica; **actualizar 5.2 y 5.3 de este documento** | `impeccable shape`, `typeset`, `colorize` |
| F2-03 | Tokens en `globals.css` (`@theme`): color + alias semánticos, tipografía, espaciado, radios concéntricos, sombras en capas, movimiento | `make-interfaces-feel-better`, `transitions-dev` |
| F2-04 | `layout.tsx`: `lang`, `next/font`, base (`antialiased`, foco visible, `prefers-reduced-motion`), `SkipLink` | |
| F2-05 | Primitivos `ui/`: `Container`, `Section`, `Heading`, `Text`, `Button`/`LinkButton`, `Card`, `VisuallyHidden` | `no-ai-design-slop` |
| F2-06 | Set de íconos SVG (WhatsApp, Instagram, Facebook, teléfono, correo, pin, reloj, flecha, menú, cerrar) | |
| F2-07 | `content/site.ts` (datos duros de 4.1) y `lib/whatsapp.ts` (`buildWhatsAppUrl`) | Datos del MD; WhatsApp según D-01 |
| F2-08 | `Header` (desktop + `MobileNav`), `Footer`, `WhatsAppFab` | `transitions-dev` (menú) |
| F2-09 | `Picture` y `VideoFacade` (sin instalar nada) | |
| F2-10 | `Reveal` + `useInView` (solo estructura; el efecto se afina en F5) | |
| F2-11 | Tipos de dominio (`domain/catalog.ts`) + `lib/catalog/index.ts` (funciones `async` que leen `content/`) | Preparación para Strapi (12.1) |

### Fase 3 — Landing Page

| ID | Tarea | Contenido |
|---|---|---|
| F3-01 | `content/home.ts`, `product-lines.ts`, `channels.ts` (tipados, con marcadores `TODO(contenido)` donde falte texto) | 4.2 |
| F3-02 | **Hero** | H1 + subtítulo + 2 CTA + imagen de producto |
| F3-03 | **Líneas destacadas** (Lattes, Café, Capuccinos) | composición asimétrica; incluye «Café fresco» |
| F3-04 | **Canales** (HORECA destacado + VENDING, MAQUILA, RETAIL) con enlaces a categorías actuales | 4.4 |
| F3-05 | **La mejor taza servida** (3 pilares + BPM + cita) | sin tarjetas con ícono en recuadro |
| F3-06 | **Nuestra historia** (texto + frase poética + `VideoFacade`) | requiere D-07 |
| F3-07 | **Cierre: cotizar** (mini-flujo nombre + ciudad → WhatsApp) | |
| F3-08 | Composición en `app/page.tsx`, anclas y tonos de sección | |
| F3-09 | Metadatos de la home + JSON-LD (`Organization`/`LocalBusiness`) + `sitemap`/`robots` | 10.1 |
| F3-10 | Pasada de calidad: `no-ai-design-slop` (prueba de eliminación) + `clarify` (microcopy) | |

### Fase 4 — Contáctenos y formulario

| ID | Tarea |
|---|---|
| F4-01 | Ruta `/contactenos/`, metadatos y encabezado compacto |
| F4-02 | `QuickActions` (WhatsApp *Asesoría* y *Cotizar*, llamar, correo) con los mensajes de `content/whatsapp-messages.ts` |
| F4-03 | `ContactInfo`: dirección, tabla de horarios, redes |
| F4-04 | Campos `ui/` (`Field`, `Input`, `Select`, `Textarea`, `Checkbox`) accesibles |
| F4-05 | `validation.ts` (funciones puras) + estados del formulario |
| F4-06 | `lib/integrations/contact-form.ts` (adaptador `POST` al endpoint) + camino «Enviar por WhatsApp» + honeypot |
| F4-07 | Estados de éxito/error (`transitions-dev`: *Success check*, *Error shake*) con `aria-live` |
| F4-08 | `MapCard` (enlace «Cómo llegar» + `iframe` opcional bajo demanda) |
| F4-09 | Autorización de datos: texto y enlace (según D-03) |
| F4-10 | Página `not-found.tsx` coherente con la marca |

### Fase 5 — Animaciones, responsive y optimizaciones

| ID | Tarea | Skill |
|---|---|---|
| F5-01 | Revelado de secciones (`Reveal`) y entrada del H1 del hero según el inventario 5.5 | `staggered-word-reveal`, `transitions-dev` |
| F5-02 | Transiciones entre secciones (tono + borde con forma) y estado del header al scroll | `impeccable animate/layout` |
| F5-03 | Microinteracciones de botones/enlaces y menú móvil | `make-interfaces-feel-better`, `transitions-polish` |
| F5-04 | *View Transition* entre rutas como mejora progresiva (con *fallback* sin efecto) | |
| F5-05 | Pasada responsive en 360/390/768/1024/1280/1536 px (y rotación) | `impeccable adapt` |
| F5-06 | Optimización de imágenes (AVIF/WebP, anchos, `sizes`), fuentes y JS; medir contra 10.3 | `impeccable optimize` |
| F5-07 | **Puerta GSAP**: evaluar solo si algún momento aprobado no cabe en CSS (7.3); decisión registrada | `gsap-*` (condicional) |
| F5-08 | Revisión de acabado: `critique` + `audit` + `polish` + `no-ai-design-slop` + `make-interfaces-feel-better` | `impeccable` |
| F5-09 | Generar `DESIGN.md` del mundo construido | `impeccable document` |

### Fase 6 — Pruebas y preparación para despliegue

| ID | Tarea |
|---|---|
| F6-01 | Pruebas unitarias (`vitest`): `buildWhatsAppUrl`, validadores, `env` |
| F6-02 | E2E (`@playwright/test`): navegación, ancla de secciones, formulario (éxito/error/validación), enlaces `tel:`/`mailto:`/`wa.me` |
| F6-03 | Accesibilidad automática (`@axe-core/playwright`) en ambas páginas + revisión manual con teclado y lector de pantalla |
| F6-04 | Capturas responsive y revisión visual contra el brief |
| F6-05 | Lighthouse móvil y verificación de presupuestos (10.3) |
| F6-06 | Comprobación de enlaces rotos, `sitemap`, `robots`, metadatos, JSON-LD, Open Graph |
| F6-07 | `vercel.json` y `public/_redirects`/`_headers` sincronizados (11.4); `noindex` en previews |
| F6-08 | Despliegue de producción de prueba en **ambas** plataformas, mismas variables, mismo resultado |
| F6-09 | Lista de corte: DNS, redirecciones 301, Search Console, plan de reversión, verificación posterior |
| F6-10 | Actualizar `README.md` (despliegue, variables, mantenimiento de contenido) |

---

## 14. Criterios de aceptación

### 14.1 Definición de «hecho» global (aplica a cada tarea)

- `npm run lint` y `npm run typecheck` sin errores; `npm run build` genera `out/`.
- Sin dependencias nuevas fuera de la lista 7.3.
- Sin contenido inventado; los vacíos están marcados y listados.
- Verificado **renderizado** en 360 px y 1280 px como mínimo (no solo leyendo código).
- Foco por teclado visible y orden lógico en lo que se tocó.
- Sin `transition: all`; con `prefers-reduced-motion` respetado en lo animado.

### 14.2 Por fase

**Fase 1 — Base**
- [ ] Repositorio git propio (`git rev-parse --show-toplevel` devuelve la carpeta `Shaddai`).
- [ ] `npm run dev` y `npm run build` funcionan; `out/` se genera.
- [ ] Estructura de carpetas = 8.2; alias `@/*` operativo.
- [ ] `.env.example` completo; el build falla con mensaje claro si falta una variable obligatoria en producción.
- [ ] Página mínima desplegada y visible en Vercel **y** Cloudflare Pages con las mismas variables.
- [ ] Solo `next`, `react`, `react-dom` en dependencias de producción.

**Fase 2 — Identidad y componentes globales**
- [ ] `PRODUCT.md` creado; dirección visual **confirmada por el usuario**; 5.2/5.3 actualizados a valores definitivos.
- [ ] Todos los pares de color de texto cumplen AA (comprobados); `--color-caramel` no se usa como texto sobre claro.
- [ ] Header (desktop/móvil), Footer y botón de WhatsApp funcionales y accesibles; menú móvil operable con teclado y `Esc`.
- [ ] Los enlaces de WhatsApp salen **solo** de `buildWhatsAppUrl`; datos de contacto **solo** de `content/site.ts`.
- [ ] Primitivos sin textos de negocio; sin estilos duplicados.

**Fase 3 — Landing**
- [ ] Las 6 secciones de 2, en el orden indicado, con un `h1` y jerarquía correcta.
- [ ] **Trazabilidad:** cada texto proviene del MD (4.2) o está marcado `TODO(contenido)`; ninguna cifra/claim inventado.
- [ ] Las 4 tarjetas de canal enlazan a la categoría actual; CTA de catálogo operativos.
- [ ] El mini-flujo de cotización abre WhatsApp con nombre y ciudad.
- [ ] Sin tarjetas idénticas con ícono en recuadro; la revisión `no-ai-design-slop` no deja hallazgos de alto impacto.
- [ ] Metadatos propios, JSON-LD válido, `sitemap.xml` y `robots.txt` presentes.

**Fase 4 — Contáctenos**
- [ ] Formulario completo por teclado; errores claros por campo; estados inicial/enviando/éxito/error.
- [ ] «Enviar por WhatsApp» funciona sin backend; «Enviar mensaje» solo aparece si hay endpoint y no pierde datos si falla.
- [ ] Teléfonos con `tel:`, correo con `mailto:`, horarios y dirección idénticos al MD.
- [ ] Mapa: enlace «Cómo llegar» funcional; `iframe` (si existe) no se carga hasta que el usuario lo pide.
- [ ] Autorización de datos presente y enlazada (según D-03) — **no se publica sin ella**.
- [ ] Sin datos personales en la URL.

**Fase 5 — Animaciones, responsive, optimizaciones**
- [ ] Solo existen los efectos del inventario 5.5; con `prefers-reduced-motion` y sin JS el contenido es completo y estático.
- [ ] Sin scroll horizontal ni solapamientos en 360/390/768/1024/1280/1536 px.
- [ ] Metas de 10.3 cumplidas (LCP, CLS, INP, Lighthouse) y registradas.
- [ ] Decisión sobre GSAP documentada (instalado con justificación **o** descartado).
- [ ] `DESIGN.md` generado.

**Fase 6 — Pruebas y despliegue**
- [ ] Unitarias y E2E en verde; axe sin violaciones serias/críticas.
- [ ] Mismo `out/` produce el mismo resultado en Vercel y Cloudflare Pages; cabeceras y redirecciones equivalentes verificadas.
- [ ] Previews con `noindex`; producción indexable.
- [ ] Lista de corte completada o aplazada con fecha y responsable; plan de reversión escrito.

---

## 15. Fase futura independiente: Strapi + catálogo

**No forma parte de la Fase 1.** Se ejecuta como proyecto aparte, con su propio plan derivado de la sección 12. Esquema de alto nivel:

| Etapa | Contenido |
|---|---|
| S-1 | Modelado en Strapi (`product`, `category`, `channel`, `site-settings`, componente `seo`), roles y token de solo lectura |
| S-2 | `lib/catalog/strapi/*` + *mapper* a dominio; `CATALOG_SOURCE=strapi`; `generateStaticParams` |
| S-3 | Rutas `/productos/…`, tarjetas y ficha de producto con `Picture` desde `formats` |
| S-4 | Filtros/búsqueda con índice JSON en el build |
| S-5 | Cotización por WhatsApp con contexto de producto y cesta de varios ítems |
| S-6 | *Webhook* Strapi → Deploy Hooks (Vercel/Cloudflare); redirecciones desde `/categoria/*`; corte de dominio |
| S-7 | Valorar blog «Novedades» (reactivar con contenido o descartar) |

**Criterio de éxito de la preparación:** completar S-1…S-4 **sin modificar** los componentes `ui/` ni `features/home` más allá de cambiar las fuentes de datos.

---

## 16. Reglas de trabajo para agentes

1. **Leer este documento completo** antes de la primera tarea; **no desviarse** de él sin actualizarlo primero.
2. **No inventar información comercial** (cifras, clientes, precios, certificaciones, plazos, cobertura). Faltantes → `TODO(contenido)` + D-xx.
3. **No instalar dependencias** que no estén en 7.3. Si crees que hace falta una, justifícala por escrito en el PR y actualiza la tabla.
4. **Contenido en `content/`, no en componentes.** Datos de contacto solo en `content/site.ts`; WhatsApp solo vía `lib/whatsapp.ts`; env solo vía `lib/env.ts`.
5. **Componentes de servidor por defecto**; `"use client"` solo con estado/efectos.
6. **Un solo sistema de estilos** (Tailwind + tokens). Sin colores/tamaños sueltos; sin `transition: all`.
7. **Animación solo del inventario 5.5**; todo con `prefers-reduced-motion` y contenido visible sin JS.
8. **Accesibilidad no es una fase:** foco visible, etiquetas, contraste y áreas táctiles desde la primera línea.
9. **Verificar renderizado real** (móvil y desktop) antes de dar por terminada una tarea visual.
10. **Tareas pequeñas, un commit por tarea**, en la carpeta `Shaddai/` (ver F1-01). No tocar nada fuera de ella.
11. **No implementar nada de Strapi/catálogo/carrito/blog** salvo los puntos de preparación de 12.1.
12. Ante duda de diseño, aplicar `no-ai-design-slop` (prueba de eliminación) y, si persiste, preguntar al usuario.

---

## 17. Decisiones abiertas y datos faltantes

**Bloqueantes** = impiden cerrar la fase indicada. Recomendación = valor por defecto si el cliente no responde.

| ID | Pregunta / dato faltante | Necesario antes de | Recomendación |
|---|---|---|---|
| **D-01** | ¿Cuál de los dos móviles (+57 304 202 9533 / +57 314 691 5481) es el de **WhatsApp**? | F2-07 (bloquea) | Confirmar con el cliente; no asumir |
| **D-02** | Proveedor/destino del **formulario** (¿a qué correo llega? ¿servicio externo tipo formulario→correo, Worker propio de Cloudflare, otro?) y si el correo es obligatorio | F4-06 (bloquea «Enviar mensaje») | Servicio externo con `POST` simple + camino WhatsApp siempre activo |
| **D-03** | **Política de tratamiento de datos / autorización** (Ley 1581 de 2012): texto y URL. Validar con quien corresponda legalmente | F4-09 (bloquea publicación del formulario) | Pedir al cliente su política vigente |
| **D-04** | Dominio/subdominio para publicar la nueva web y acceso al DNS | F1-08 / F6-09 | Subdominio durante Fase 1 |
| **D-05** | **Activos originales** en alta calidad: logo (SVG/PNG), fotos de producto, galería, íconos | F2-02 / F3 | Solicitar al cliente; usar los del sitio actual solo como provisionales (con aprobación para descargarlos) |
| **D-06** | Cómo presentar los **dos nombres** (*Shaddai Colombia* marca / *Shaddai Insumos S.A.S.* razón social) | F2-08 | Marca en header/hero; razón social en footer, JSON-LD y mensajes de WhatsApp |
| **D-07** | **Texto literal** de la frase poética del grano (el MD solo la describe) | F3-06 (bloquea) | Copiarlo de la página actual con aprobación del cliente |
| **D-08** | **Texto literal** de los dos mensajes de bienvenida de WhatsApp | F4-02 | Copiar del botón actual o redactar y validar |
| **D-09** | Registro de tratamiento: **usted** vs tú | F3 | **Usted** |
| **D-10** | Grafía de «Capuccinos» (capuchinos / cappuccinos) | F3-03 | *Capuchinos* (español) — validar |
| **D-11** | URL exacta de «la tienda» (home del catálogo) para el CTA «Conoce Nuestro Catálogo» | F3-02 | Confirmar; hasta entonces apuntar a las categorías conocidas |
| **D-12** | Gestor de paquetes | F1-02 | npm (como `my-app`) |
| **D-13** | Textos para **VENDING, MAQUILA y RETAIL** más allá de su definición de una línea | F3-04 | Usar solo la definición del MD hasta recibirlos |
| **D-14** | ¿Se conserva el **botón flotante de WhatsApp** del sitio actual en todas las páginas? ¿Con cuál mensaje (asesoría o cotizar)? | F2-08 | Conservarlo, con mensaje de asesoría; oculto en Contáctenos si estorba al formulario |
| **D-15** | **Enlaces de Facebook/Instagram** definitivos (el de Facebook es largo y poco amigable, MD §12) | F2-08 | Pedir una URL corta oficial |
| **D-16** | ¿Antes de publicar se desea **antispam reforzado** (p. ej. Cloudflare Turnstile) además del *honeypot*? | F4-06 | *Honeypot* en v1; Turnstile solo si hay spam real |
| **D-17** | Dirección de mapa embebible (`iframe`) si se quiere mapa interactivo | F4-08 | Solo enlace «Cómo llegar» si no se provee |

---

### Anexo A — Resumen de decisiones de arquitectura (para consulta rápida)

| Tema | Decisión |
|---|---|
| Framework | Next.js (App Router) + React + TypeScript estricto |
| Salida | Exportación estática (`output: 'export'`, `trailingSlash`) |
| Estilos | Tailwind CSS v4, tokens en `@theme`, sin CSS-in-JS |
| Componentes | Propios, sin Radix/shadcn; íconos SVG propios |
| Imágenes | `<Picture>` con `srcset` sobre AVIF/WebP; sin `next/image` |
| Movimiento | CSS + `IntersectionObserver`; GSAP solo por puerta (7.3) |
| Formulario | Endpoint externo configurable + «Enviar por WhatsApp»; sin servidor propio |
| Contenido | `src/content/` tipado; dominio en `src/domain/` |
| Datos futuros | `lib/catalog` (funciones async) → `content/` hoy, Strapi mañana |
| Despliegue | Mismo `out/` en Vercel y Cloudflare Pages; redirecciones/cabeceras por plataforma |
| Pruebas | Vitest (unitarias) + Playwright/axe (E2E y accesibilidad) en F6 |
