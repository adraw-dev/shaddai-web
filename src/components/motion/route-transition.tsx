"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type CSSProperties } from "react";

/**
 * Transición entre páginas (plan §5.5, «Navegación entre páginas»): velo rojo difuminado con una
 * taza de café dibujada a trazo (SVG propio) que se dibuja sola, suelta vapor y oscila en 2.5D.
 * La navegación NO se bloquea: el clic sigue su curso (next/link) y el velo solo cubre el cambio.
 *
 *   clic en enlace interno → fase "in" (aparece el velo y se dibuja la taza)
 *   cambia la ruta y pasó el mínimo → fase "out" (se retira) → "idle"
 *
 * Reglas:
 *  - Solo enlaces internos a OTRA ruta (mismo origen, sin modificadores, sin target/download).
 *    Un ancla en la misma página (#…) no lo muestra.
 *  - `prefers-reduced-motion: reduce` → no se muestra (navegación directa). Sin JS no existe.
 *  - Atrás/adelante del navegador no lo muestran (no hay clic).
 *  - Si la ruta no cambia (navegación fallida/cancelada), se retira solo tras FAILSAFE_MS.
 *  - Decorativo: `aria-hidden`; el anuncio de la nueva página lo hace el enrutador de Next.
 */

type Phase = "idle" | "in" | "out";

/** Tiempo mínimo visible: deja terminar el dibujo de la taza sin frenar de más la navegación. */
const MIN_VISIBLE_MS = 750;
/** Debe coincidir con la duración de salida en globals.css (`.route-veil[data-phase="out"] …`). */
const EXIT_MS = 280;
const FAILSAFE_MS = 4000;

/*
 * Taza a trazo (viewBox 200×220). `pathLength=1` normaliza la longitud para animar el dibujo con
 * `stroke-dashoffset` 1 → 0. `--d` = orden de aparición. Tres capas para la profundidad 2.5D:
 * sombra (atrás), taza (centro), vapor (adelante).
 */
const CUP_STROKES = [
  { d: "M30 178 C 66 192, 134 192, 170 178", w: 7, order: 0 }, // plato
  { d: "M66 190 C 88 197, 112 197, 134 190", w: 4.5, order: 1 }, // base del plato
  { d: "M48 104 C 48 146, 72 166, 100 166 C 128 166, 152 146, 152 104", w: 7.5, order: 2 }, // cuerpo
  { d: "M48 104 C 72 115, 128 115, 152 104", w: 6, order: 3 }, // borde delantero
  { d: "M58 100 C 82 92, 120 92, 142 100", w: 3.5, order: 3, faint: true }, // borde trasero
  { d: "M151 116 C 178 106, 186 138, 158 148 C 149 151, 145 144, 152 140", w: 6.5, order: 4 }, // asa
];

const STEAM_STROKES = [
  { d: "M80 92 C 66 78, 94 68, 82 52 C 72 40, 90 30, 84 18", w: 5, order: 0 },
  { d: "M101 88 C 88 72, 116 62, 103 44 C 93 30, 113 20, 105 6", w: 6, order: 1 },
  { d: "M122 92 C 110 78, 136 70, 124 54 C 116 44, 130 36, 126 26", w: 4.5, order: 2 },
];

function isInternalNavigation(event: MouseEvent): URL | null {
  if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return null;
  const anchor = (event.target as Element | null)?.closest?.("a[href]");
  if (!(anchor instanceof HTMLAnchorElement)) return null;
  if (anchor.target && anchor.target !== "_self") return null;
  if (anchor.hasAttribute("download")) return null;

  const url = new URL(anchor.href, window.location.href);
  if (url.origin !== window.location.origin) return null; // externos, wa.me, tel:, mailto:
  if (url.pathname === window.location.pathname) return null; // misma página (anclas)
  return url;
}

export function RouteTransition() {
  const pathname = usePathname();
  const [phase, setPhase] = useState<Phase>("idle");
  const startedAt = useRef(0);
  const fromPath = useRef(pathname);
  const timers = useRef<number[]>([]);

  const clearTimers = () => {
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current = [];
  };

  const retire = (delay: number) => {
    clearTimers();
    timers.current.push(
      window.setTimeout(() => {
        setPhase("out");
        timers.current.push(window.setTimeout(() => setPhase("idle"), EXIT_MS));
      }, delay),
    );
  };

  // Clic en un enlace interno → aparece el velo (la navegación continúa sola).
  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    const onClick = (event: MouseEvent) => {
      if (reduceMotion.matches) return;
      if (!isInternalNavigation(event)) return;
      clearTimers();
      startedAt.current = performance.now();
      fromPath.current = window.location.pathname;
      setPhase("in");
      timers.current.push(window.setTimeout(() => retire(0), FAILSAFE_MS));
    };

    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("click", onClick);
      clearTimers();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- `retire`/`clearTimers` solo usan refs
  }, []);

  // La ruta cambió → se retira cuando haya cumplido el tiempo mínimo.
  useEffect(() => {
    if (phase !== "in" || pathname === fromPath.current) return;
    const elapsed = performance.now() - startedAt.current;
    retire(Math.max(0, MIN_VISIBLE_MS - elapsed));
    // eslint-disable-next-line react-hooks/exhaustive-deps -- solo debe reaccionar al cambio de ruta
  }, [pathname, phase]);

  return (
    <div aria-hidden="true" data-phase={phase} className="route-veil">
      {/* Capa propia para el difuminado: con hijos en 3D en el mismo elemento, Chrome móvil lo omite. */}
      <span className="route-veil__blur" />
      <div className="route-veil__stage">
        <span className="route-veil__halo" />
        <div className="route-veil__rig">
          <span className="route-veil__shadow" />
          <svg viewBox="0 0 200 220" className="route-veil__layer route-veil__layer--cup">
            {CUP_STROKES.map((s) => (
              <path
                key={s.d}
                d={s.d}
                pathLength={1}
                strokeWidth={s.w}
                className={s.faint ? "route-veil__draw route-veil__draw--faint" : "route-veil__draw"}
                style={{ "--d": s.order } as CSSProperties}
              />
            ))}
          </svg>
          <svg viewBox="0 0 200 220" className="route-veil__layer route-veil__layer--steam">
            {STEAM_STROKES.map((s) => (
              <path
                key={s.d}
                d={s.d}
                pathLength={1}
                strokeWidth={s.w}
                className="route-veil__steam"
                style={{ "--d": s.order } as CSSProperties}
              />
            ))}
          </svg>
        </div>
      </div>
    </div>
  );
}
