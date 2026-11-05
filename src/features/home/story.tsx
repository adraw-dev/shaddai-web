import type { CSSProperties } from "react";
import { Picture } from "@/components/media/picture";
import { VideoFacade } from "@/components/media/video-facade";
import { DepthFrame } from "@/components/ui/depth-frame";
import { Heading } from "@/components/ui/heading";
import { Section } from "@/components/ui/section";
import { Text } from "@/components/ui/text";
import { homeContent } from "@/content/home";

/**
 * Nuestra historia: origen de la empresa (máquinas → insumos) y video con fachada (no carga nada
 * de YouTube hasta que el usuario lo pide). La frase poética del grano (D-07) solo se muestra
 * cuando el cliente entregue su texto literal.
 */
export function Story() {
  const { story } = homeContent;

  return (
    <Section tone="cream-warm" sheet id="nosotros" labelledBy="historia-title">
      <div className="grid items-center gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-20">
        <div className="space-y-6">
          <Heading id="historia-title">{story.title}</Heading>
          {story.paragraphs.map((paragraph) => (
            <Text key={paragraph} variant="lead">
              {paragraph}
            </Text>
          ))}
          {story.poeticPhrase ? (
            <p className="font-display text-h3 font-medium text-espresso-900">{story.poeticPhrase}</p>
          ) : null}
        </div>

        <div className="relative mb-5 lg:mb-0">
          <DepthFrame className="mr-5 mb-5 lg:mr-0 lg:mb-0">
            <VideoFacade videoId={story.video.id} title={story.video.title} />
          </DepthFrame>
          {/* Foto de banco que se asoma sobre la esquina del marco (2.5D): flota suave; ilustrativa. */}
          <div
            className="float-slow absolute -top-10 right-3 z-10 w-24 md:w-32 lg:-top-12 lg:-right-8"
            style={{ "--float-amp": "7px", "--float-rot": "1.5deg", "--float-dur": "9s" } as CSSProperties}
          >
            <div className="rotate-6">
              <Picture
                media={story.accentImage}
                sizes="(min-width: 768px) 144px, 112px"
                className="aspect-[3/4] w-full rounded-2xl object-cover ring-4 ring-cream-50 shadow-[0_26px_36px_-18px_rgb(90_58_52/0.6)]"
              />
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
