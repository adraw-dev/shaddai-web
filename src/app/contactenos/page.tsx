import type { Metadata } from "next";
import { Heading } from "@/components/ui/heading";
import { Section } from "@/components/ui/section";
import { contactContent } from "@/content/contact";
import { ContactForm } from "@/features/contact/contact-form";
import { ContactHero } from "@/features/contact/contact-hero";
import { ContactInfo } from "@/features/contact/contact-info";
import { Location } from "@/features/contact/location";
import { env } from "@/lib/env";
import { baseOpenGraph } from "@/lib/seo";
import { isContactEndpointConfigured } from "@/lib/integrations/contact-form";

const { meta } = contactContent;

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
  alternates: { canonical: "/contactenos/" },
  openGraph: {
    ...baseOpenGraph,
    title: `${meta.title} | Shaddai Colombia`,
    description: meta.description,
    url: "/contactenos/",
  },
};

/** Ruta fina: compone el encabezado, el formulario con los datos de contacto y la ubicación. */
export default function ContactPage() {
  return (
    <main className="flex flex-1 flex-col">
      <ContactHero />

      <Section tone="cream" sheet labelledBy="form-title">
        <div className="grid gap-14 lg:grid-cols-[1.15fr_0.85fr] lg:gap-20">
          <div className="space-y-8">
            <Heading id="form-title">{contactContent.form.title}</Heading>
            <ContactForm
              canSendMessage={isContactEndpointConfigured}
              privacyPolicyUrl={env.privacyPolicyUrl}
            />
          </div>
          <ContactInfo />
        </div>
      </Section>

      <Location />
    </main>
  );
}
