import { WhatsAppIcon } from "@/components/icons";
import { Picture } from "@/components/media/picture";
import { WordReveal } from "@/components/motion/word-reveal";
import { LinkButton } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Section } from "@/components/ui/section";
import { Text } from "@/components/ui/text";
import { homeContent } from "@/content/home";

type HeroProps = {
  quoteUrl: string;
  catalogUrl: string;
};

/**
 * Hero: promesa + acción primaria. Un solo punto focal por viewport.
 * La foto es la imagen candidata a LCP (priority) y se recorta en móvil para no empujar el CTA.
 * El título entra palabra por palabra una vez al cargar (WordReveal, solo CSS).
 */
export function Hero({ quoteUrl, catalogUrl }: HeroProps) {
  const { hero } = homeContent;

  return (
    <Section tone="brand" size="hero" labelledBy="hero-title">
      <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
        <div className="space-y-8">
          <Heading level={1} size="display" id="hero-title">
            <WordReveal text={hero.title} />
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

        <Picture
          media={hero.image}
          sizes="(min-width: 1024px) 480px, (min-width: 640px) 90vw, 100vw"
          priority
          className="aspect-[5/4] w-full rounded-card object-cover outline-1 -outline-offset-1 outline-white/10 lg:aspect-square"
        />
      </div>
    </Section>
  );
}
