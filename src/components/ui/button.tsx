import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Teclado: Enter/Espacio en <button>, Enter en enlaces. Foco visible global (globals.css).
 * Estados: hover (≤150 ms), activo (scale 0.96), deshabilitado (opacidad + sin eventos).
 * Área táctil mínima 44 px (md) / 56 px (lg).
 */
type Variant = "primary" | "secondary";
type Size = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-control font-semibold leading-none " +
  "whitespace-nowrap select-none " +
  "transition-[background-color,color,box-shadow,scale] duration-150 ease-ui active:scale-[0.96] " +
  "disabled:pointer-events-none disabled:opacity-60 aria-disabled:pointer-events-none aria-disabled:opacity-60";

const variants: Record<Variant, string> = {
  // Acento = rojo del logo oscurecido (texto crema 5.6:1)
  primary: "bg-accent text-cream-50 hover:bg-accent-strong",
  // Hereda el color del tono de la sección (contorno y texto)
  secondary: "border-2 border-current bg-transparent text-inherit hover:bg-current/10",
};

const sizes: Record<Size, string> = {
  md: "min-h-11 px-5 text-base",
  lg: "min-h-14 px-7 text-lg",
};

const classes = (variant: Variant, size: Size, className?: string) =>
  cn(base, variants[variant], sizes[size], className);

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
};

type ButtonProps = CommonProps & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children">;

export function Button({ variant = "primary", size = "md", className, children, type = "button", ...rest }: ButtonProps) {
  return (
    <button type={type} className={classes(variant, size, className)} {...rest}>
      {children}
    </button>
  );
}

type LinkButtonProps = CommonProps & {
  href: string;
  /** Texto accesible cuando el visible no basta. */
  "aria-label"?: string;
};

/** Enlace con aspecto de botón. Rutas internas con next/link; tel:, mailto:, #, https: con <a>. */
export function LinkButton({ href, variant = "primary", size = "md", className, children, ...rest }: LinkButtonProps) {
  const cls = classes(variant, size, className);
  if (href.startsWith("/")) {
    return (
      <Link href={href} className={cls} {...rest}>
        {children}
      </Link>
    );
  }
  const external = /^https?:\/\//.test(href);
  return (
    <a
      href={href}
      className={cls}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...rest}
    >
      {children}
      {external ? <span className="sr-only"> (se abre en una pestaña nueva)</span> : null}
    </a>
  );
}
