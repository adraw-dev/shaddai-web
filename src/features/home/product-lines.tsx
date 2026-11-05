import { Picture } from "@/components/media/picture";
import { Reveal } from "@/components/motion/reveal";
import { LinkButton } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Section } from "@/components/ui/section";
import { Text } from "@/components/ui/text";
import { homeContent } from "@/content/home";
import type { ProductLine } from "@/domain/catalog";

type ProductLinesProps = {
  lines: ProductLine[];
  catalogUrl: string;
};

/**
 * Líneas destacadas. NO es una rejilla de tarjetas iguales: encabezado y acción a la izquierda,
 * lista editorial a la derecha (imagen + nombre + descripción separados por filetes).
 * Las imágenes se muestran por debajo de su tamaño nativo (320 px) para verse nítidas.
 */
export function ProductLines({ lines, catalogUrl }: ProductLinesProps) {
  const { lines: copy } = homeContent;

  return (
    <Section tone="cream" id="productos" labelledBy="lineas-title">
      <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
        <div className="space-y-6 lg:pt-4">
          <Heading id="lineas-title">{copy.title}</Heading>
          <Text variant="lead" muted>
            {copy.intro}
          </Text>
          <LinkButton href={catalogUrl} size="lg">
            {copy.cta}
          </LinkButton>
        </div>

        <ul className="divide-y divide-ink/15">
          {lines.map((line, index) => (
            <Reveal
              as="li"
              key={line.slug}
              delay={index}
              className="grid grid-cols-[7rem_1fr] items-center gap-6 py-8 first:pt-0 last:pb-0 sm:grid-cols-[11rem_1fr] sm:gap-10"
            >
              <Picture media={line.image} sizes="(min-width: 640px) 176px, 112px" className="w-full" />
              <div className="space-y-2">
                <Heading level={3}>{line.name}</Heading>
                <Text muted>{line.description}</Text>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </Section>
  );
}
