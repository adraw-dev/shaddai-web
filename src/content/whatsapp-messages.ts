/**
 * Mensajes de WhatsApp.
 *
 * TODO(contenido, D-08): el MD solo DESCRIBE los dos mensajes de bienvenida del botón actual
 * (asesoría con emojis; cotización que pide nombre y lugar de envío). Los textos de abajo son
 * propuestas basadas en esa descripción: validarlos o reemplazarlos por los literales del cliente.
 * Registro «usted» según propuesta D-09.
 */

export const advisoryMessage =
  "¡Hola! Quisiera recibir asesoría personalizada con mi pedido.";

/** Mensaje armado desde el formulario de Contáctenos (camino «Enviar por WhatsApp»). */
export function contactFormMessage(details: {
  name: string;
  city: string;
  businessType?: string;
  message?: string;
}): string {
  const parts = [quoteMessage({ name: details.name, city: details.city })];
  if (details.businessType?.trim()) parts.push(`Tipo de negocio: ${details.businessType.trim()}.`);
  if (details.message?.trim()) parts.push(`Mensaje: ${details.message.trim()}`);
  return parts.join(" ");
}

/** Consulta sobre un canal comercial (p. ej. MAQUILA, que no tiene página de catálogo válida). */
export function channelInquiryMessage(channelName: string): string {
  return `Hola, me interesa el canal ${channelName} de Shaddai Insumos S.A.S. y quisiera más información.`;
}

/** Cotización de un producto del catálogo (plan §12.6): nombre, presentación y referencia. */
export function productQuoteMessage(product: { name: string; presentation?: string; sku?: string }): string {
  const details = [product.presentation, product.sku ? `ref. ${product.sku}` : undefined].filter(Boolean).join(", ");
  return `Hola, quisiera una cotización de ${product.name}${details ? ` (${details})` : ""}. ¿Me pueden ayudar?`;
}

/** Flujo de cotización: el dato que Shaddai necesita es nombre + ciudad de envío (MD §10). */
export function quoteMessage(details?: { name?: string; city?: string }): string {
  const name = details?.name?.trim();
  const city = details?.city?.trim();
  const intro = "Hola, me interesan los productos de Shaddai Insumos S.A.S. y quisiera una cotización.";
  const who = name ? ` Mi nombre es ${name}.` : "";
  const where = city ? ` El lugar de envío es ${city}.` : "";
  return `${intro}${who}${where}`;
}
