"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { CloseIcon, MenuIcon } from "@/components/icons";
import { LinkButton } from "@/components/ui/button";

/**
 * Menú móvil (visible bajo `lg`).
 * Teclado: botón con aria-expanded/aria-controls; Esc cierra y devuelve el foco al botón;
 * el panel cerrado es `inert` (sus enlaces no reciben foco).
 * Estados: cerrado/abierto con transición de altura (grid-rows) ≤ 280 ms.
 */
type MobileNavProps = {
  items: ReadonlyArray<{ label: string; href: string }>;
  ctaHref: string;
  ctaLabel: string;
};

export function MobileNav({ items, ctaHref, ctaLabel }: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const close = () => setOpen(false);

  return (
    <div className="lg:hidden">
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? "Cerrar menú" : "Abrir menú"}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex size-11 items-center justify-center rounded-control transition-[background-color,scale] duration-150 ease-ui hover:bg-cream-50/10 active:scale-[0.96]"
      >
        {open ? <CloseIcon size={24} /> : <MenuIcon size={24} />}
      </button>

      {/* Panel a todo el ancho, anclado bajo el header (que es `sticky`). */}
      <div
        id={panelId}
        inert={!open}
        className={`absolute inset-x-0 top-full grid border-t border-cream-50/15 bg-brand-900 shadow-raised transition-[grid-template-rows,visibility] duration-[280ms] ease-ui ${
          open ? "visible grid-rows-[1fr]" : "invisible grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <nav aria-label="Principal" className="mx-auto flex max-w-[75rem] flex-col gap-1 px-4 pt-3 pb-5 sm:px-6">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={close}
                className="flex min-h-12 items-center rounded-control px-3 text-lg font-medium transition-colors duration-150 hover:bg-cream-50/10"
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-3">
              <LinkButton href={ctaHref} size="lg" className="w-full" aria-label={ctaLabel}>
                {ctaLabel}
              </LinkButton>
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
}
