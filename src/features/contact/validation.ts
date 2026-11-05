/**
 * Validación del formulario de Contáctenos: funciones PURAS (sin DOM ni React), listas para pruebas
 * unitarias (F6-01). Los mensajes están en español, en registro «usted» (D-09).
 *
 * Dos caminos de envío con reglas distintas (plan §3.1):
 *  - "whatsapp": el usuario abre su propio chat; solo se exige lo mínimo para cotizar (nombre y ciudad).
 *  - "message": los datos llegan a Shaddai por el endpoint; se exige teléfono y la autorización de datos.
 */

export type SubmitMode = "whatsapp" | "message";

export type ContactValues = {
  name: string;
  city: string;
  phone: string;
  email: string;
  businessType: string;
  message: string;
  consent: boolean;
  /** Honeypot: un humano nunca lo llena. */
  website: string;
};

export type ContactErrors = Partial<Record<Exclude<keyof ContactValues, "website">, string>>;

export const emptyContact: ContactValues = {
  name: "",
  city: "",
  phone: "",
  email: "",
  businessType: "",
  message: "",
  consent: false,
  website: "",
};

export const MESSAGE_MAX_LENGTH = 1000;
const BUSINESS_TYPES = ["HORECA", "VENDING", "MAQUILA", "RETAIL", "Otro"];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_CHARS_RE = /^\+?[\d\s().-]+$/;

/** Cuenta solo dígitos del teléfono. */
const digits = (value: string) => value.replace(/\D/g, "");

export function validateContact(values: ContactValues, mode: SubmitMode): ContactErrors {
  const errors: ContactErrors = {};

  if (values.name.trim().length < 2) errors.name = "Escriba su nombre.";
  if (values.city.trim().length < 2) errors.city = "Escriba la ciudad de envío.";

  const phone = values.phone.trim();
  if (mode === "message") {
    if (!phone) errors.phone = "Escriba un teléfono o WhatsApp para poder responderle.";
  }
  if (phone && (!PHONE_CHARS_RE.test(phone) || digits(phone).length < 7 || digits(phone).length > 15)) {
    errors.phone = "Revise el teléfono: use solo números (de 7 a 15 dígitos).";
  }

  const email = values.email.trim();
  if (email && !EMAIL_RE.test(email)) {
    errors.email = "Revise el correo: debe tener el formato nombre@dominio.com.";
  }

  if (values.businessType && !BUSINESS_TYPES.includes(values.businessType)) {
    errors.businessType = "Seleccione una opción de la lista.";
  }

  if (values.message.length > MESSAGE_MAX_LENGTH) {
    errors.message = `El mensaje es demasiado largo (máximo ${MESSAGE_MAX_LENGTH} caracteres).`;
  }

  if (mode === "message" && !values.consent) {
    errors.consent = "Debe autorizar el tratamiento de sus datos para enviar el mensaje.";
  }

  return errors;
}

/** Orden en que aparecen los campos en pantalla (para enfocar el primero con error). */
export const FIELD_ORDER: ReadonlyArray<keyof ContactErrors> = [
  "name",
  "city",
  "phone",
  "email",
  "businessType",
  "message",
  "consent",
];

export function firstErrorField(errors: ContactErrors): keyof ContactErrors | undefined {
  return FIELD_ORDER.find((field) => errors[field]);
}
