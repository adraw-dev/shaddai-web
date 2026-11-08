import { getCatalogEnv } from "@/lib/env";
import type {
  CmsBrandData,
  CmsCatalog,
  CmsCategoryData,
  CmsChannelData,
  CmsDocument,
  CmsProductData,
} from "./types";

/**
 * Cliente mínimo del API del CMS experimental (sin dependencias: `fetch` nativo).
 * Se ejecuta SOLO en el build (componentes de servidor + `generateStaticParams`): el token nunca llega
 * al navegador.
 *
 * Autenticación: JWT de proyecto (`Authorization: Bearer <token>`), de solo lectura y ligado a un sitio.
 * El CMS solo lo acepta en GET y en las rutas de consulta. Se usa `/documents` y no la «compilación» del
 * sitio para leer lo publicado al instante, sin esperar el agrupado de publicaciones del CMS.
 */

function cmsConfig() {
  const catalog = getCatalogEnv();
  if (catalog.source !== "cms") {
    throw new Error("El cliente del CMS solo se usa con CATALOG_SOURCE=cms.");
  }
  return catalog;
}

async function fetchDocuments(): Promise<CmsDocument<unknown>[]> {
  const { cmsUrl, cmsSite, cmsApiToken } = cmsConfig();
  const path = `/s/${cmsSite}/documents`;

  let response: Response;
  try {
    response = await fetch(`${cmsUrl}/api/v1${path}`, {
      headers: { Authorization: `Bearer ${cmsApiToken}`, Accept: "application/json" },
    });
  } catch (error) {
    throw new Error(`No se pudo conectar con el CMS en ${cmsUrl} (¿está encendido?).`, { cause: error });
  }
  if (!response.ok) {
    const hint =
      response.status === 401
        ? " Revise CMS_API_TOKEN (debe ser un JWT vigente, no revocado)."
        : response.status === 403 || response.status === 404
          ? ` ¿El token es del sitio «${cmsSite}» y tiene alcance de lectura?`
          : "";
    throw new Error(`El CMS respondió ${response.status} en ${path}.${hint}`);
  }
  return response.json() as Promise<CmsDocument<unknown>[]>;
}

const publishedOf = <T>(docs: CmsDocument<unknown>[], typeId: string): T[] =>
  docs.filter((doc) => doc.typeId === typeId && doc.published).map((doc) => doc.published as T);

/**
 * En el build se consulta una sola vez por proceso (varias páginas piden lo mismo). En desarrollo se
 * vuelve a leer en cada petición para ver al instante lo que se publica en el CMS.
 */
let catalogPromise: Promise<CmsCatalog> | undefined;

export function fetchCatalog(): Promise<CmsCatalog> {
  const load = () =>
    fetchDocuments().then((docs) => ({
      channels: publishedOf<CmsChannelData>(docs, "channel"),
      categories: publishedOf<CmsCategoryData>(docs, "category"),
      brands: publishedOf<CmsBrandData>(docs, "brand"),
      products: publishedOf<CmsProductData>(docs, "product"),
    }));
  if (process.env.NODE_ENV === "development") return load();
  catalogPromise ??= load().catch((error) => {
    catalogPromise = undefined;
    throw error;
  });
  return catalogPromise;
}
