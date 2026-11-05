import { WhatsAppIcon } from "@/components/icons";
import { advisoryMessage } from "@/content/whatsapp-messages";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

/**
 * Botón flotante de WhatsApp (el sitio actual lo tiene). Mensaje de asesoría (plan D-14).
 * 56 px de diámetro (≥ 44 px), respeta el área segura de iOS. El footer deja espacio inferior
 * en móvil para que no tape contenido.
 */
export function WhatsAppFab() {
  const href = buildWhatsAppUrl(advisoryMessage);
  const external = href.startsWith("http");

  return (
    <a
      href={href}
      aria-label="Escribir por WhatsApp"
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      data-on-dark
      className="fixed right-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-50 inline-flex size-14 items-center justify-center rounded-full bg-whatsapp text-white shadow-raised transition-[background-color,scale] duration-150 ease-ui hover:bg-whatsapp-strong active:scale-[0.96] sm:right-6"
    >
      <WhatsAppIcon size={28} />
    </a>
  );
}
