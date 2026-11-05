"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { WhatsAppIcon } from "@/components/icons";
import { Button, LinkButton } from "@/components/ui/button";
import { CheckboxField } from "@/components/ui/checkbox-field";
import { Heading } from "@/components/ui/heading";
import { SelectField } from "@/components/ui/select-field";
import { TextField } from "@/components/ui/text-field";
import { TextareaField } from "@/components/ui/textarea-field";
import { contactContent } from "@/content/contact";
import { contactFormMessage } from "@/content/whatsapp-messages";
import {
  emptyContact,
  firstErrorField,
  MESSAGE_MAX_LENGTH,
  validateContact,
  type ContactErrors,
  type ContactValues,
  type SubmitMode,
} from "@/features/contact/validation";
import { submitContactForm } from "@/lib/integrations/contact-form";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

/**
 * Formulario de contacto.
 *
 * Dos caminos (plan §3.1): «Enviar mensaje» (solo si hay endpoint configurado) y «Enviar por WhatsApp»
 * (siempre, sin backend). Sin endpoint el formulario se reduce a lo que sirve para WhatsApp.
 *
 * Teclado: Enter envía por el camino principal; tras un error el foco va al primer campo inválido;
 * tras enviar, el foco pasa al mensaje de estado. Los valores se conservan si el envío falla.
 * Estados: inicial · enviando (botón deshabilitado, aria-busy) · éxito (role=status) · error (role=alert).
 * Anti-spam: campo señuelo («honeypot») invisible y fuera del orden de tabulación.
 */
type Status = "idle" | "submitting" | "success" | "error";

type ContactFormProps = {
  /** true si hay endpoint (NEXT_PUBLIC_CONTACT_ENDPOINT): habilita «Enviar mensaje», teléfono, correo y autorización. */
  canSendMessage: boolean;
  privacyPolicyUrl?: string;
};

