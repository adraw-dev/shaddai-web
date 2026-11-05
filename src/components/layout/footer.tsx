import Link from "next/link";
import { Picture } from "@/components/media/picture";
import { FacebookIcon, InstagramIcon, MailIcon, PhoneIcon, PinIcon } from "@/components/icons";
import { Container } from "@/components/ui/container";
import { sheetClasses } from "@/components/ui/section";
import { siteConfig } from "@/content/site";
import { cn } from "@/lib/cn";

const linkClass =
  "inline-flex min-h-11 items-center gap-2 rounded-control py-1 text-cream-50/90 underline-offset-4 transition-colors duration-150 hover:text-cream-50 hover:underline";

/**
 * Datos de referencia resumidos. El detalle completo (horario en tabla, mapa) vive en /contactenos/.
 * El año del aviso legal se calcula en el build (se actualiza al reconstruir).
 */
export function Footer() {
  const { contact, hours, social } = siteConfig;
  const year = new Date().getFullYear();

  return (
    <footer data-tone="ink" className={cn(sheetClasses, "bg-ink pt-14 pb-28 text-cream-50 [--muted:var(--color-brand-300)] md:pb-12")}>
      <Container>
        <div className="grid gap-10 md:grid-cols-[1.2fr_1fr_1fr]">
          <div className="space-y-4">
            <Link href="/" aria-label={`${siteConfig.brandName} — inicio`} className="inline-block">
              <Picture media={siteConfig.logo} sizes="92px" className="w-[92px]" />
            </Link>
            <p className="max-w-xs text-sm [color:var(--muted)]">
              {siteConfig.tagline} · {siteConfig.legalName}
            </p>
            <ul className="flex gap-1" aria-label="Redes sociales">
              <li>
                <a href={social.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram de Shaddai Insumos" className="inline-flex size-11 items-center justify-center rounded-control transition-colors duration-150 hover:bg-cream-50/10">
                  <InstagramIcon size={22} />
                </a>
              </li>
              <li>
                <a href={social.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook de Shaddai Insumos" className="inline-flex size-11 items-center justify-center rounded-control transition-colors duration-150 hover:bg-cream-50/10">
                  <FacebookIcon size={22} />
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="font-display text-lg font-semibold">Contacto</h2>
            <ul className="mt-3 space-y-1">
              {contact.phones.map((phone) => (
                <li key={phone.tel}>
                  <a href={`tel:${phone.tel}`} className={linkClass}>
                    <PhoneIcon size={18} />
                    {phone.display}
                  </a>
                </li>
              ))}
              <li>
                <a href={`mailto:${contact.email}`} className={linkClass}>
                  <MailIcon size={18} />
                  {contact.email}
                </a>
              </li>
              <li>
                <a href={contact.mapsUrl} target="_blank" rel="noopener noreferrer" className={linkClass}>
                  <PinIcon size={18} className="shrink-0" />
                  <span>
                    {contact.address.street}, {contact.address.reference}, {contact.address.city}
                  </span>
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="font-display text-lg font-semibold">Horario de atención</h2>
            <dl className="mt-3 space-y-2 text-sm">
              {hours.map((row) => (
                <div key={row.days} className="flex flex-col">
                  <dt className="[color:var(--muted)]">{row.days}</dt>
                  <dd className="font-medium">{row.time}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <p className="mt-12 border-t border-cream-50/15 pt-6 text-sm [color:var(--muted)]">
          ShaddaiColombia® · Todos los derechos reservados · {siteConfig.copyrightStartYear}–{year}
        </p>
      </Container>
    </footer>
  );
}
