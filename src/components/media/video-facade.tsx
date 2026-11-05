"use client";

import { useState } from "react";
import { PlayIcon } from "@/components/icons";

/**
 * Fachada de video: no se carga NADA de YouTube hasta que el usuario lo pide (rendimiento y
 * privacidad). Usa `youtube-nocookie.com`. Es un <button> real: accesible por teclado, con
 * nombre descriptivo. La miniatura es local (opcional) para no hacer peticiones a terceros al cargar.
 * Se verifica en F3-06 con la miniatura definitiva.
 */
type VideoFacadeProps = {
  videoId: string;
  /** Título accesible del video (se usa en el botón y en el iframe). */
  title: string;
  /** Miniatura local opcional; si falta se muestra un fondo de marca. */
  posterSrc?: string;
  className?: string;
};

export function VideoFacade({ videoId, title, posterSrc, className }: VideoFacadeProps) {
  const [active, setActive] = useState(false);

  return (
    <div className={`relative aspect-video w-full overflow-hidden rounded-card bg-mocha-700 bg-gradient-to-br from-mocha-900 via-mocha-700 to-[#8a4e45] ${className ?? ""}`}>
      {active ? (
        <iframe
          className="absolute inset-0 size-full"
          src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          onClick={() => setActive(true)}
          aria-label={`Reproducir video: ${title}`}
          className="group absolute inset-0 flex size-full items-center justify-center"
        >
          {posterSrc ? (
            <img src={posterSrc} alt="" loading="lazy" decoding="async" className="absolute inset-0 size-full object-cover" />
          ) : null}
          <span className="relative inline-flex size-16 items-center justify-center rounded-full bg-accent text-cream-50 shadow-raised ring-4 ring-cream-50/40 transition-[background-color,scale] duration-150 ease-ui group-hover:bg-accent-strong group-active:scale-[0.96] sm:size-20">
            <PlayIcon size={32} className="ml-1" />
          </span>
        </button>
      )}
    </div>
  );
}
