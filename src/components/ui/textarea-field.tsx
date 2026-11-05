import type { TextareaHTMLAttributes } from "react";
import { controlClass, fieldA11y, FieldFrame } from "@/components/ui/field";

type TextareaFieldProps = Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "id" | "className"> & {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  className?: string;
};

export function TextareaField({ id, label, hint, error, className, required, rows = 5, ...textarea }: TextareaFieldProps) {
  const { controlProps } = fieldA11y(id, hint, error);
  return (
    <FieldFrame id={id} label={label} hint={hint} error={error} required={required} className={className}>
      <textarea
        {...controlProps}
        required={required}
        rows={rows}
        className={`${controlClass(error)} min-h-32 py-3`}
        {...textarea}
      />
    </FieldFrame>
  );
}
