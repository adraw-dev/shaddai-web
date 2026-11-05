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
const dark = "text-cream-50 [--muted:var(--color-brand-300)] [--link:var(--color-accent-soft)] [--error:var(--color-accent-soft)]";
const light = "text-ink [--muted:var(--color-muted)] [--link:var(--color-brand-700)] [--error:var(--color-accent)]";

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
