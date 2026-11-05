import type { ReactNode } from "react";
import { Container } from "@/components/ui/container";
import { cn } from "@/lib/cn";

/**
 * Propuesta B «Aurora 2.5D»: fondos en degradado suave.
 *   aurora (hero)  ·  cream  ·  cream-warm  ·  sunrise (cierre)  → tonos claros, texto tinta
 *   dusk (canales) ·  ink (footer)                              → tonos profundos, texto crema
 */
export type SectionTone = "aurora" | "cream" | "cream-warm" | "sunrise" | "dusk" | "ink";
export type SectionSize = "hero" | "default" | "compact";

/**
 * Cada tono define fondo, color de texto y variables que heredan los hijos:
 *   --muted  → texto secundario (<Text muted>)
 *   --link   → enlaces de énfasis
 *   --error  → mensajes de error
 *   --field-* → colores de los controles de formulario (ver ui/field.tsx)
 * Así los componentes internos no conocen el fondo en el que viven.
 * Sobre espresso el campo es crema; sobre crema es blanco con borde de tinta al 55 % (≥ 3:1, WCAG 1.4.11).
 */
const dark =
  "text-cream-50 [--muted:var(--color-sand-300)] [--link:var(--color-accent-soft)] [--error:var(--color-accent-soft)] [--field-bg:var(--color-cream-50)] [--field-border:transparent]";
/** «dusk» es un degradado rosado-café más claro que el espresso: texto secundario y enlaces suben de luminosidad (≥ 4.5:1 en su punto más claro). */
const duskVars =
  "text-cream-50 [--muted:var(--color-peach-100)] [--link:var(--color-butter-100)] [--error:var(--color-butter-100)] [--field-bg:var(--color-cream-50)] [--field-border:transparent]";
const light =
  "text-ink [--muted:var(--color-muted)] [--link:var(--color-copper)] [--error:var(--color-accent)] [--field-bg:#fff] [--field-border:color-mix(in_srgb,var(--color-ink)_55%,transparent)]";

/** Sobre el degradado «sunrise» (más saturado) el texto secundario baja a espresso-700 para mantener AA. */
const lightStrong = light.replace("[--muted:var(--color-muted)]", "[--muted:var(--color-espresso-700)]");

const tones: Record<SectionTone, string> = {
  aurora: `bg-peach-100 bg-[image:var(--grad-aurora)] ${light}`,
  cream: `bg-cream-50 bg-[image:var(--grad-cream)] ${light}`,
  "cream-warm": `bg-cream-100 bg-[image:var(--grad-cream-warm)] ${light}`,
  sunrise: `bg-apricot-300 bg-[image:var(--grad-sunrise)] ${lightStrong}`,
  dusk: `bg-mocha-700 bg-[image:var(--grad-dusk)] ${duskVars}`,
  ink: `bg-ink bg-[image:var(--grad-ink)] ${dark}`,
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
  "relative -mt-[var(--sheet-overlap)] rounded-t-[var(--sheet-overlap)] shadow-[0_-16px_36px_-20px_rgb(90_58_52/0.3)]";

type SectionProps = {
  tone?: SectionTone;
  size?: SectionSize;
  /** true = se superpone a la sección anterior con borde superior redondeado. */
  sheet?: boolean;
  id?: string;
  /** id del encabezado que nombra la sección (landmark accesible). */
  labelledBy?: string;
  /** true = primera sección de la página: el header transparente flota encima, así que se suma su alto al relleno superior. */
  underHeader?: boolean;
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
  underHeader = false,
  contained = true,
  className,
  children,
}: SectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      data-tone={tone}
      className={cn(
        sizes[size],
        underHeader && "pt-[calc(var(--header-height)+3rem)]! md:pt-[calc(var(--header-height)+5rem)]!",
        tones[tone],
        sheet && sheetClasses,
        className,
      )}
    >
      {contained ? <Container>{children}</Container> : children}
    </section>
  );
}
