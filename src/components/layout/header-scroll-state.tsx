"use client";

import { useEffect, useRef } from "react";

/**
 * Marca el header (`data-scrolled`) cuando la página deja de estar arriba, para darle una sombra
 * que lo separe del contenido. Usa un IntersectionObserver sobre un centinela de 1 px: no hay
 * listener de scroll ni trabajo por fotograma. Sin JS el header simplemente no lleva sombra.
 */
export function HeaderScrollState() {
  const sentinel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const header = document.querySelector<HTMLElement>("header[data-site-header]");
    const node = sentinel.current;
    if (!header || !node || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(([entry]) => {
      header.toggleAttribute("data-scrolled", !entry.isIntersecting);
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return <div ref={sentinel} aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-px" />;
}
