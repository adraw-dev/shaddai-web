import { siteConfig } from "@/content/site";
import { absoluteUrl, env } from "@/lib/env";

/**
 * SEO técnico (plan §10.1). Solo datos del MD, vía `siteConfig`.
 * La indexación depende del entorno: únicamente `production` se indexa; previews y local, no.
 */
export const siteTitle = `${siteConfig.brandName} | Insumos para café en Medellín`;

/** Propuesta de meta descripción (el MD marca la actual como vacía). Sujeta a aprobación del cliente. */
export const siteDescription =
  "Distribuidor de insumos para bebidas de café en Medellín, para cafeterías, restaurantes, máquinas expendedoras y comercios. Cotice por WhatsApp.";

export const isIndexable = env.siteEnv === "production";

/**
 * Base de Open Graph. En Next, un `openGraph` definido en una página REEMPLAZA al del layout
 * (no se fusiona), por eso cada página lo compone desde aquí: `{ ...baseOpenGraph, url: "/ruta/" }`.
 */
export const baseOpenGraph = {
  type: "website",
  locale: "es_CO",
  siteName: siteConfig.brandName,
  title: siteTitle,
  description: siteDescription,
  // TODO(D-19): og:image 1200×630. El flyer actual (853×1066) no se usa.
} as const;

/** Datos estructurados de la organización/negocio local (schema.org). */
export function organizationJsonLd() {
  const { contact, hoursSpec, social, legalName, brandName, logo } = siteConfig;
  // Respaldo (PNG): es el formato que entienden todos los rastreadores.
  const logoUrl = absoluteUrl(logo.variants[logo.variants.length - 1].src);

  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": absoluteUrl("/#organizacion"),
    name: brandName,
    legalName,
    url: absoluteUrl("/"),
    logo: logoUrl,
    image: logoUrl,
    telephone: contact.phones.map((p) => p.tel),
    email: contact.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: `${contact.address.street}, ${contact.address.reference}`,
      addressLocality: contact.address.city,
      addressCountry: "CO",
    },
    hasMap: contact.mapsUrl,
    openingHoursSpecification: hoursSpec.map((slot) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: slot.days,
      opens: slot.opens,
      closes: slot.closes,
    })),
    sameAs: [social.facebook, social.instagram],
  };
}

/** Serializa JSON-LD de forma segura para incrustarlo en un <script> (evita cerrar la etiqueta). */
export const jsonLdScript = (data: unknown) => JSON.stringify(data).replace(/</g, "\\u003c");
