import Link from "next/link";
import { WhatsAppIcon } from "@/components/icons";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Picture } from "@/components/media/picture";
import { LinkButton } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { siteConfig } from "@/content/site";
import { quoteMessage } from "@/content/whatsapp-messages";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

const CTA_LABEL = "Cotizar por WhatsApp";

/**
 * Header fijo (sticky) TRANSPARENTE mientras la página está arriba del todo: flota sobre el hero
 * (margen inferior negativo = su alto; las secciones iniciales usan `underHeader` para no quedar
 * tapadas). Al hacer scroll pasa a crema translúcida con desenfoque y sombra (HeaderScrollState +
 * globals.css). Sin JS queda siempre sólido (la transparencia solo aplica con `scripting: enabled`).
 */
export function Header() {
  const ctaHref = buildWhatsAppUrl(quoteMessage());

  return (
    <header
      data-site-header
      data-tone="cream"
      className="sticky top-0 z-40 -mb-[var(--header-height)] text-ink"
    >
      <Container className="relative flex h-[var(--header-height)] items-center justify-between gap-6">
        <Link href="/" aria-label={`${siteConfig.brandName} — inicio`} className="shrink-0">
          <Picture media={siteConfig.logo} sizes="80px" eager className="w-20" />
        </Link>

        <nav aria-label="Principal" className="hidden items-center gap-1 lg:flex">
          {siteConfig.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex min-h-11 items-center rounded-control px-4 font-medium text-espresso-900 transition-colors duration-150 hover:bg-espresso-900/8"
            >
              {item.label}
            </Link>
          ))}
          <LinkButton href={ctaHref} className="ml-3">
            <WhatsAppIcon size={20} />
            {CTA_LABEL}
          </LinkButton>
        </nav>

        <MobileNav items={siteConfig.nav} ctaHref={ctaHref} ctaLabel={CTA_LABEL} />
      </Container>
    </header>
  );
}
