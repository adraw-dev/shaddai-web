import { FacebookIcon, InstagramIcon, MailIcon, PhoneIcon, PinIcon } from "@/components/icons";
import { Heading } from "@/components/ui/heading";
import { contactContent } from "@/content/contact";
import { siteConfig } from "@/content/site";

const linkClass =
  "inline-flex min-h-11 items-center gap-3 rounded-control py-1 font-medium underline-offset-4 hover:underline [color:var(--link)]";

/**
 * Datos de contacto completos (el footer solo trae un resumen). Todo sale de content/site.ts.
 * Grupos separados por filetes, no por tarjetas. El horario es una tabla real (dato tabular).
 */
export function ContactInfo() {
  const { info } = contactContent;
  const { contact, hours, social } = siteConfig;

  return (
    <div className="space-y-2">
      <Heading level={2} size="h3" id="info-title">
        {info.title}
      </Heading>

      <div className="divide-y divide-ink/15" aria-labelledby="info-title" role="group">
        <div className="py-5">
          <h3 className="font-semibold [color:var(--muted)]">
            {info.phoneTitle}
          </h3>
          <ul className="mt-1">
            {contact.phones.map((phone) => (
              <li key={phone.tel}>
                <a href={`tel:${phone.tel}`} className={linkClass}>
                  <PhoneIcon size={20} />
                  {phone.display}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="py-5">
          <h3 className="font-semibold [color:var(--muted)]">
            {info.emailTitle}
          </h3>
          <a href={`mailto:${contact.email}`} className={`${linkClass} mt-1 break-all`}>
            <MailIcon size={20} className="shrink-0" />
            {contact.email}
          </a>
        </div>

        <div className="py-5">
          <h3 className="font-semibold [color:var(--muted)]">
            {info.visitTitle}
          </h3>
          <p className="mt-2 flex items-start gap-3">
            <PinIcon size={20} className="mt-1 shrink-0" />
            <span>
              {contact.address.street}, {contact.address.reference}
              <br />
              {contact.address.city}, {contact.address.country}
            </span>
          </p>
        </div>

        <div className="py-5">
          <h3 className="font-semibold [color:var(--muted)]">
            {info.hoursTitle}
          </h3>
          <table className="mt-2 w-full text-left">
            <caption className="sr-only">{info.hoursTitle}</caption>
            <tbody className="divide-y divide-ink/10">
              {hours.map((row) => (
                <tr key={row.days}>
                  <th scope="row" className="py-2 pr-4 font-medium">
                    {row.days}
                  </th>
                  <td className="py-2 text-right tabular-nums">{row.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="py-5">
          <h3 className="font-semibold [color:var(--muted)]">
            {info.socialTitle}
          </h3>
          <ul className="mt-1 flex gap-1">
            <li>
              <a
                href={social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram de Shaddai Insumos (se abre en una pestaña nueva)"
                className="inline-flex size-11 items-center justify-center rounded-control transition-colors duration-150 hover:bg-ink/10"
              >
                <InstagramIcon size={22} />
              </a>
            </li>
            <li>
              <a
                href={social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook de Shaddai Insumos (se abre en una pestaña nueva)"
                className="inline-flex size-11 items-center justify-center rounded-control transition-colors duration-150 hover:bg-ink/10"
              >
                <FacebookIcon size={22} />
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
