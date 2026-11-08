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
  privacyPolicyUrl: process.env.NEXT_PUBLIC_PRIVACY_POLICY_URL,
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

  // Política de tratamiento de datos (Ley 1581 de 2012, plan D-03). Si el formulario envía los datos
  // a un endpoint (Shaddai pasa a tratar datos personales), en producción la política es obligatoria:
  // así el build impide publicar el formulario sin ella. Acepta ruta interna (/…) o URL http(s).
  const privacyPolicyUrl = clean(raw.privacyPolicyUrl);
  if (privacyPolicyUrl && !privacyPolicyUrl.startsWith("/") && !isHttpUrl(privacyPolicyUrl)) {
    problems.push("NEXT_PUBLIC_PRIVACY_POLICY_URL debe ser una ruta interna (/…) o una URL http(s).");
  }
  if (isProduction && contactEndpoint && !privacyPolicyUrl) {
    problems.push(
      "NEXT_PUBLIC_PRIVACY_POLICY_URL es obligatoria en producción cuando hay NEXT_PUBLIC_CONTACT_ENDPOINT (ver D-03).",
    );
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
    privacyPolicyUrl,
  } as const;
}

export const env = parseEnv();

/**
 * Variables del catálogo (docs/PLAN_STRAPI.md §4). Son SOLO de build/servidor: sin `NEXT_PUBLIC_`, así
 * que nunca llegan al navegador. Se leen de forma perezosa (función, no constante del módulo) para que
 * importar `env` desde un componente de cliente no evalúe ni exija estas variables.
 */
export type CatalogSource = "static" | "strapi" | "cms";

export type CatalogEnv =
  | { source: "static" }
  | { source: "strapi"; strapiUrl: string; strapiApiToken: string }
  /** CMS experimental (docs/CMS_EXPERIMENTAL.md): JWT de proyecto de solo lectura. */
  | { source: "cms"; cmsUrl: string; cmsSite: string; cmsApiToken: string };

let catalogEnv: CatalogEnv | undefined;

export function getCatalogEnv(): CatalogEnv {
  if (catalogEnv) return catalogEnv;

  const source = clean(process.env.CATALOG_SOURCE) ?? "static";
  if (source !== "static" && source !== "strapi" && source !== "cms") {
    throw new Error(`CATALOG_SOURCE="${source}" no es válida (static | strapi | cms).`);
  }
  if (source === "static") return (catalogEnv = { source });
  if (source === "cms") return (catalogEnv = getCmsEnv());

  const problems: string[] = [];
  const strapiUrl = clean(process.env.STRAPI_URL);
  const strapiApiToken = clean(process.env.STRAPI_API_TOKEN);
  if (!strapiUrl || !isHttpUrl(strapiUrl)) {
    problems.push("STRAPI_URL es obligatoria con CATALOG_SOURCE=strapi y debe ser una URL http(s).");
  }
  if (!strapiApiToken) {
    problems.push("STRAPI_API_TOKEN es obligatoria con CATALOG_SOURCE=strapi (token de solo lectura).");
  }
  if (problems.length > 0) {
    throw new Error(`Variables del catálogo inválidas (ver .env.example y docs/PLAN_STRAPI.md §6):\n- ${problems.join("\n- ")}`);
  }

  return (catalogEnv = { source, strapiUrl: stripTrailingSlash(strapiUrl!), strapiApiToken: strapiApiToken! });
}

function getCmsEnv(): CatalogEnv {
  const problems: string[] = [];
  const cmsUrl = clean(process.env.CMS_URL);
  const cmsSite = clean(process.env.CMS_SITE);
  const cmsApiToken = clean(process.env.CMS_API_TOKEN);
  if (!cmsUrl || !isHttpUrl(cmsUrl)) {
    problems.push("CMS_URL es obligatoria con CATALOG_SOURCE=cms y debe ser una URL http(s).");
  }
  if (!cmsSite || !/^[a-z0-9-]{2,40}$/.test(cmsSite)) {
    problems.push("CMS_SITE es obligatoria con CATALOG_SOURCE=cms (id del sitio en el CMS, p. ej. shaddai).");
  }
  if (!cmsApiToken || cmsApiToken.split(".").length !== 3) {
    problems.push("CMS_API_TOKEN es obligatoria con CATALOG_SOURCE=cms (JWT de proyecto de solo lectura).");
  }
  if (problems.length > 0) {
    throw new Error(`Variables del catálogo inválidas (ver .env.example y docs/CMS_EXPERIMENTAL.md):\n- ${problems.join("\n- ")}`);
  }
  return {
    source: "cms",
    cmsUrl: stripTrailingSlash(cmsUrl!),
    cmsSite: cmsSite!,
    cmsApiToken: cmsApiToken!,
  };
}

/** URL absoluta dentro de la nueva web (canónicas, sitemap, Open Graph). */
export const absoluteUrl = (path = "/") =>
  `${env.siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
