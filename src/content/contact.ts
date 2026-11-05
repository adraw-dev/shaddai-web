/**
 * Textos de Contáctenos (F4). BORRADOR para aprobación del cliente. Registro «usted» (propuesta D-09).
 * Datos de contacto, horarios y redes NO van aquí: viven en content/site.ts (fuente única).
 */

export const contactContent = {
  meta: {
    title: "Contáctenos",
    description:
      "Contacte a Shaddai Colombia en Medellín: WhatsApp, teléfono, correo, dirección y horario de atención. Para cotizar necesitamos su nombre y el lugar de envío.",
  },

  hero: {
    title: "Contáctenos",
    // MD §10: para cotizar se necesita nombre + lugar de envío; también hay asesoría con los pedidos.
    lead: "Escríbanos por WhatsApp o déjenos sus datos. Para cotizar solo necesitamos su nombre y el lugar de envío.",
    quoteCta: "Cotizar por WhatsApp",
    advisoryCta: "Pedir asesoría",
  },

  form: {
    title: "Envíenos su solicitud",
    businessTypePlaceholder: "Seleccione una opción",
    // Canales del MD §1 + «Otro».
    businessTypes: [
      { value: "HORECA", label: "HORECA — hoteles, restaurantes y cafeterías" },
      { value: "VENDING", label: "VENDING — máquinas expendedoras" },
      { value: "MAQUILA", label: "MAQUILA — producción para terceros" },
      { value: "RETAIL", label: "RETAIL — venta minorista" },
      { value: "Otro", label: "Otro" },
    ],
    labels: {
      name: "Nombre",
      city: "Ciudad de envío",
      phone: "Teléfono o WhatsApp",
      email: "Correo electrónico",
      businessType: "Tipo de negocio",
      message: "Mensaje",
    },
    hints: {
      phone: "Con indicativo si es de otro país. Ejemplo: 300 123 4567",
      email: "Opcional.",
      message: "Opcional. Cuéntenos qué productos le interesan.",
    },
    submitMessage: "Enviar mensaje",
    submitWhatsApp: "Enviar por WhatsApp",
    sending: "Enviando…",
    /**
     * TODO(D-03, legal): texto de autorización y política de tratamiento de datos (Ley 1581 de 2012).
     * Este texto es una PROPUESTA mínima que debe validar quien corresponda legalmente; el enlace sale
     * de NEXT_PUBLIC_PRIVACY_POLICY_URL (obligatoria en producción si el formulario envía datos).
     */
    consentBefore: "Autorizo a Shaddai Insumos S.A.S. a tratar mis datos personales para atender esta solicitud, según su ",
    consentLink: "política de tratamiento de datos",
    consentAfter: ".",
    success: {
      title: "Recibimos su mensaje",
      text: "Gracias por escribirnos. Le responderemos en nuestro horario de atención.",
      again: "Enviar otro mensaje",
      orWhatsApp: "¿Prefiere una respuesta más rápida? Escríbanos por WhatsApp.",
    },
    error: {
      title: "No pudimos enviar su mensaje",
      text: "Revise su conexión e intente de nuevo. Sus datos siguen en el formulario. También puede escribirnos por WhatsApp.",
    },
  },

  info: {
    title: "Datos de contacto",
    phoneTitle: "Llámenos",
    emailTitle: "Escríbanos",
    visitTitle: "Visítenos",
    hoursTitle: "Horario de atención",
    socialTitle: "Redes sociales",
  },

  location: {
    title: "Cómo llegar",
    route: "Cómo llegar en Google Maps",
    loadMap: "Cargar mapa interactivo",
    mapTitle: "Mapa de ubicación de Shaddai Colombia",
  },
} as const;
