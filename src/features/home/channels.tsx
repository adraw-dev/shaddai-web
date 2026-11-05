import { WhatsAppIcon } from "@/components/icons";
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
 * el MD y ocupa la columna principal; VENDING, MAQUILA y RETAIL son filas compactas (definición de
 * una línea, sin inventar descripciones — D-13). Un canal sin página válida (`href` ausente) ofrece
 * consulta por WhatsApp en lugar de un enlace roto.
 */
export function Channels({ channels }: ChannelsProps) {
  const { channels: copy } = homeContent;
  const featured = channels.find((c) => c.slug === "horeca");
  const others = channels.filter((c) => c.slug !== "horeca");

  return (
    <Section tone="brand" id="canales" labelledBy="canales-title">
      <div className="max-w-3xl space-y-5">
        <Heading id="canales-title">{copy.title}</Heading>
        <Text variant="lead" muted>
          {copy.intro}
        </Text>
      </div>

      <div className="mt-14 grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
        {featured ? (
          <Reveal as="article" className="space-y-6">
            <div className="space-y-2">
              <Heading level={3} className="text-accent-soft">
                {featured.name}
              </Heading>
              <p className="text-lead">{featured.shortDescription}</p>
            </div>
            {featured.description ? <Text>{featured.description}</Text> : null}
            {featured.highlights ? (
              <ul className="list-disc space-y-1.5 pl-5 marker:text-accent-soft">
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
          </Reveal>
        ) : null}

        <ul className="divide-y divide-cream-50/20 border-y border-cream-50/20">
          {others.map((channel, index) => (
            <Reveal as="li" key={channel.slug} delay={index} className="space-y-1 py-6">
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
