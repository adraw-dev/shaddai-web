import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLink } from "@/components/ui/arrow-link";
import { Heading } from "@/components/ui/heading";
import { Section } from "@/components/ui/section";
import { catalogContent } from "@/features/catalog/catalog-content";
import { CatalogHero } from "@/features/catalog/catalog-hero";
import { CategoryNav } from "@/features/catalog/category-nav";
import { ProductGrid } from "@/features/catalog/product-grid";
import { categoryHref, getCategories, getProducts, isCatalogEnabled } from "@/lib/catalog";
import { baseOpenGraph } from "@/lib/seo";

const { index } = catalogContent;

export const metadata: Metadata = {
  title: index.title,
  description: index.metaDescription,
  alternates: { canonical: "/productos/" },
  openGraph: { ...baseOpenGraph, title: `${index.title} | Shaddai Colombia`, description: index.metaDescription, url: "/productos/" },
};

/**
 * Catálogo completo agrupado por categoría (PLAN_STRAPI §5). Sin catálogo propio
 * (CATALOG_SOURCE=static) la ruta no existe: los CTA siguen apuntando a la tienda actual.
 */
export default async function CatalogPage() {
  if (!isCatalogEnabled()) notFound();
  const [categories, products] = await Promise.all([getCategories(), getProducts()]);

  return (
    <main className="flex flex-1 flex-col">
      <CatalogHero
        id="catalogo-title"
        title={index.title}
        lead={index.lead}
        breadcrumbs={[{ label: catalogContent.breadcrumbHome, href: "/" }, { label: catalogContent.breadcrumbCatalog }]}
      >
        <CategoryNav categories={categories} />
      </CatalogHero>

      <Section tone="cream" sheet>
        <div className="space-y-12 md:space-y-16">
          {categories.map((category) => {
            const items = products.filter((p) => p.category.slug === category.slug);
            const headingId = `cat-${category.slug}`;
            return (
              <section key={category.slug} aria-labelledby={headingId} className="space-y-5">
                <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
                  <Heading id={headingId} size="h3" className="text-h2">
                    {category.name}
                  </Heading>
                  <ArrowLink href={categoryHref(category)}>{catalogContent.seeCategory(category.name)}</ArrowLink>
                </div>
                <ProductGrid products={items} />
              </section>
            );
          })}
        </div>
      </Section>
    </main>
  );
}
