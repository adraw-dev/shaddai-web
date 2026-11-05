import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/env";

// Requerido con `output: "export"`: se genera en el build como archivo estático.
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: absoluteUrl("/"), changeFrequency: "monthly", priority: 1 },
    { url: absoluteUrl("/contactenos/"), changeFrequency: "yearly", priority: 0.7 },
  ];
}
