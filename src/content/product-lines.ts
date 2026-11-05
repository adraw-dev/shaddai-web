import { media } from "@/content/media";
import type { ProductLine } from "@/domain/catalog";

/**
 * Las tres líneas destacadas (MD §2). Descripciones tomadas del MD.
 * Imágenes provisionales de 320×320 px, optimizadas con scripts/optimize-images.mjs (docs/activos-provisionales.md): pedir originales (D-05).
 */
export const productLines: ProductLine[] = [
  {
    slug: "lattes",
    name: "Lattes",
    description:
      "Premezclas de alta calidad pensadas para que el cliente final del negocio quede satisfecho.",
    image: media("linea-lattes", "Taza con espuma de leche espolvoreada, vista desde arriba"),
  },
  {
    slug: "cafe",
    name: "Café",
    description:
      "Grano fresco y seleccionado, de productores certificados, para lograr tazas de excelencia con café colombiano.",
    image: media("linea-cafe", "Taza de café negro vista desde arriba"),
  },
  {
    slug: "capuccinos",
    // TODO(contenido, D-10): grafía tomada del MD; confirmar «Capuchinos» / «Cappuccinos» con el cliente.
    name: "Capuccinos",
    description:
      "Innovación para ampliar la carta del negocio, con sabores tradicionales y también opciones más saludables.",
    image: media("linea-capuccinos", "Taza de café con leche vista desde arriba"),
  },
];
