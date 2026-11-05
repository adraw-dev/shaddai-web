import { Picture } from "@/components/media/picture";
import { Reveal } from "@/components/motion/reveal";
import { DepthFrame } from "@/components/ui/depth-frame";
import { Heading } from "@/components/ui/heading";
import { Section } from "@/components/ui/section";
import { Text } from "@/components/ui/text";
import { homeContent } from "@/content/home";

/**
 * «La mejor taza servida»: propuesta de valor + procesos BPM + mensaje de «café fresco».
 * Los tres pilares son frases tipográficas (el MD solo da sus etiquetas: no se inventan descripciones
 * ni se ponen en tarjetas con ícono). «Procesos BPM» se dice en texto; no se dibuja un sello porque
 * eso insinuaría una certificación que el MD no menciona.
 */
export function ValueProp() {
  const { quality: copy } = homeContent;

  return (
    <Section tone="cream" sheet id="calidad" labelledBy="calidad-title">
      <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <div className="space-y-6">
          <Heading id="calidad-title">{copy.title}</Heading>
          <Text variant="lead">{copy.intro}</Text>
          <Text muted>{copy.bpm}</Text>
          <Text muted>{copy.passion}</Text>
        </div>

        <ul className="divide-y divide-ink/15 border-y border-ink/15">
          {copy.pillars.map((pillar, index) => (
            <Reveal
              as="li"
              key={pillar}
              delay={index}
              className="py-6 font-display text-h2 font-bold tracking-[-0.02em] text-gradient-static"
            >
              {pillar}
            </Reveal>
          ))}
        </ul>
      </div>

      <div className="mt-16 grid items-center gap-10 md:mt-24 md:grid-cols-[minmax(0,20rem)_1fr] md:gap-16">
        <DepthFrame className="mr-5 mb-5 md:mr-0 md:mb-0">
          <Picture
            media={copy.image}
            sizes="(min-width: 768px) 320px, 100vw"
            className="aspect-[5/4] w-full object-cover md:aspect-square"
          />
        </DepthFrame>
        <p className="font-display text-h3 font-medium text-espresso-900">{copy.freshCoffee}</p>
      </div>
    </Section>
  );
}
