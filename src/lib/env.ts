/**
 * Lectura y validación de variables de entorno (docs/PLAN_DESARROLLO.md §8.4).
 *
 * - Única puerta de entrada a `process.env`: el resto del código importa `env`.
 * - Todas son `NEXT_PUBLIC_*` y terminan en el JS/HTML público: NUNCA poner secretos aquí.
 * - Next solo reemplaza accesos LITERALES (`process.env.NEXT_PUBLIC_X`), por eso
 *   cada variable se lee por su nombre completo y no con claves dinámicas.
 * - Falla el build con un mensaje claro si falta algo obligatorio.
 */

export type SiteEnv = "production" | "preview" | "development";

const SITE_ENVS: readonly SiteEnv[] = ["production", "preview", "development"];

const raw = {
  siteEnv: process.env.NEXT_PUBLIC_SITE_ENV,
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL,
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER,
  contactEndpoint: process.env.NEXT_PUBLIC_CONTACT_ENDPOINT,
  legacySiteUrl: process.env.NEXT_PUBLIC_LEGACY_SITE_URL,
  mapsEmbedUrl: process.env.NEXT_PUBLIC_MAPS_EMBED_URL,
};

const clean = (value: string | undefined) => {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
};

const isHttpUrl = (value: string) => {
  try {
    const { protocol } = new URL(value);
    return protocol === "https:" || protocol === "http:";
  } catch {
    return false;
  }
};

const stripTrailingSlash = (value: string) => value.replace(/\/+$/, "");

function parseEnv() {
  const problems: string[] = [];

  const siteEnvValue = clean(raw.siteEnv);
  let siteEnv: SiteEnv = "development";
  if (!siteEnvValue) {
    problems.push(
      `NEXT_PUBLIC_SITE_ENV es obligatoria (${SITE_ENVS.join(" | ")}).`,
    );
  } else if (!SITE_ENVS.includes(siteEnvValue as SiteEnv)) {
    problems.push(
      `NEXT_PUBLIC_SITE_ENV="${siteEnvValue}" no es válida (${SITE_ENVS.join(" | ")}).`,
    );
  } else {
    siteEnv = siteEnvValue as SiteEnv;
  }

  const isProduction = siteEnv === "production";

  // Obligatorias solo en producción; en otros entornos hay valores por defecto.
  const siteUrlValue = clean(raw.siteUrl);
  if (isProduction && !siteUrlValue) {
    problems.push("NEXT_PUBLIC_SITE_URL es obligatoria en producción.");
  }
  if (siteUrlValue && !isHttpUrl(siteUrlValue)) {
    problems.push("NEXT_PUBLIC_SITE_URL debe ser una URL http(s) válida.");
  }

  const legacyValue = clean(raw.legacySiteUrl);
  if (isProduction && !legacyValue) {
    problems.push("NEXT_PUBLIC_LEGACY_SITE_URL es obligatoria en producción.");
  }
  if (legacyValue && !isHttpUrl(legacyValue)) {
    problems.push("NEXT_PUBLIC_LEGACY_SITE_URL debe ser una URL http(s) válida.");
  }

  // Solo dígitos con indicativo de país (Colombia: 57 + 10 dígitos).
  const whatsappValue = clean(raw.whatsappNumber);
  if (isProduction && !whatsappValue) {
    problems.push("NEXT_PUBLIC_WHATSAPP_NUMBER es obligatoria en producción (ver D-01).");
  }
  if (whatsappValue && !/^\d{10,15}$/.test(whatsappValue)) {
    problems.push(
      "NEXT_PUBLIC_WHATSAPP_NUMBER debe tener solo dígitos con indicativo, p. ej. 57XXXXXXXXXX.",
    );
  }

  // Opcionales: si existen deben ser URL válidas.
  const contactEndpoint = clean(raw.contactEndpoint);
  if (contactEndpoint && !isHttpUrl(contactEndpoint)) {
    problems.push("NEXT_PUBLIC_CONTACT_ENDPOINT debe ser una URL http(s) válida.");
  }
  const mapsEmbedUrl = clean(raw.mapsEmbedUrl);
  if (mapsEmbedUrl && !isHttpUrl(mapsEmbedUrl)) {
    problems.push("NEXT_PUBLIC_MAPS_EMBED_URL debe ser una URL http(s) válida.");
  }

  if (problems.length > 0) {
    throw new Error(
      `Variables de entorno inválidas (ver .env.example y docs/PLAN_DESARROLLO.md §8.4):\n- ${problems.join("\n- ")}`,
    );
  }

  return {
    siteEnv,
    isProduction,
    siteUrl: stripTrailingSlash(siteUrlValue ?? "http://localhost:3000"),
    legacySiteUrl: stripTrailingSlash(legacyValue ?? "https://www.shaddaicolombia.com"),
    whatsappNumber: whatsappValue,
    contactEndpoint,
    mapsEmbedUrl,
  } as const;
}

export const env = parseEnv();

/** URL absoluta dentro de la nueva web (canónicas, sitemap, Open Graph). */
export const absoluteUrl = (path = "/") =>
  `${env.siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
