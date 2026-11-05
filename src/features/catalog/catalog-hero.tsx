import type { ReactNode } from "react";
import { Heading } from "@/components/ui/heading";
import { Section } from "@/components/ui/section";
import { Text } from "@/components/ui/text";
import { Breadcrumbs, type Crumb } from "./breadcrumbs";

type CatalogHeroProps = {
  id: string;
  title: string;
  lead?: string;
  breadcrumbs: Crumb[];
  /** Contenido bajo el título (p. ej. la navegación de categorías). */
  children?: ReactNode;
};

/** Encabezado compacto de las páginas de listado del catálogo (primera sección: va bajo el header). */
export function CatalogHero({ id, title, lead, breadcrumbs, children }: CatalogHeroProps) {
  return (
    <Section tone="aurora" size="compact" underHeader labelledBy={id}>
      <div className="space-y-6">
        <div className="max-w-3xl space-y-4">
          <Breadcrumbs items={breadcrumbs} />
          <Heading level={1} id={id}>
            {title}
          </Heading>
          {lead ? (
            <Text variant="lead" muted>
              {lead}
            </Text>
          ) : null}
        </div>
        {children}
      </div>
    </Section>
  );
}
