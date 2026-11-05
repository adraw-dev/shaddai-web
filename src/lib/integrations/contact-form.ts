import { env } from "@/lib/env";

/**
 * Adaptador del servicio que recibe el formulario de contacto (plan §8.4, D-02).
 * Cambiar de proveedor = tocar solo este archivo y NEXT_PUBLIC_CONTACT_ENDPOINT.
 *
 * Contrato asumido (el de la mayoría de servicios «formulario → correo»): POST con JSON y respuesta
 * 2xx cuando se aceptó. Sin servidor propio: el sitio es estático (plan §7.5).
 */
export const isContactEndpointConfigured = Boolean(env.contactEndpoint);

export type ContactPayload = {
  name: string;
  city: string;
  phone: string;
  email?: string;
  businessType?: string;
  message?: string;
  consent: true;
};

export type SubmitResult = { ok: true } | { ok: false; reason: "not-configured" | "network" | "rejected" };

const TIMEOUT_MS = 15_000;

export async function submitContactForm(payload: ContactPayload): Promise<SubmitResult> {
  const endpoint = env.contactEndpoint;
  if (!endpoint) return { ok: false, reason: "not-configured" };

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    return response.ok ? { ok: true } : { ok: false, reason: "rejected" };
  } catch {
    // Sin red, CORS, tiempo agotado…: el usuario puede reintentar sin perder lo escrito.
    return { ok: false, reason: "network" };
  } finally {
    clearTimeout(timer);
  }
}
