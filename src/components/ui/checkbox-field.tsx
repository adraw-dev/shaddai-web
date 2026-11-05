import type { InputHTMLAttributes, ReactNode } from "react";
import { fieldA11y } from "@/components/ui/field";

type CheckboxFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, "id" | "className" | "type" | "children"> & {
  id: string;
  /** Texto de la casilla; puede incluir un enlace. */
  children: ReactNode;
  error?: string;
};

/**
 * Casilla accesible. Toda la etiqueta es clicable y mide ≥ 44 px de alto; la casilla es de 24 px.
 * El error lleva texto y se asocia con aria-describedby.
 */
export function CheckboxField({ id, children, error, ...input }: CheckboxFieldProps) {
  const { controlProps, errorId } = fieldA11y(id, undefined, error);
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="flex min-h-11 cursor-pointer items-start gap-3 py-2">
        <input
          {...controlProps}
          type="checkbox"
          className="mt-0.5 size-6 shrink-0 cursor-pointer [accent-color:var(--color-accent)]"
          {...input}
        />
        <span>{children}</span>
      </label>
      {error ? (
        <p id={errorId} className="text-sm font-medium [color:var(--error)]">
          {error}
        </p>
      ) : null}
    </div>
  );
}
