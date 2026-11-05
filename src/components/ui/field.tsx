import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Base común de los campos de formulario (TextField, SelectField, TextareaField, CheckboxField).
 *
 * Accesibilidad: <label> visible; ayuda y error asociados con aria-describedby; aria-invalid;
 * el error SIEMPRE lleva texto (no depende solo del color). Foco visible: estilo global.
 * Color: fondo y borde del control salen de --field-bg / --field-border, que fija cada <Section>
 * según su tono (crema sobre espresso; blanco con borde ≥ 3:1 sobre crema).
 */
export function fieldA11y(id: string, hint?: string, error?: string) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  return {
    hintId,
    errorId,
    controlProps: {
      id,
      "aria-invalid": error ? (true as const) : undefined,
      "aria-describedby": [hintId, errorId].filter(Boolean).join(" ") || undefined,
    },
  };
}

/** Clases del control (input, select, textarea). El borde de error y el normal son excluyentes. */
export const controlClass = (error?: string) =>
  cn(
    "w-full rounded-control border-2 px-4 text-base text-ink [background:var(--field-bg)]",
    "placeholder:text-muted transition-[border-color,box-shadow] duration-150 ease-ui",
    "disabled:opacity-60",
    error ? "border-[color:var(--error)]" : "[border-color:var(--field-border)]",
  );

type FrameProps = {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  /** Marca visual y semántica de obligatorio (además del atributo `required` del control). */
  required?: boolean;
  className?: string;
  children: ReactNode;
};

export function FieldFrame({ id, label, hint, error, required, className, children }: FrameProps) {
  const { hintId, errorId } = fieldA11y(id, hint, error);
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label htmlFor={id} className="font-semibold">
        {label}
        {required ? <span className="font-normal [color:var(--muted)]"> (obligatorio)</span> : null}
      </label>
      {hint ? (
        <p id={hintId} className="text-sm [color:var(--muted)]">
          {hint}
        </p>
      ) : null}
      {children}
      {error ? (
        <p id={errorId} className="text-sm font-medium [color:var(--error)]">
          {error}
        </p>
      ) : null}
    </div>
  );
}
