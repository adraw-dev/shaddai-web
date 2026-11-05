import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/env";
import { isIndexable } from "@/lib/seo";

// Requerido con `output: "export"`: se genera en el build como archivo estático.
export const dynamic = "force-static";

/** Solo producción se indexa; previews y local bloquean a los buscadores (plan §10.1 y §11.5). */
export default function robots(): MetadataRoute.Robots {
  if (!isIndexable) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
