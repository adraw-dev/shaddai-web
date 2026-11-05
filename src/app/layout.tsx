import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Hanken_Grotesk } from "next/font/google";
import { ViewTransition, type ReactNode } from "react";
import "./globals.css";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { HeaderScrollState } from "@/components/layout/header-scroll-state";
import { SkipLink } from "@/components/layout/skip-link";
import { WhatsAppFab } from "@/components/layout/whatsapp-fab";
import { siteConfig } from "@/content/site";
import { env } from "@/lib/env";
import { baseOpenGraph, isIndexable, siteDescription, siteTitle } from "@/lib/seo";

/** Titulares con carácter (plan §5.3). Autoalojada por next/font en el build. */
const display = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display-face",
  display: "swap",
});

/** Cuerpo humanista de alta legibilidad. */
const body = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(env.siteUrl),
  title: { default: siteTitle, template: `%s | ${siteConfig.brandName}` },
  description: siteDescription,
  applicationName: siteConfig.brandName,
  // Solo producción se indexa (plan §10.1); en previews/local, noindex.
  robots: isIndexable ? { index: true, follow: true } : { index: false, follow: false },
  openGraph: baseOpenGraph,
};

export const viewport: Viewport = {
  themeColor: "#fff1e7",
};

/**
 * NO modificar <html> ni <head> con scripts en línea antes de hidratar (p. ej. añadir una clase
 * «js»): React compara el DOM del servidor con el del cliente y un atributo distinto en <html>
 * provoca un error de hidratación; en desarrollo eso deja el enrutador de Next sin inicializar
 * («Router action dispatched before initialization») y las actualizaciones en caliente acaban en
 * recargas completas. El estado oculto de los [data-reveal] usa `@media (scripting: enabled)`.
 *
 * `data-scroll-behavior="smooth"`: el CSS global activa `scroll-behavior: smooth`; este atributo
 * le dice a Next que lo suspenda durante los cambios de ruta (si no, la página «se desliza»
 * hasta arriba al navegar). Lo pide la advertencia de Next del 2026-11-05.
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="es-CO"
      data-scroll-behavior="smooth"
      className={`${display.variable} ${body.variable}`}
    >
      <body className="flex min-h-dvh flex-col">
        <SkipLink />
        <HeaderScrollState />
        <Header />
        <div id="contenido" tabIndex={-1} className="flex flex-1 flex-col outline-none">
          <ViewTransition>{children}</ViewTransition>
        </div>
        <Footer />
        <WhatsAppFab />
      </body>
    </html>
  );
}
