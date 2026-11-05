import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Marco 2.5D: la imagen/video va sobre dos placas de degradado ligeramente giradas y desplazadas
 * (profundidad por capas). Con hover real las placas se abren un poco. Solo CSS (globals.css:
 * `.depth-frame*`), sin JS. Las placas son decorativas (aria-hidden).
 */
export function DepthFrame({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("depth-frame", className)}>
      <span className="depth-frame__plate depth-frame__plate--back" aria-hidden="true" />
      <span className="depth-frame__plate depth-frame__plate--mid" aria-hidden="true" />
      <div className="depth-frame__face">{children}</div>
    </div>
  );
}