export function ContactForm({ canSendMessage, privacyPolicyUrl }: ContactFormProps) {
  const { form: copy } = contactContent;
  const [values, setValues] = useState<ContactValues>(emptyContact);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [notice, setNotice] = useState<string | null>(null);
  const statusRef = useRef<HTMLDivElement>(null);

  // Mueve el foco al resultado (éxito o error) para que lectores de pantalla y teclado lo perciban.
  useEffect(() => {
    if (status === "success" || status === "error") statusRef.current?.focus();
  }, [status]);

  function update<K extends keyof ContactValues>(key: K, value: ContactValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
    if (key in errors) setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  async function send(mode: SubmitMode) {
    setNotice(null);
    const found = validateContact(values, mode);
    setErrors(found);
    const first = firstErrorField(found);
    if (first) {
      document.getElementById(`contact-${first}`)?.focus();
      return;
    }

    // Honeypot: un bot lo llena. Se simula éxito sin enviar nada.
    if (values.website) {
      setStatus("success");
      return;
    }

    if (mode === "whatsapp") {
      const url = buildWhatsAppUrl(contactFormMessage(values));
      if (url.startsWith("http")) {
        window.open(url, "_blank", "noopener,noreferrer");
        setNotice("Abrimos WhatsApp en una pestaña nueva con su mensaje listo para enviar.");
      } else {
        window.location.assign(url);
      }
      return;
    }

    setStatus("submitting");
    const result = await submitContactForm({
      name: values.name.trim(),
      city: values.city.trim(),
      phone: values.phone.trim(),
      email: values.email.trim() || undefined,
      businessType: values.businessType || undefined,
      message: values.message.trim() || undefined,
      consent: true,
    });
    setStatus(result.ok ? "success" : "error");
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "submitting") return;
    void send(canSendMessage ? "message" : "whatsapp");
  }

  function reset() {
    setValues(emptyContact);
    setErrors({});
    setNotice(null);
    setStatus("idle");
  }

  if (status === "success") {
    const { success } = copy;
    return (
      <div
        ref={statusRef}
        tabIndex={-1}
        role="status"
        className="space-y-5 rounded-card bg-cream-100 p-6 outline-none sm:p-8"
      >
        <svg viewBox="0 0 24 24" width="48" height="48" fill="none" aria-hidden="true" className="text-whatsapp">
          <circle cx="12" cy="12" r="10.5" stroke="currentColor" strokeWidth="1.75" />
          <path
            d="M7 12.5l3.2 3.2L17 9"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="check-draw"
          />
        </svg>
        <Heading level={3}>{success.title}</Heading>
        <p>{success.text}</p>
        <div className="flex flex-wrap items-center gap-3">
          <LinkButton href={buildWhatsAppUrl(contactFormMessage(values))} variant="secondary">
            <WhatsAppIcon size={20} />
            {success.orWhatsApp}
          </LinkButton>
          <Button variant="secondary" onClick={reset}>
            {success.again}
          </Button>
        </div>
      </div>
    );
  }

  const busy = status === "submitting";

  return (
    <form onSubmit={onSubmit} noValidate aria-busy={busy} className="relative space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField
          id="contact-name"
          label={copy.labels.name}
          autoComplete="name"
          required
          value={values.name}
          onChange={(e) => update("name", e.target.value)}
          error={errors.name}
        />
        <TextField
          id="contact-city"
          label={copy.labels.city}
          autoComplete="address-level2"
          required
          value={values.city}
          onChange={(e) => update("city", e.target.value)}
          error={errors.city}
        />
      </div>

      {canSendMessage ? (
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField
            id="contact-phone"
            type="tel"
            inputMode="tel"
            label={copy.labels.phone}
            hint={copy.hints.phone}
            autoComplete="tel"
            required
            value={values.phone}
            onChange={(e) => update("phone", e.target.value)}
            error={errors.phone}
          />
          <TextField
            id="contact-email"
            type="email"
            inputMode="email"
            label={copy.labels.email}
            hint={copy.hints.email}
            autoComplete="email"
            value={values.email}
            onChange={(e) => update("email", e.target.value)}
            error={errors.email}
          />
        </div>
      ) : null}

      <SelectField
        id="contact-businessType"
        label={copy.labels.businessType}
        placeholder={copy.businessTypePlaceholder}
        options={copy.businessTypes}
        value={values.businessType}
        onChange={(e) => update("businessType", e.target.value)}
        error={errors.businessType}
      />

      <TextareaField
        id="contact-message"
        label={copy.labels.message}
        hint={copy.hints.message}
        maxLength={MESSAGE_MAX_LENGTH + 200}
        value={values.message}
        onChange={(e) => update("message", e.target.value)}
        error={errors.message}
      />

      {canSendMessage ? (
        <CheckboxField
          id="contact-consent"
          required
          checked={values.consent}
          onChange={(e) => update("consent", e.target.checked)}
          error={errors.consent}
        >
          {copy.consentBefore}
          {privacyPolicyUrl ? (
            <a
              href={privacyPolicyUrl}
              className="font-semibold text-brand-700 underline underline-offset-4"
              {...(/^https?:\/\//.test(privacyPolicyUrl) ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            >
              {copy.consentLink}
              {/^https?:\/\//.test(privacyPolicyUrl) ? <span className="sr-only"> (se abre en una pestaña nueva)</span> : null}
            </a>
          ) : (
            copy.consentLink
          )}
          {copy.consentAfter}
        </CheckboxField>
      ) : null}

      {/* Honeypot: oculto a la vista y a lectores de pantalla, fuera del orden de tabulación. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          No llenar este campo
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            value={values.website}
            onChange={(e) => update("website", e.target.value)}
          />
        </label>
      </div>

      {status === "error" ? (
        <div
          ref={statusRef}
          tabIndex={-1}
          role="alert"
          className="rounded-card border-2 border-accent bg-white p-4 outline-none"
        >
          <p className="font-semibold">{copy.error.title}</p>
          <p className="text-sm">{copy.error.text}</p>
        </div>
      ) : null}

      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" size="lg" disabled={busy}>
          {canSendMessage ? (
            busy ? copy.sending : copy.submitMessage
          ) : (
            <>
              <WhatsAppIcon size={22} />
              {copy.submitWhatsApp}
            </>
          )}
        </Button>
        {canSendMessage ? (
          <Button type="button" size="lg" variant="secondary" disabled={busy} onClick={() => void send("whatsapp")}>
            <WhatsAppIcon size={22} />
            {copy.submitWhatsApp}
          </Button>
        ) : null}
      </div>

      {notice ? (
        <p role="status" className="text-sm font-medium">
          {notice}
        </p>
      ) : null}
    </form>
  );
}
