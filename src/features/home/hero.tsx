import type { CSSProperties } from "react";
import { WhatsAppIcon } from "@/components/icons";
import { Picture } from "@/components/media/picture";
import { Aurora } from "@/components/motion/aurora";
import { HeroStage } from "@/components/motion/hero-stage";
import { WordReveal } from "@/components/motion/word-reveal";
import { LinkButton } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Section } from "@/components/ui/section";
import { Text } from "@/components/ui/text";
import { homeContent } from "@/content/home";
import type { Channel, ProductLine } from "@/domain/catalog";

type HeroProps = {
  quoteUrl: string;
  catalogUrl: string;
  lines: ProductLine[];
  channels: Channel[];
};

/** Variables por capa: profundidad (z), orden de entrada (i) y flotación (amplitud, giro, duración, desfase). */
const layer = (z: number, i: number, amp: number, rot: number, dur: number, delay = 0) =>
  ({
    "--z": `${z}px`,
    "--i": i,
    "--float-amp": `${amp}px`,
    "--float-rot": `${rot}deg`,
    "--float-dur": `${dur}s`,
    "--float-delay": `${-delay}s`,
  }) as CSSProperties;

/**
 * Hero «Aurora 2.5D» (Propuesta B). Un solo punto focal: el título y, al lado, un escenario con
 * profundidad falsa (perspectiva + translateZ): disco esmaltado al fondo, foto inclinada, tres tazas
 * recortadas flotando a distinta altura, chips de canales y granos. Todo es decorativo salvo la foto
 * (candidata a LCP) y el texto. Entrada escalonada por CSS, flotación continua y paralaje con el
 * puntero (<HeroStage>); con movimiento reducido queda una pose fija. Debajo, una cinta en marcha.
 */
export function Hero({ quoteUrl, catalogUrl, lines, channels }: HeroProps) {
  const { hero } = homeContent;
  const [latte, cafe, capu] = lines;
  const cup = (line: ProductLine | undefined) => (line ? { ...line.image, alt: "" } : null);
  const ribbonItems = [...lines.map((l) => l.name), ...channels.map((c) => c.name)];

  return (
    <Section
      tone="aurora"
      size="hero"
      underHeader
      labelledBy="hero-title"
      contained={false}
      className="relative isolate overflow-hidden"
    >
      <Aurora />

      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_1fr] lg:gap-8">
          <div className="space-y-8">
            <Heading level={1} size="display" id="hero-title" className="text-espresso-900">
              <WordReveal text={hero.title} highlight={hero.highlight} />
            </Heading>
            <Text variant="lead" muted className="max-w-xl">
              {hero.lead}
            </Text>
            <div className="flex flex-wrap gap-3">
              <LinkButton href={quoteUrl} size="lg">
                <WhatsAppIcon size={22} />
                {hero.quoteCta}
              </LinkButton>
              <LinkButton href={catalogUrl} variant="secondary" size="lg">
                {hero.catalogCta}
              </LinkButton>
            </div>
          </div>

          <div className="stage">
            <HeroStage className="size-full">
              <div className="rig">
                {/* Fondo: disco esmaltado + anillo punteado que gira lentamente */}
                <div className="ring layer left-[2%] top-[4%] w-[96%] aspect-square" style={layer(-140, 0, 0, 0, 1)} aria-hidden="true" />
                <div className="plate layer left-[9%] top-[10%] w-[80%] aspect-square" style={layer(-70, 1, 8, 1, 9)} aria-hidden="true" />

                {/* Foto real (LCP) en tarjeta inclinada */}
                <div
                  className="photo-card layer left-[27%] top-[12%] w-[48%] aspect-[4/5]"
                  style={layer(0, 2, 7, 0.8, 8, 2)}
                >
                  <Picture
                    media={hero.image}
                    sizes="(min-width: 1024px) 250px, 45vw"
                    priority
                    className="absolute inset-0 size-full! object-cover"
                  />
                </div>

                {/* Tazas recortadas a tres alturas */}
                {cup(latte) ? (
                  <div className="cup layer left-[-1%] top-[6%] w-[35%]" style={layer(90, 3, 12, 3, 6.5, 1)} aria-hidden="true">
                    <Picture media={cup(latte)!} sizes="(min-width: 1024px) 140px, 35vw" eager />
                  </div>
                ) : null}
                {cup(cafe) ? (
                  <div className="cup layer left-[7%] top-[56%] w-[42%]" style={layer(150, 4, 14, -3, 7.5, 3)} aria-hidden="true">
                    <Picture media={cup(cafe)!} sizes="(min-width: 1024px) 170px, 42vw" eager />
                  </div>
                ) : null}
                {cup(capu) ? (
                  <div className="cup layer left-[62%] top-[50%] w-[37%]" style={layer(115, 5, 11, 4, 6, 2)} aria-hidden="true">
                    <Picture media={cup(capu)!} sizes="(min-width: 1024px) 150px, 37vw" eager />
                  </div>
                ) : null}

                {/* Chips de canales (decorativos: el detalle está en la sección Canales) */}
                {channels.slice(0, 4).map((channel, index) => {
                  const spots = [
                    "left-[58%] top-[4%]",
                    "left-[66%] top-[34%]",
                    "left-[0%] top-[40%]",
                    "left-[44%] top-[90%]",
                  ];
                  return (
                    <span
                      key={channel.slug}
                      className={`chip layer ${spots[index]}`}
                      style={layer(170 + index * 18, 6 + index, 9, 2, 5.5 + index * 0.7, index)}
                      aria-hidden="true"
                    >
                      {channel.name}
                    </span>
                  );
                })}

                {/* Granos de café sueltos a distintas profundidades */}
                <span className="bean layer left-[46%] top-[0%]" style={layer(210, 10, 12, 18, 5)} aria-hidden="true" />
                <span className="bean layer left-[88%] top-[24%]" style={layer(120, 11, 10, 22, 6.2, 1)} aria-hidden="true" />
                <span className="bean layer left-[22%] top-[90%]" style={layer(190, 12, 9, 16, 5.4, 2)} aria-hidden="true" />
                <span className="bean layer left-[90%] top-[82%]" style={layer(60, 13, 8, 20, 6.8, 3)} aria-hidden="true" />
                <span className="bean layer left-[56%] top-[72%]" style={layer(230, 14, 11, 14, 4.8, 1)} aria-hidden="true" />
              </div>
            </HeroStage>
          </div>
        </div>
      </Container>

      {/* Cinta en marcha: nombres de líneas y canales (decorativa; aria-hidden) */}
      <div className="mt-14 md:mt-20" aria-hidden="true">
        <div className="ribbon">
          <div className="ribbon__track">
            {[0, 1].map((copy) => (
              <div key={copy} className="ribbon__group">
                {ribbonItems.flatMap((name, index) => [
                  <span key={`${name}-${index}`}>{name}</span>,
                  <span key={`dot-${index}`} />,
                ])}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
