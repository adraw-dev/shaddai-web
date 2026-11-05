/** Primer elemento enfocable de la página: permite saltar la navegación con teclado. */
export function SkipLink() {
  return (
    <a
      href="#contenido"
      className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:rounded-control focus:bg-cream-50 focus:px-4 focus:py-3 focus:font-semibold focus:text-espresso-900 focus:shadow-raised"
    >
      Saltar al contenido
    </a>
  );
}
