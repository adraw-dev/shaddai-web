import type { CSSProperties } from "react";
import { Picture } from "@/components/media/picture";
import { Reveal } from "@/components/motion/reveal";
import { TiltCard } from "@/components/motion/tilt-card";
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
 * Degradado de cada tarjeta por línea (solo estilo). Texto: tinta/espresso-700 sobre pasteles
 * (≥ 5:1 en el tono más oscuro, damasco).
 */
const tints: Record<string, string> = {
  lattes: "from-butter-200 via-peach-100 to-rose-200",
  cafe: "from-latte-200 via-peach-200 to-apricot-300",
  capuccinos: "from-rose-200 via-peach-200 to-butter-200",
};
const fallbackTint = "from-peach-100 to-peach-200";

/**
 * Líneas destacadas (Propuesta B). Tres «escenarios» de degradado distinto con la taza recortada que
 * sale de la tarjeta (2.5D: la taza vive a más altura que el fondo y flota). El escalón vertical de la
 * tarjeta central rompe la rejilla uniforme. Con puntero fino, cada tarjeta se inclina y la taza se
 * levanta (<TiltCard>); en táctil y con movimiento reducido quedan quietas.
 */
export function ProductLines({ lines, catalogUrl }: ProductLinesProps) {
  const { lines: copy } = homeContent;

  return (
    <Section tone="cream" sheet id="productos" labelledBy="lineas-title">
      <div className="grid gap-8 lg:grid-cols-2 lg:items-end lg:gap-20">
        <Heading id="lineas-title">{copy.title}</Heading>
        <div className="space-y-6">
          <Text variant="lead" muted>
            {copy.intro}
          </Text>
          <LinkButton href={catalogUrl} size="lg">
            {copy.cta}
          </LinkButton>
        </div>
      </div>

      <ul className="mt-24 grid gap-x-8 gap-y-24 md:grid-cols-3">
        {lines.map((line, index) => (
          <Reveal as="li" key={line.slug} delay={index} className={index === 1 ? "md:mt-14" : undefined}>
            <TiltCard className="h-full rounded-[2rem]">
              <article
                className={`relative h-full rounded-[2rem] bg-gradient-to-br ${tints[line.slug] ?? fallbackTint} px-7 pb-9 pt-36 ring-1 ring-white/70 shadow-[inset_0_1px_0_rgb(255_255_255/0.9),0_34px_50px_-30px_rgb(122_52_28/0.55)]`}
              >
                <div
                  className="tilt__pop cup float-slow absolute inset-x-0 -top-14 mx-auto w-48"
                  style={{ "--float-delay": `${-index * 1.7}s`, "--float-amp": "8px", "--float-rot": "2deg", "--float-dur": `${7 + index}s` } as CSSProperties}
                >
                  <Picture media={line.image} sizes="192px" />
                </div>
                <div className="space-y-2">
                  <Heading level={3} className="text-espresso-900">
                    {line.name}
                  </Heading>
                  <Text className="text-espresso-700">{line.description}</Text>
                </div>
              </article>
            </TiltCard>
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}
