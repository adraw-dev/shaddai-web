import type { ReactNode } from "react";
import { Container } from "@/components/ui/container";
import { cn } from "@/lib/cn";

export type SectionTone = "brand" | "cream" | "cream-warm" | "ink";

/**
 * Cada tono define fondo, color de texto y dos variables que heredan los hijos:
 *   --muted  → texto secundario (<Text muted>)
 *   --link   → enlaces de énfasis
 * Así los componentes internos no conocen el fondo en el que viven.
 */
// --field-*: colores de los controles de formulario (ver ui/field.tsx). Sobre morado el campo es crema;
// sobre crema es blanco con borde de tinta al 55 % (≥ 3:1 contra el fondo, WCAG 1.4.11).
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

type SectionProps = {
  tone?: SectionTone;
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
      className={cn("py-16 md:py-24", tones[tone], className)}
    >
      {contained ? <Container>{children}</Container> : children}
    </section>
  );
}
