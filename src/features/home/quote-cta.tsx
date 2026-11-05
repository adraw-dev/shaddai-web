import type { CSSProperties } from "react";
import { ArrowLink } from "@/components/ui/arrow-link";
import { Heading } from "@/components/ui/heading";
import { Section } from "@/components/ui/section";
import { Text } from "@/components/ui/text";
import { homeContent } from "@/content/home";
import { QuoteForm } from "@/features/home/quote-form";

const bean = (delay: number, dur: number) =>
  ({ "--float-delay": `${-delay}s`, "--float-dur": `${dur}s`, "--float-amp": "12px", "--float-rot": "10deg" }) as CSSProperties;

/**
 * Cierre de conversión: la misma acción primaria de toda la web (cotizar por WhatsApp).
 * Propuesta B: banda «sunrise» (degradado durazno → rosa) y el formulario sobre un panel claro que
 * «se levanta» del fondo (sombra larga + brillo superior). Los granos flotantes son decorativos.
 */
export function QuoteCta() {
  const { quote: copy } = homeContent;

  return (
    <Section tone="sunrise" sheet id="cotizar" labelledBy="cotizar-title" className="isolate overflow-hidden">
      <span aria-hidden="true" className="bean float-slow -z-10 hidden md:block md:left-[47%] md:top-[8%]" style={bean(0, 6)} />
      <span aria-hidden="true" className="bean float-slow -z-10 hidden md:block md:left-[44%] md:top-[70%]" style={bean(2, 7.5)} />
      <span aria-hidden="true" className="bean float-slow -z-10 right-[6%] top-[8%]" style={bean(4, 5.5)} />

      <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-20">
        <div className="space-y-5">
          <Heading id="cotizar-title" className="text-espresso-900">
            {copy.title}
          </Heading>
          <Text variant="lead" muted>
            {copy.text}
          </Text>
        </div>
        <div className="space-y-6 rounded-[2rem] bg-white/60 p-6 ring-1 ring-white/80 shadow-[inset_0_1px_0_rgb(255_255_255/0.9),0_34px_60px_-32px_rgb(122_52_28/0.55)] backdrop-blur-sm md:p-8">
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
