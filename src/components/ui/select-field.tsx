import type { SelectHTMLAttributes } from "react";
import { controlClass, fieldA11y, FieldFrame } from "@/components/ui/field";

type SelectFieldProps = Omit<SelectHTMLAttributes<HTMLSelectElement>, "id" | "className" | "children"> & {
  id: string;
  label: string;
  options: ReadonlyArray<{ value: string; label: string }>;
  /** Texto de la opción vacía (valor ""). */
  placeholder: string;
  hint?: string;
  error?: string;
  className?: string;
};

/** Lista desplegable nativa (accesible y usable en móvil). */
export function SelectField({ id, label, options, placeholder, hint, error, className, required, ...select }: SelectFieldProps) {
  const { controlProps } = fieldA11y(id, hint, error);
  return (
    <FieldFrame id={id} label={label} hint={hint} error={error} required={required} className={className}>
      <select {...controlProps} required={required} className={`${controlClass(error)} min-h-12`} {...select}>
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </FieldFrame>
  );
}
