import type { Media } from "@/domain/catalog";
import manifest from "@/content/images.generated.json";

/**
 * Construye un `Media` del dominio a partir del manifiesto que genera `scripts/optimize-images.mjs`
 * (AVIF + WebP + respaldo, varios anchos). El texto alternativo vive junto al contenido que usa la
 * imagen, no en el manifiesto.
 */
export type ImageKey = keyof typeof manifest;

export function media(key: ImageKey, alt: string): Media {
  const entry = manifest[key];
  return { alt, width: entry.width, height: entry.height, variants: entry.variants };
}
