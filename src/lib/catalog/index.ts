import { channels } from "@/content/channels";
import { productLines } from "@/content/product-lines";
import type { Channel, ProductLine } from "@/domain/catalog";

/**
 * Punto de acceso a datos del catálogo (plan §12.2): API estable que consume la UI.
 *
 * Fase 1: lee `src/content/` (datos estáticos tipados).
 * Fase futura (Strapi): este módulo elegirá la fuente según `CATALOG_SOURCE` y delegará en
 * `lib/catalog/strapi/*` (fetch + mapper → tipos de dominio). La UI no cambia.
 *
 * Las funciones son `async` desde ahora: los componentes de servidor ya hacen `await`.
 */
export async function getChannels(): Promise<Channel[]> {
  return channels;
}

export async function getProductLines(): Promise<ProductLine[]> {
  return productLines;
}
