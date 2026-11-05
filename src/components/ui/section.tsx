import type { ReactNode } from "react";
import { Container } from "@/components/ui/container";
import { cn } from "@/lib/cn";

export type SectionTone = "brand" | "cream" | "cream-warm" | "ink";
export type SectionSize = "hero" | "default" | "compact";

/**
 * Cada tono define fondo, color de texto y variables que heredan los hijos:
 *   --muted  → texto secundario (<Text muted>)
 *   --link   → enlaces de énfasis
 *   --error  → mensajes de error
 *   --field-* → colores de los controles de formulario (ver ui/field.tsx)
 * Así los componentes internos no conocen el fondo en el que viven.
 * Sobre morado el campo es crema; sobre crema es blanco con borde de tinta al 55 % (≥ 3:1, WCAG 1.4.11).
 */
const dark =
  "text-cream-50 [--muted:var(--color-brand-300)] [--link:var(--color-accent-soft)] [--error:var(--color-accent-soft)] [--field-bg:var(--color-cream-50)] [--field-border:transparent]";
const light =
  "text-ink [--muted:var(--color-muted)] [--link:var(--color-brand-700)] [--error:var(--color-accent)] [--field-bg:#fff] [--field-border:color-mix(in_srgb,var(--color-ink)_55%,transparent)]";

const tones: Record<SectionTone, string> = {
  brand: `bg-brand-900 ${dark}`,
  ink: `bg-ink ${dark}`,
  cream: `bg-cream-50 ${light}`,
  "cream-warm": `bg-cream-100 ${light}`,
};

/**
 * Relleno vertical. Toda sección deja abajo `--sheet-overlap` extra: es el espacio que cubre la
 * «hoja» de la sección siguiente al superponerse, de modo que nunca tapa contenido.
 */
const sizes: Record<SectionSize, string> = {
  hero: "pt-12 pb-[calc(4rem+var(--sheet-overlap))] md:pt-24 md:pb-[calc(7rem+var(--sheet-overlap))]",
  default: "pt-16 pb-[calc(4rem+var(--sheet-overlap))] md:pt-24 md:pb-[calc(6rem+var(--sheet-overlap))]",
  compact: "pt-12 pb-[calc(3rem+var(--sheet-overlap))] md:pt-16 md:pb-[calc(4rem+var(--sheet-overlap))]",
};

/**
 * Transición entre secciones (plan §5.5): la sección «hoja» sube sobre la anterior con un borde
 * superior redondeado cuyo radio es igual al solape. Es CSS estático (sin animación): el cambio de
 * tono + la forma marcan el ritmo de la página. La primera sección de una página NO es hoja.
 */
export const sheetClasses =
  "relative -mt-[var(--sheet-overlap)] rounded-t-[var(--sheet-overlap)]";

type SectionProps = {
  tone?: SectionTone;
  size?: SectionSize;
  /** true = se superpone a la sección anterior con borde superior redondeado. */
  sheet?: boolean;
  id?: string;
  /** id del encabezado que nombra la sección (landmark accesible). */
  labelledBy?: string;
  /** false = el hijo controla su propio ancho (p. ej. imagen a sangre). */
  contained?: boolean;
  className?: string;
  children: ReactNode;
};

export function Section({
  tone = "cream",
  size = "default",
  sheet = false,
  id,
  labelledBy,
  contained = true,
  className,
  children,
}: SectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      data-tone={tone}
      className={cn(sizes[size], tones[tone], sheet && sheetClasses, className)}
    >
      {contained ? <Container>{children}</Container> : children}
    </section>
  );
}
