import { env } from "@/lib/env";

/**
 * ÚNICA fuente de enlaces de WhatsApp (plan §16, regla 4).
 * Nunca construir URLs `wa.me` a mano en componentes.
 *
 * Si el número no está configurado (solo posible fuera de producción, ver env.ts)
 * el enlace cae a la página de contacto en lugar de apuntar a un número inexistente.
 */
export const isWhatsAppConfigured = Boolean(env.whatsappNumber);

export function buildWhatsAppUrl(message?: string): string {
  const number = env.whatsappNumber;
  if (!number) return "/contactenos/";
  const query = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${number}${query}`;
}
