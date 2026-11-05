"use client";

import { useState } from "react";
import { PinIcon } from "@/components/icons";

/**
 * Mapa embebido BAJO DEMANDA: no se carga el iframe (ni se contacta a terceros) hasta que el usuario
 * lo pide. Es un <button> real, accesible por teclado. La dirección en texto y el enlace «Cómo llegar»
 * siguen disponibles siempre como alternativa (ver features/contact/location.tsx).
 */
type MapFacadeProps = {
  src: string;
  title: string;
  buttonLabel: string;
};

export function MapFacade({ src, title, buttonLabel }: MapFacadeProps) {
  const [active, setActive] = useState(false);

  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-card bg-brand-900">
      {active ? (
        <iframe
          className="absolute inset-0 size-full border-0"
          src={src}
          title={title}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          onClick={() => setActive(true)}
          data-on-dark
          className="group absolute inset-0 flex size-full flex-col items-center justify-center gap-3 text-cream-50 transition-colors duration-150 hover:bg-brand-700/40"
        >
          <PinIcon size={36} />
          <span className="font-semibold">{buttonLabel}</span>
        </button>
      )}
    </div>
  );
}
