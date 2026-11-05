import { WhatsAppIcon } from "@/components/icons";
import { Aurora } from "@/components/motion/aurora";
import { LinkButton } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Section } from "@/components/ui/section";
import { Text } from "@/components/ui/text";
import { contactContent } from "@/content/contact";
import { advisoryMessage, quoteMessage } from "@/content/whatsapp-messages";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

/**
 * Encabezado compacto + accesos rápidos a WhatsApp (los dos flujos del MD §10: cotizar y asesoría).
 * Resuelve la consulta sin necesidad de llenar el formulario.
 */
export function ContactHero() {
  const { hero } = contactContent;

  return (
    <Section tone="aurora" size="compact" underHeader labelledBy="contacto-title" className="relative isolate overflow-hidden">
      <Aurora />
      <div className="max-w-2xl space-y-6">
        <Heading level={1} id="contacto-title">
          {hero.title}
        </Heading>
        <Text variant="lead" muted>
          {hero.lead}
        </Text>
        <div className="flex flex-wrap gap-3">
          <LinkButton href={buildWhatsAppUrl(quoteMessage())} size="lg">
            <WhatsAppIcon size={22} />
            {hero.quoteCta}
          </LinkButton>
          <LinkButton href={buildWhatsAppUrl(advisoryMessage)} variant="secondary" size="lg">
            {hero.advisoryCta}
          </LinkButton>
        </div>
      </div>
    </Section>
  );
}
