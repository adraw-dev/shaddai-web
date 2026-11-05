import { media } from "@/content/media";

/**
 * Textos de la Landing (F3-01). BORRADOR para aprobación del cliente.
 *
 * Origen: docs/referencia/Sobre_nosotros_Shaddai_Colombia.md. Está reorganizado y redactado de nuevo
 * (el plan pide no trasladar el texto literalmente) SIN agregar datos: ninguna cifra, certificación,
 * cobertura ni promesa que no esté en el MD. Registro «usted» (propuesta D-09).
 * D-18: no se afirma «fabricamos» ni «solo distribuimos»; se usa «distribuimos», como el MD.
 */

export const homeContent = {
  hero: {
    // MD §1: título del bloque principal.
    title: "Procuramos por el sabor de un buen café",
    // Palabras del título con degradado cálido (Propuesta B; solo estilo, no cambia el texto).
    highlight: ["sabor"] as readonly string[],
    lead: "Insumos de calidad para preparar bebidas de café, desde Medellín para cafeterías, restaurantes, máquinas expendedoras y comercios.",
    quoteCta: "Cotizar por WhatsApp",
    catalogCta: "Conoce nuestro catálogo",
    // Provisional (800 px). Pedir originales (D-05).
    image: media("hero", "Taza oscura llena de granos de café tostado"),
  },

  lines: {
    title: "Nuestras líneas destacadas",
    // MD §1: criterio de selección.
    intro:
      "Seleccionamos productos destacados del mercado colombiano por su marca, su trayectoria, su investigación y desarrollo y, sobre todo, por el aroma, el sabor y la calidad de la taza final.",
    cta: "Conoce nuestro catálogo",
  },

  channels: {
    title: "Atendemos cuatro canales comerciales",
    // MD §1: el cliente es el centro de negocios.
    intro:
      "Nuestro cliente es el centro de negocios: cafeterías, restaurantes, máquinas dispensadoras y comercios.",
    featuredLinkLabel: "Ver productos HORECA",
    linkLabel: "Ver productos",
    inquiryLabel: "Consultar por WhatsApp",
    // Foto de banco (Pexels, Amelia Hallsworth): ilustra el canal, NO es una cafetería cliente de Shaddai.
    featuredImage: media("cafeteria", "Barista preparando café con una máquina espresso en una cafetería luminosa"),
  },

  quality: {
    title: "La mejor taza servida",
    // MD §6.
    intro: "Con nuestros productos, su negocio garantiza la mejor taza a sus clientes.",
    pillars: ["El mejor café", "Leche de calidad", "Mezclas perfectas"],
    bpm: "Todas nuestras líneas pasan por procesos BPM (Buenas Prácticas de Manufactura).",
    passion:
      "Nos apasiona el buen sabor que llega al paladar del cliente final: es la razón por la que nacimos y por la que seguimos siendo el aliado de su negocio a la hora de abastecerse.",
    // MD §4 «Café fresco».
    freshCoffee:
      "No hay una segunda oportunidad para causar una primera impresión. Por eso el café de su negocio debe ser de calidad: un grano limpio y con un sabor en taza claramente por encima del promedio.",
    // Foto de banco (Pexels, Olha Ruskykh). Reemplaza a «calidad» (granos en cuenco, fuera de la paleta cálida).
    image: media("latte-crema", "Barista vertiendo leche sobre un café para dibujar arte latte, sobre fondo crema"),
  },

  story: {
    title: "Nuestra historia",
    // MD §3.
    paragraphs: [
      "Shaddai nació de la comercialización de máquinas especializadas para preparar y vender bebidas de café y snacks.",
      "Trabajar con esas máquinas nos mostró que nuestros clientes necesitaban algo más: insumos que garantizaran calidad y rentabilidad. Así dimos el paso a distribuir los productos que se preparan en ellas.",
    ],
    /**
     * TODO(contenido, D-07): frase poética que compara el crecimiento de la empresa con el del grano
     * de café. El MD solo la describe; el texto literal está en la página actual. Mientras sea
     * `undefined`, la sección no la muestra (no se inventa ni se parafrasea).
     */
    poeticPhrase: undefined as string | undefined,
    // Foto de banco (Pexels, Chevanon Photography) que acompaña al video; es ilustrativa.
    accentImage: media("latte-manos", "Manos vertiendo leche para formar arte latte en una taza blanca"),
    video: {
      id: "NYPI5JoMi4M",
      // El MD no dice qué muestra el video; título genérico hasta confirmarlo.
      title: "Video de Shaddai Colombia",
    },
  },

  quote: {
    title: "Cotice por WhatsApp",
    // MD §10: el dato necesario es nombre + lugar de envío; se responde con tiempos de entrega y costos.
    text: "Escríbanos su nombre y el lugar de envío, y le respondemos con los tiempos de entrega y los costos.",
    nameLabel: "Su nombre",
    cityLabel: "Ciudad de envío",
    submit: "Cotizar por WhatsApp",
    contactPrompt: "¿Prefiere escribirnos desde un formulario?",
    contactLink: "Ir a Contáctenos",
  },
} as const;
