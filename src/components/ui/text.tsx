import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "lead" | "body" | "small";

const variants: Record<Variant, string> = {
  lead: "text-lead",
  body: "text-base leading-relaxed",
  small: "text-sm leading-normal",
};

type TextProps = {
  variant?: Variant;
  /** Usa el color secundario del tono de la sección (--muted). */
  muted?: boolean;
  className?: string;
  children: ReactNode;
};

export function Text({ variant = "body", muted = false, className, children }: TextProps) {
  return (
    <p className={cn(variants[variant], muted && "[color:var(--muted)]", className)}>
      {children}
    </p>
  );
}
