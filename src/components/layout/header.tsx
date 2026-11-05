import Link from "next/link";
import { WhatsAppIcon } from "@/components/icons";
import { MobileNav } from "@/components/layout/mobile-nav";
import { LinkButton } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { siteConfig } from "@/content/site";
import { quoteMessage } from "@/content/whatsapp-messages";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

const CTA_LABEL = "Cotizar por WhatsApp";

/**
 * Header fijo (sticky) sobre el morado de marca; se funde con el hero.
 * TODO(F5-02): estado al hacer scroll (sombra/solidez).
 */
export function Header() {
  const ctaHref = buildWhatsAppUrl(quoteMessage());

  return (
    <header data-tone="brand" className="sticky top-0 z-40 bg-brand-900 text-cream-50">
      <Container className="relative flex h-[var(--header-height)] items-center justify-between gap-6">
        <Link href="/" aria-label={`${siteConfig.brandName} — inicio`} className="shrink-0">
          <img
            src={siteConfig.logo.src}
            width={siteConfig.logo.width}
            height={siteConfig.logo.height}
            alt={siteConfig.logo.alt}
            className="h-12 w-auto"
          />
        </Link>

        <nav aria-label="Principal" className="hidden items-center gap-1 lg:flex">
          {siteConfig.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex min-h-11 items-center rounded-control px-4 font-medium text-cream-50/90 transition-colors duration-150 hover:bg-cream-50/10 hover:text-cream-50"
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
