import { LinkButton } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Section } from "@/components/ui/section";
import { MapFacade } from "@/components/media/map-facade";
import { PinIcon } from "@/components/icons";
import { contactContent } from "@/content/contact";
import { siteConfig } from "@/content/site";
import { env } from "@/lib/env";

/**
 * Ubicación: dirección en texto + enlace «Cómo llegar» (siempre) y mapa embebido solo si se
 * configuró NEXT_PUBLIC_MAPS_EMBED_URL (D-17); incluso entonces se carga bajo demanda.
 */
export function Location() {
  const { location } = contactContent;
  const { address, mapsUrl } = siteConfig.contact;

  return (
    <Section tone="cream-warm" sheet size="compact" labelledBy="ubicacion-title">
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="space-y-5">
          <Heading id="ubicacion-title" size="h2">
            {location.title}
          </Heading>
          <p className="flex items-start gap-3 text-lead">
            <PinIcon size={24} className="mt-1 shrink-0" />
            <span>
              {address.street}, {address.reference}
              <br />
              {address.city}, {address.country}
            </span>
          </p>
          <LinkButton href={mapsUrl} size="lg">
            {location.route}
          </LinkButton>
        </div>

        {env.mapsEmbedUrl ? (
          <MapFacade src={env.mapsEmbedUrl} title={location.mapTitle} buttonLabel={location.loadMap} />
        ) : null}
      </div>
    </Section>
  );
}
