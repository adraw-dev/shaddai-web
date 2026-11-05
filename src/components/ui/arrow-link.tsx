import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRightIcon } from "@/components/icons";
import { cn } from "@/lib/cn";

/**
 * Enlace de texto con flecha que se desplaza al pasar el cursor (≤ 150 ms).
 * Usa el color de énfasis del tono de la sección (--link). Área táctil ≥ 44 px.
 * Teclado: enlace nativo. Externo (https:): se abre en pestaña nueva y se anuncia a lectores de pantalla.
 */
type ArrowLinkProps = {
  href: string;
  className?: string;
  children: ReactNode;
};

export function ArrowLink({ href, className, children }: ArrowLinkProps) {
  const cls = cn(
    "group inline-flex min-h-11 items-center gap-2 font-semibold [color:var(--link)] underline-offset-4 hover:underline",
    className,
  );
  const arrow = (
    <ArrowRightIcon
      size={18}
      className="transition-transform duration-150 ease-ui group-hover:translate-x-1"
    />
  );

  if (href.startsWith("/")) {
    return (
      <Link href={href} className={cls}>
        {children}
        {arrow}
      </Link>
    );
  }

  const external = /^https?:\/\//.test(href);
  return (
    <a
      href={href}
      className={cls}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {children}
      {arrow}
      {external ? <span className="sr-only"> (se abre en una pestaña nueva)</span> : null}
    </a>
  );
}
