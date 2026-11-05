"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Escenario 2.5D del hero: perspectiva real (CSS) + profundidad que responde al puntero.
 *
 * Técnica de la skill `add-mouse-driven-orbit`, sin WebGL: el puntero solo registra una intención
 * normalizada (−1…1); un bucle de fotogramas la amortigua (`alpha = 1 − 0.945^(dt·60)`, dt ≤ 1/30 s) y
 * publica `--px` / `--py` en el escenario. El CSS (`.rig`) convierte esos dos números en una
 * inclinación pequeña de toda la escena; como cada capa tiene su propio `translateZ`, la
 * perspectiva las separa sola (paralaje real, sin mover cada capa a mano).
 *
 * Reglas:
 *  - Solo puntero fino (ratón/lápiz con hover). En táctil la escena queda en su pose de reposo.
 *  - `prefers-reduced-motion`: pose fija diseñada (x = .28, y = −.12), sin interpolación.
 *  - El bucle solo corre mientras el escenario es visible y hasta que el valor se asienta.
 *  - No lee el layout en `pointermove` (solo `innerWidth/innerHeight`, cacheados en resize).
 * Los hijos son decorativos o contenido ya renderizado en el servidor (no se pierde SSR).
 */
export function HeroStage({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      node.style.setProperty("--px", "0.28");
      node.style.setProperty("--py", "-0.12");
      return;
    }
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const target = { x: 0, y: 0 };
    const smooth = { x: 0, y: 0 };
    let published = { x: 0, y: 0 };
    let width = window.innerWidth;
    let height = window.innerHeight;
    let frame = 0;
    let last = 0;
    let visible = true;

    const tick = (now: number) => {
      frame = 0;
      const dt = Math.min((now - last) / 1000 || 1 / 60, 1 / 30);
      last = now;
      const alpha = 1 - Math.pow(1 - 0.055, dt * 60);
      smooth.x += (target.x - smooth.x) * alpha;
      smooth.y += (target.y - smooth.y) * alpha;

      const x = Math.round(smooth.x * 1000) / 1000;
      const y = Math.round(smooth.y * 1000) / 1000;
      if (x !== published.x || y !== published.y) {
        published = { x, y };
        node.style.setProperty("--px", String(x));
        node.style.setProperty("--py", String(y));
      }

      const settled =
        Math.abs(target.x - smooth.x) < 0.0005 && Math.abs(target.y - smooth.y) < 0.0005;
      if (!settled && visible) frame = requestAnimationFrame(tick);
    };

    const wake = () => {
      if (frame || !visible) return;
      last = performance.now();
      frame = requestAnimationFrame(tick);
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      target.x = (event.clientX / width) * 2 - 1;
      target.y = (event.clientY / height) * 2 - 1;
      wake();
    };
    const onLeave = () => {
      target.x = 0;
      target.y = 0;
      wake();
    };
    const onResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
    };

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) wake();
      else if (frame) {
        cancelAnimationFrame(frame);
        frame = 0;
      }
    });
    observer.observe(node);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", onResize);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
