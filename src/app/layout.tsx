import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { env } from "@/lib/env";

export const metadata: Metadata = {
  metadataBase: new URL(env.siteUrl),
  title: "Shaddai Colombia",
  description: "Nueva página web de Shaddai Colombia, en construcción.",
  // TODO(F3-09): metadatos reales e indexación según NEXT_PUBLIC_SITE_ENV.
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es-CO" className="h-full">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
