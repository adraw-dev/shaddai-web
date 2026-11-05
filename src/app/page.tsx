import { WhatsAppIcon } from "@/components/icons";
import { LinkButton } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Section } from "@/components/ui/section";
import { Text } from "@/components/ui/text";
import { quoteMessage } from "@/content/whatsapp-messages";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

/** Página provisional: la Landing real se construye en la Fase 3. */
export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      <Section tone="brand" labelledBy="titulo" className="flex flex-1 items-center">
        <div className="max-w-2xl space-y-6">
          <Heading level={1} size="display" id="titulo">
            Shaddai Colombia
          </Heading>
          <Text variant="lead" muted>
            Nuestra nueva página web está en construcción.
          </Text>
          <LinkButton href={buildWhatsAppUrl(quoteMessage())} size="lg">
            <WhatsAppIcon size={22} />
            Cotizar por WhatsApp
          </LinkButton>
        </div>
      </Section>
    </main>
  );
}
