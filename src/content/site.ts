import { media } from "@/content/media";

/**
 * Datos de negocio de Shaddai — ÚNICA fuente (plan §16, regla 3).
 * Todos los valores provienen de docs/referencia/Sobre_nosotros_Shaddai_Colombia.md (§8, §9, §11).
 * No agregar datos que el cliente no haya confirmado.
 */

export const siteConfig = {
  /** Marca de la web (registrada ShaddaiColombia®). */
  brandName: "Shaddai Colombia",
  /** Razón social; la usan Facebook, Instagram y el chat de WhatsApp. Presentación por confirmar (D-06). */
  legalName: "Shaddai Insumos S.A.S.",
  tagline: "Insumos de Calidad",
  copyrightStartYear: 2021,

  nav: [
    { label: "Productos", href: "/#productos" },
    { label: "Canales", href: "/#canales" },
    { label: "Nosotros", href: "/#nosotros" },
    { label: "Contáctenos", href: "/contactenos/" },
  ],

  contact: {
    phones: [
      { display: "+57 304 202 9533", tel: "+573042029533" },
      { display: "+57 314 691 5481", tel: "+573146915481" },
    ],
    email: "ventasonline@shaddaicolombia.com",
    address: {
      street: "Carrera 81 # 36-79",
      reference: "diagonal al VIVA Laureles",
      city: "Medellín",
      country: "Colombia",
    },
    mapsUrl: "https://maps.app.goo.gl/ojAfC4e3jedpU7KPA",
  },

  hours: [
    { days: "Lunes a viernes", time: "8:00 a. m. – 4:00 p. m." },
    { days: "Sábado", time: "8:00 a. m. – 11:00 a. m." },
    { days: "Domingos y festivos", time: "Cerrado" },
  ],

  /** Mismo horario en forma estructurada (para JSON-LD). Mantener sincronizado con `hours`. */
  hoursSpec: [
    {
      days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "08:00",
      closes: "16:00",
    },
    { days: ["Saturday"], opens: "08:00", closes: "11:00" },
  ],

  /** TODO(D-15): el enlace de Facebook es largo; pedir la URL corta oficial. */
  social: {
    facebook:
      "https://es-la.facebook.com/pages/category/Food---Beverage/Shaddai-Insumos-104529957585714/",
    instagram: "https://www.instagram.com/shaddai.insumos/",
  },

  logo: media("logo", "Shaddai Insumos"),
} as const;

export type SiteConfig = typeof siteConfig;
