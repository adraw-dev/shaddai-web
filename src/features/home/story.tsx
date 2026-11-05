import { VideoFacade } from "@/components/media/video-facade";
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
    <Section tone="cream-warm" id="nosotros" labelledBy="historia-title">
      <div className="grid items-center gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-20">
        <div className="space-y-6">
          <Heading id="historia-title">{story.title}</Heading>
          {story.paragraphs.map((paragraph) => (
            <Text key={paragraph} variant="lead">
              {paragraph}
            </Text>
          ))}
          {story.poeticPhrase ? (
            <p className="font-display text-h3 font-medium text-brand-900">{story.poeticPhrase}</p>
          ) : null}
        </div>

        <VideoFacade videoId={story.video.id} title={story.video.title} />
      </div>
    </Section>
  );
}
