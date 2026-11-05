import type { InputHTMLAttributes } from "react";
import { controlClass, fieldA11y, FieldFrame } from "@/components/ui/field";

type TextFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, "id" | "className"> & {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  className?: string;
};

/** Campo de texto (input). Teclado: nativo. Estados: normal, foco, error, deshabilitado. */
export function TextField({ id, label, hint, error, className, required, ...input }: TextFieldProps) {
  const { controlProps } = fieldA11y(id, hint, error);
  return (
    <FieldFrame id={id} label={label} hint={hint} error={error} required={required} className={className}>
      <input {...controlProps} required={required} className={`${controlClass(error)} min-h-12`} {...input} />
    </FieldFrame>
  );
}
