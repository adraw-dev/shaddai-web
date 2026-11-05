/**
 * Textos de interfaz del catálogo (plan §8.1: el texto no vive en los componentes).
 * Sin afirmaciones comerciales: solo describen lo que la página muestra.
 */
export const catalogContent = {
  index: {
    title: "Catálogo de productos",
    lead: "Insumos para preparar bebidas de café, tés, granizados, helados y coctelería. Cotice cualquier producto por WhatsApp.",
    metaDescription:
      "Catálogo de Shaddai Colombia: lattes, capuchinos, café, chocolates, tés, granizados, helados, siropes y coctelería. Cotice por WhatsApp.",
    categoriesLabel: "Categorías",
  },
  breadcrumbHome: "Inicio",
  breadcrumbCatalog: "Productos",
  productCount: (n: number) => (n === 1 ? "1 producto" : `${n} productos`),
  seeMore: "Ver más",
  seeCategory: (name: string) => `Ver todo en ${name}`,
  quoteCta: "Cotizar por WhatsApp",
  quoteNoPrice: "Precio a cotizar",
  previousPrice: "Antes",
  specsTitle: "Ficha técnica",
  descriptionTitle: "Descripción",
  relatedTitle: (category: string) => `Más en ${category}`,
  galleryLabel: (name: string) => `Imágenes de ${name}`,
} as const;
