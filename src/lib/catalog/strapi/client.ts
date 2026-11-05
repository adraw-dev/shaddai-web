import { getCatalogEnv } from "@/lib/env";
import type { StrapiCategory, StrapiCollection, StrapiProduct } from "./types";

/**
 * Cliente mínimo de la API REST de Strapi (sin dependencias: `fetch` nativo).
 * Se ejecuta SOLO en el build (componentes de servidor + `generateStaticParams`): el token de solo
 * lectura nunca llega al navegador (plan §12.5).
 */

const PAGE_SIZE = 100;

function strapiConfig() {
  const catalog = getCatalogEnv();
  if (catalog.source !== "strapi") {
    throw new Error("El cliente de Strapi solo se usa con CATALOG_SOURCE=strapi.");
  }
  return catalog;
}

async function request<T>(path: string, params: Record<string, string>): Promise<StrapiCollection<T>> {
  const { strapiUrl, strapiApiToken } = strapiConfig();
  const url = `${strapiUrl}/api/${path}?${new URLSearchParams(params)}`;

  let response: Response;
  try {
    response = await fetch(url, {
      headers: { Authorization: `Bearer ${strapiApiToken}`, Accept: "application/json" },
      cache: "force-cache",
    });
  } catch (error) {
    throw new Error(`No se pudo conectar con Strapi en ${strapiUrl} (¿está encendido?).`, { cause: error });
  }
  if (!response.ok) {
    const hint =
      response.status === 401 || response.status === 403
        ? " Revise STRAPI_API_TOKEN (debe ser un token «Read-only» vigente)."
        : "";
    throw new Error(`Strapi respondió ${response.status} en /api/${path}.${hint}`);
  }
  return response.json() as Promise<StrapiCollection<T>>;
}

/** Recorre todas las páginas de una colección. */
async function findAll<T>(path: string, params: Record<string, string>): Promise<T[]> {
  const items: T[] = [];
  for (let page = 1; ; page++) {
    const { data, meta } = await request<T>(path, {
      ...params,
      "pagination[page]": String(page),
      "pagination[pageSize]": String(PAGE_SIZE),
    });
    items.push(...data);
    if (page >= meta.pagination.pageCount) return items;
  }
}

/**
 * Memoización por proceso de build: varias páginas piden el mismo listado y así se consulta
 * Strapi una sola vez por proceso.
 */
let productsPromise: Promise<StrapiProduct[]> | undefined;
let categoriesPromise: Promise<StrapiCategory[]> | undefined;

export function fetchProducts(): Promise<StrapiProduct[]> {
  productsPromise ??= findAll<StrapiProduct>("products", {
    status: "published",
    sort: "name:asc",
    "populate[images]": "true",
    "populate[category][fields][0]": "name",
    "populate[category][fields][1]": "slug",
    "populate[channels][fields][0]": "slug",
    "populate[brand][fields][0]": "name",
    "populate[seo][populate][0]": "shareImage",
  }).catch((error) => {
    productsPromise = undefined;
    throw error;
  });
  return productsPromise;
}

export function fetchCategories(): Promise<StrapiCategory[]> {
  categoriesPromise ??= findAll<StrapiCategory>("categories", {
    sort: "order:asc",
    "populate[image]": "true",
  }).catch((error) => {
    categoriesPromise = undefined;
    throw error;
  });
  return categoriesPromise;
}
