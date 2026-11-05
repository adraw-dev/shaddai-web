import { ArrowLink } from "@/components/ui/arrow-link";
import { Heading } from "@/components/ui/heading";
import { Section } from "@/components/ui/section";
import { Text } from "@/components/ui/text";
import { homeContent } from "@/content/home";
import { QuoteForm } from "@/features/home/quote-form";

/** Cierre de conversión: la misma acción primaria de toda la web (cotizar por WhatsApp). */
export function QuoteCta() {
  const { quote: copy } = homeContent;

  return (
    <Section tone="brand" id="cotizar" labelledBy="cotizar-title">
      <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-20">
        <div className="space-y-5">
          <Heading id="cotizar-title">{copy.title}</Heading>
          <Text variant="lead" muted>
            {copy.text}
          </Text>
        </div>
        <div className="space-y-6">
          <QuoteForm />
          <p className="[color:var(--muted)]">
            {copy.contactPrompt}{" "}
            <ArrowLink href="/contactenos/">{copy.contactLink}</ArrowLink>
          </p>
        </div>
      </div>
    </Section>
  );
}
