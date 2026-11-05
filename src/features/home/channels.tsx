import { WhatsAppIcon } from "@/components/icons";
import { Picture } from "@/components/media/picture";
import { Reveal } from "@/components/motion/reveal";
import { ArrowLink } from "@/components/ui/arrow-link";
import { LinkButton } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Section } from "@/components/ui/section";
import { Text } from "@/components/ui/text";
import { homeContent } from "@/content/home";
import { channelInquiryMessage } from "@/content/whatsapp-messages";
import type { Channel } from "@/domain/catalog";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

type ChannelsProps = {
  channels: Channel[];
};

/**
 * Canales comerciales. Jerarquía real, no tarjetas iguales: HORECA es el único canal con detalle en
 * el MD y ocupa un panel grande; VENDING, MAQUILA y RETAIL son paneles compactos (definición de una
 * línea, sin inventar descripciones — D-13). Un canal sin página válida (`href` ausente) ofrece
 * consulta por WhatsApp en lugar de un enlace roto.
 * Propuesta B: banda «dusk» (degradado profundo y suave) con dos discos de luz que flotan detrás y
 * paneles translúcidos en degradado. Los discos son decorativos (aria-hidden, detrás del contenido).
 */
export function Channels({ channels }: ChannelsProps) {
  const { channels: copy } = homeContent;
  const featured = channels.find((c) => c.slug === "horeca");
  const others = channels.filter((c) => c.slug !== "horeca");

  return (
    <Section tone="dusk" sheet id="canales" labelledBy="canales-title" className="isolate overflow-hidden">
      <span
        aria-hidden="true"
        className="float-slow pointer-events-none absolute -top-10 -right-24 -z-10 size-80 rounded-full bg-[radial-gradient(circle_at_35%_30%,rgb(255_156_136/0.3),transparent_70%)]"
      />
      <span
        aria-hidden="true"
        style={{ "--float-delay": "-3s", "--float-dur": "11s" } as React.CSSProperties}
        className="float-slow pointer-events-none absolute -bottom-24 -left-20 -z-10 size-96 rounded-full bg-[radial-gradient(circle_at_60%_40%,rgb(217_154_99/0.32),transparent_68%)]"
      />

      <div className="max-w-3xl space-y-5">
        <Heading id="canales-title">{copy.title}</Heading>
        <Text variant="lead" muted>
          {copy.intro}
        </Text>
      </div>

      <div className="mt-14 grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10">
        {featured ? (
          <Reveal
            as="article"
            className="overflow-hidden rounded-[2rem] border border-cream-50/15 bg-gradient-to-br from-cream-50/8 to-cream-50/2 shadow-[inset_0_1px_0_rgb(255_255_255/0.14),0_30px_50px_-30px_rgb(0_0_0/0.6)]"
          >
            <Picture
              media={copy.featuredImage}
              sizes="(min-width: 1024px) 560px, 100vw"
              className="aspect-[16/9] w-full object-cover"
            />
            <div className="space-y-6 p-7 md:p-10">
              <div className="space-y-2">
                <Heading level={3} className="text-butter-200">
                  {featured.name}
                </Heading>
                <p className="text-lead">{featured.shortDescription}</p>
              </div>
              {featured.description ? <Text>{featured.description}</Text> : null}
              {featured.highlights ? (
                <ul className="list-disc space-y-1.5 pl-5 marker:text-butter-200">
                  {featured.highlights.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : null}
              {featured.href ? (
                <LinkButton href={featured.href} variant="secondary" size="lg">
                  {copy.featuredLinkLabel}
                </LinkButton>
              ) : null}
            </div>
          </Reveal>
        ) : null}

        <ul className="space-y-4">
          {others.map((channel, index) => (
            <Reveal
              as="li"
              key={channel.slug}
              delay={index}
              className="space-y-1 rounded-card border border-cream-50/12 bg-gradient-to-br from-cream-50/8 to-cream-50/2 px-6 py-5 shadow-[inset_0_1px_0_rgb(255_255_255/0.1)]"
            >
              <Heading level={3}>{channel.name}</Heading>
              <Text muted>{channel.shortDescription}</Text>
              {channel.href ? (
                <ArrowLink href={channel.href}>{copy.linkLabel}</ArrowLink>
              ) : (
                <ArrowLink href={buildWhatsAppUrl(channelInquiryMessage(channel.name))}>
                  <WhatsAppIcon size={18} />
                  {copy.inquiryLabel}
                </ArrowLink>
              )}
            </Reveal>
          ))}
        </ul>
      </div>
    </Section>
  );
}
