import type { Channel } from "@/domain/catalog";
import { env } from "@/lib/env";

/**
 * Canales comerciales (MD §1 y §5). Las URLs apuntan a las categorías del sitio ACTUAL
 * (plan §4.4); en la fase de Strapi pasan a rutas internas sin tocar componentes.
 *
 * TODO(contenido, D-13): del MD, solo HORECA tiene descripción detallada. Para VENDING, MAQUILA y
 * RETAIL solo se usa su definición de una línea hasta que el cliente entregue el texto.
 */
const legacy = (path: string) => `${env.legacySiteUrl}${path}`;

export const channels: Channel[] = [
  {
    slug: "horeca",
    name: "HORECA",
    shortDescription: "Hoteles, restaurantes y cafeterías",
    description:
      "Un portafolio amplio para que las cafeterías ganen éxito y reconocimiento en su mercado, con el compromiso de entregar materias primas de altos estándares de calidad al mejor precio.",
    highlights: [
      "Café en grano y molido",
      "Aromáticas",
      "Bebidas lácteas en polvo, con gran variedad de sabores",
    ],
    href: legacy("/categoria/horeca/"),
  },
  {
    slug: "vending",
    name: "VENDING",
    shortDescription: "Máquinas expendedoras",
    href: legacy("/categoria/vending/"),
  },
  {
    slug: "maquila",
    name: "MAQUILA",
    shortDescription: "Producción para terceros",
    href: legacy("/categoria/maquila/"),
  },
  {
    slug: "retail",
    name: "RETAIL",
    shortDescription: "Venta minorista",
    href: legacy("/categoria/retail/"),
  },
];
