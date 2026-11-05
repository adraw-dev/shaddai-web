import type { Metadata } from "next";
import { catalogUrl } from "@/content/channels";
import { quoteMessage } from "@/content/whatsapp-messages";
import { Channels } from "@/features/home/channels";
import { Hero } from "@/features/home/hero";
import { ProductLines } from "@/features/home/product-lines";
import { QuoteCta } from "@/features/home/quote-cta";
import { Story } from "@/features/home/story";
import { ValueProp } from "@/features/home/value-prop";
import { getChannels, getProductLines } from "@/lib/catalog";
import { baseOpenGraph, jsonLdScript, organizationJsonLd } from "@/lib/seo";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  openGraph: { ...baseOpenGraph, url: "/" },
};

/**
 * Landing. La ruta solo compone secciones (plan §8.1); el marcado vive en features/home.
 * Orden pensado para la pregunta del comprador: qué venden → ¿atienden mi negocio? → ¿por qué
 * confiar? → ¿quiénes son? → ¿cómo cotizo?
 */
export default async function Home() {
  const [lines, channels] = await Promise.all([getProductLines(), getChannels()]);
  const quoteUrl = buildWhatsAppUrl(quoteMessage());

  return (
    <main className="flex flex-1 flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(organizationJsonLd()) }}
      />
      <Hero quoteUrl={quoteUrl} catalogUrl={catalogUrl} lines={lines} channels={channels} />
      <ProductLines lines={lines} catalogUrl={catalogUrl} />
      <Channels channels={channels} />
      <ValueProp />
      <Story />
      <QuoteCta />
    </main>
  );
}
