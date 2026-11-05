import type { ProductLine } from "@/domain/catalog";

/**
 * Las tres líneas destacadas (MD §2). Descripciones tomadas del MD.
 * Imágenes provisionales de 320×320 px (docs/activos-provisionales.md): pedir originales antes de F3-02.
 */
export const productLines: ProductLine[] = [
  {
    slug: "lattes",
    name: "Lattes",
    description:
      "Premezclas de alta calidad pensadas para que el cliente final del negocio quede satisfecho.",
    image: {
      alt: "Taza con espuma de leche espolvoreada, vista desde arriba",
      width: 320,
      height: 320,
      variants: [{ src: "/images/products/linea-lattes.png", width: 320, mime: "image/png" }],
    },
  },
  {
    slug: "cafe",
    name: "Café",
    description:
      "Grano fresco y seleccionado, de productores certificados, para lograr tazas de excelencia con café colombiano.",
    image: {
      alt: "Taza de café negro vista desde arriba",
      width: 320,
      height: 320,
      variants: [{ src: "/images/products/linea-cafe.png", width: 320, mime: "image/png" }],
    },
  },
  {
    slug: "capuccinos",
    // TODO(contenido, D-10): grafía tomada del MD; confirmar «Capuchinos» / «Cappuccinos» con el cliente.
    name: "Capuccinos",
    description:
      "Innovación para ampliar la carta del negocio, con sabores tradicionales y también opciones más saludables.",
    image: {
      alt: "Taza de café con leche vista desde arriba",
      width: 320,
      height: 320,
      variants: [{ src: "/images/products/linea-capuccinos.png", width: 320, mime: "image/png" }],
    },
  },
];
