"use client";

import { useState, type FormEvent } from "react";
import { WhatsAppIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { TextField } from "@/components/ui/text-field";
import { homeContent } from "@/content/home";
import { quoteMessage } from "@/content/whatsapp-messages";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

/**
 * Mini-flujo de cotización: nombre + ciudad de envío → abre WhatsApp con el mensaje precargado.
 * No hay backend ni se guarda nada: los datos solo viajan al enlace wa.me que el propio usuario abre.
 * Teclado: Enter envía; al fallar la validación el foco va al primer campo con error.
 * Estados: inicial, error por campo (texto + aria-invalid). Sin JS el botón no funciona, pero la
 * sección conserva el enlace a Contáctenos.
 */
type Errors = { name?: string; city?: string };

export function QuoteForm() {
  const { quote: copy } = homeContent;
  const [errors, setErrors] = useState<Errors>({});

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const city = String(data.get("city") ?? "").trim();

    const next: Errors = {};
    if (!name) next.name = "Escriba su nombre.";
    if (!city) next.city = "Escriba la ciudad de envío.";
    setErrors(next);

    if (next.name || next.city) {
      const firstInvalid = next.name ? "quote-name" : "quote-city";
      form.querySelector<HTMLInputElement>(`#${firstInvalid}`)?.focus();
      return;
    }

    const url = buildWhatsAppUrl(quoteMessage({ name, city }));
    if (url.startsWith("http")) {
      window.open(url, "_blank", "noopener,noreferrer");
    } else {
      window.location.assign(url);
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField
          id="quote-name"
          name="name"
          label={copy.nameLabel}
          autoComplete="name"
          required
          error={errors.name}
        />
        <TextField
          id="quote-city"
          name="city"
          label={copy.cityLabel}
          autoComplete="address-level2"
          required
          error={errors.city}
        />
      </div>
      <Button type="submit" size="lg" className="w-full sm:w-auto">
        <WhatsAppIcon size={22} />
        {copy.submit}
      </Button>
    </form>
  );
}
