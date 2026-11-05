"use client";

import { useEffect, useRef, type CSSProperties, type ElementType, type ReactNode } from "react";

/**
 * Revelado al entrar en el viewport, UNA sola vez (plan §5.5).
 * - Sin JS el contenido es visible: el estado oculto solo se aplica con `@media (scripting: enabled)` (globals.css).
 * - `prefers-reduced-motion`: globals.css deja el contenido visible y sin desplazamiento.
 * - Solo anima `opacity` y `transform`. Máx. 6 elementos por grupo escalonado (delay ≤ ~0.4 s).
 * - Si IntersectionObserver no existe, se muestra de inmediato.
 * Uso: <Reveal as="li" delay={2}> → retardo = delay × 70 ms.
 */
type RevealProps = {
  as?: ElementType;
  /** Posición en un grupo escalonado (0–5). */
  delay?: number;
  className?: string;
  children: ReactNode;
};

const STEP_MS = 70;

export function Reveal({ as: Tag = "div", delay = 0, className, children }: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (typeof IntersectionObserver === "undefined") {
      node.classList.add("is-visible");
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const style: CSSProperties | undefined = delay
    ? { transitionDelay: `${Math.min(delay, 5) * STEP_MS}ms` }
    : undefined;

  return (
    <Tag ref={ref} data-reveal className={className} style={style}>
      {children}
    </Tag>
  );
}
