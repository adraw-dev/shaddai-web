import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

/**
 * Campo de texto accesible: <label> visible, ayuda y error asociados con aria-describedby,
 * aria-invalid, foco visible y área ≥ 48 px. Teclado: nativo.
 * Estados: normal, foco, error, deshabilitado. El error NO depende solo del color (lleva texto).
 * Funciona sobre fondos claros y oscuros: el input siempre es crema; el color del error sale de --error.
 * (Select, Textarea y Checkbox se agregan en F4-04 con este mismo patrón.)
 */
type TextFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, "id" | "className"> & {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  className?: string;
};

export function TextField({ id, label, hint, error, className, ...input }: TextFieldProps) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label htmlFor={id} className="font-semibold">
        {label}
      </label>
      {hint ? (
        <p id={hintId} className="text-sm [color:var(--muted)]">
          {hint}
        </p>
      ) : null}
      <input
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={cn(
          "min-h-12 w-full rounded-control border-2 bg-cream-50 px-4 text-base text-ink",
          "placeholder:text-muted transition-[border-color,box-shadow] duration-150 ease-ui",
          "disabled:opacity-60",
          error ? "border-[color:var(--error)]" : "border-transparent",
        )}
        {...input}
      />
      {error ? (
        <p id={errorId} className="text-sm font-medium [color:var(--error)]">
          {error}
        </p>
      ) : null}
    </div>
  );
}
