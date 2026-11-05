/**
 * Entrada palabra por palabra del título del hero, UNA vez al cargar (plan §5.5; skill
 * `staggered-word-reveal`: +20 px, 0.7 s, ease-out expo, 60 ms entre palabras).
 *
 * Diferencia deliberada con la skill: es CSS puro (animación al cargar + `backwards`), sin
 * IntersectionObserver ni estado oculto dependiente de JS. El título está en el viewport desde el
 * primer pintado, así que no hace falta observar nada; sin JS se ve completo; y no retrasa el LCP
 * esperando la hidratación. Es un componente de servidor.
 *
 * Accesibilidad: el texto sigue siendo texto real (las palabras son <span> separados por espacios
 * normales), así que los lectores de pantalla lo leen igual. `prefers-reduced-motion`: la regla
 * global de globals.css reduce la animación a ~0 ms.
 * Solo para textos CORTOS (títulos) y sin enlaces ni marcado interno.
 *
 * `highlight`: palabras que llevan el degradado cálido (`.text-gradient-warm`, Propuesta B). El
 * degradado va en un <span> interior para no pisar la animación de entrada de la palabra.
 */
export function WordReveal({ text, highlight = [] }: { text: string; highlight?: readonly string[] }) {
  const words = text.split(" ");
  return (
    <>
      {words.map((word, index) => (
        <span key={`${word}-${index}`}>
          <span className="word-reveal__word" style={{ "--word-index": index } as React.CSSProperties}>
            {highlight.includes(word) ? <span className="text-gradient-warm">{word}</span> : word}
          </span>
          {index < words.length - 1 ? " " : null}
        </span>
      ))}
    </>
  );
}
