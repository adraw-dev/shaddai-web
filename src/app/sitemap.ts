import type { MetadataRoute } from "next";
import { categoryHref, getCategories, getProducts, isCatalogEnabled, productHref } from "@/lib/catalog";
import { absoluteUrl } from "@/lib/env";

// Requerido con `output: "export"`: se genera en el build como archivo estático.
export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), changeFrequency: "monthly", priority: 1 },
    { url: absoluteUrl("/contactenos/"), changeFrequency: "yearly", priority: 0.7 },
  ];
  if (!isCatalogEnabled()) return pages;

  const [categories, products] = await Promise.all([getCategories(), getProducts()]);
  return [
    ...pages,
    { url: absoluteUrl("/productos/"), changeFrequency: "weekly", priority: 0.9 },
    ...categories.map((c) => ({ url: absoluteUrl(categoryHref(c)), changeFrequency: "weekly" as const, priority: 0.8 })),
    ...products.map((p) => ({ url: absoluteUrl(productHref(p)), changeFrequency: "weekly" as const, priority: 0.6 })),
  ];
}
