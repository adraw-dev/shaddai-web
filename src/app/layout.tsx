import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Hanken_Grotesk } from "next/font/google";
import type { ReactNode } from "react";
import "./globals.css";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
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
  themeColor: "#25094b",
};

/** Marca <html class="js"> antes del primer pintado: solo entonces se ocultan los [data-reveal]. */
const jsFlag = "document.documentElement.classList.add('js')";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es-CO" className={`${display.variable} ${body.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: jsFlag }} />
      </head>
      <body className="flex min-h-dvh flex-col">
        <SkipLink />
        <Header />
        <div id="contenido" tabIndex={-1} className="flex flex-1 flex-col outline-none">
          {children}
        </div>
        <Footer />
        <WhatsAppFab />
      </body>
    </html>
  );
}
