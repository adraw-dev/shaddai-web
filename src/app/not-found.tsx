import type { Metadata } from "next";
import { LinkButton } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Section } from "@/components/ui/section";
import { Text } from "@/components/ui/text";

export const metadata: Metadata = {
  title: "Página no encontrada",
  robots: { index: false, follow: false },
};

/** 404 con la marca: explica qué pasó y ofrece las dos salidas útiles. */
export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col">
      <Section tone="brand" labelledBy="no-encontrada" className="flex flex-1 items-center">
        <div className="max-w-2xl space-y-6">
          <Heading level={1} size="display" id="no-encontrada">
            Página no encontrada
          </Heading>
          <Text variant="lead" muted>
            La dirección que buscó no existe o cambió de lugar. Puede volver al inicio o escribirnos y le ayudamos.
          </Text>
          <div className="flex flex-wrap gap-3">
            <LinkButton href="/" size="lg">
              Volver al inicio
            </LinkButton>
            <LinkButton href="/contactenos/" variant="secondary" size="lg">
              Contáctenos
            </LinkButton>
          </div>
        </div>
      </Section>
    </main>
  );
}
