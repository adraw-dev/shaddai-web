/**
 * Fondo «aurora»: tres manchas de degradado que derivan muy despacio detrás del contenido.
 * Decorativo (aria-hidden), sin JS. Solo anima `transform`; con `prefers-reduced-motion` queda quieto
 * y, en navegadores con `animation-timeline`, se desplaza un poco con el scroll (globals.css).
 * Debe ir dentro de una sección con `relative isolate overflow-hidden`.
 */
export function Aurora() {
  return (
    <div className="aurora" aria-hidden="true">
      <span className="aurora__blob aurora__blob--a" />
      <span className="aurora__blob aurora__blob--b" />
      <span className="aurora__blob aurora__blob--c" />
    </div>
  );
}
