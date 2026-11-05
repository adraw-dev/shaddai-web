"use client";

import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Tarjeta con inclinación 2.5D y brillo que sigue al puntero (patrón «Card hover tilt» de
 * transitions-dev). Solo decorativa: no es interactiva ni cambia el contenido.
 * - Mouse/lápiz: el puntero escribe --tx/--ty (−1…1) y --gx/--gy (0…1); el CSS (`.tilt`) inclina la
 *   tarjeta ≤ 7° y levanta lo marcado con `.tilt__pop` (translateZ). Solo con hover real y sin
 *   `prefers-reduced-motion` (globals.css); en táctil o con movimiento reducido no hay efecto.
 * - El rectángulo se mide una sola vez al entrar el puntero (no en cada movimiento).
 */
export function TiltCard({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const rect = useRef<DOMRect | null>(null);

  const onEnter = () => {
    rect.current = ref.current?.getBoundingClientRect() ?? null;
  };

  const onMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const node = ref.current;
    const box = rect.current;
    if (!node || !box || event.pointerType === "touch") return;
    const x = (event.clientX - box.left) / box.width;
    const y = (event.clientY - box.top) / box.height;
    node.style.setProperty("--tx", (x * 2 - 1).toFixed(3));
    node.style.setProperty("--ty", (y * 2 - 1).toFixed(3));
    node.style.setProperty("--gx", x.toFixed(3));
    node.style.setProperty("--gy", y.toFixed(3));
  };

  const onLeave = () => {
    const node = ref.current;
    if (!node) return;
    node.style.setProperty("--tx", "0");
    node.style.setProperty("--ty", "0");
  };

  return (
    <div
      ref={ref}
      className={cn("tilt", className)}
      onPointerEnter={onEnter}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      {children}
      <span className="tilt__glare" aria-hidden="true" />
    </div>
  );
}
