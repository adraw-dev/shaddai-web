import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Section } from "@/components/ui/section";
import { catalogContent } from "@/features/catalog/catalog-content";
import { CatalogHero } from "@/features/catalog/catalog-hero";
import { CategoryNav } from "@/features/catalog/category-nav";
import { ProductGrid } from "@/features/catalog/product-grid";
import {
  CATALOG_PLACEHOLDER,
  categoryHref,
  getCategories,
  getCategoryBySlug,
  getProductsByCategory,
  withPlaceholder,
} from "@/lib/catalog";
import { baseOpenGraph } from "@/lib/seo";

type Params = { categoria: string };

/** Exportación estática: solo existen las categorías conocidas en el build. */
export const dynamicParams = false;

export async function generateStaticParams(): Promise<Params[]> {
  const params = (await getCategories()).map((category) => ({ categoria: category.slug }));
  return withPlaceholder(params, { categoria: CATALOG_PLACEHOLDER });
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const category = await getCategoryBySlug((await params).categoria);
  if (!category) return {};
  const description =
    category.description ?? `${category.name}: ${catalogContent.productCount(category.productCount)} de Shaddai Colombia. Cotice por WhatsApp.`;
  const url = categoryHref(category);
  return {
    title: category.name,
    description,
    alternates: { canonical: url },
    openGraph: { ...baseOpenGraph, title: `${category.name} | Shaddai Colombia`, description, url },
  };
}

export default async function CategoryPage({ params }: { params: Promise<Params> }) {
  const { categoria } = await params;
  const [category, categories, products] = await Promise.all([
    getCategoryBySlug(categoria),
    getCategories(),
    getProductsByCategory(categoria),
  ]);
  if (!category) notFound();

  return (
    <main className="flex flex-1 flex-col">
      <CatalogHero
        id="categoria-title"
        title={category.name}
        lead={category.description ?? catalogContent.productCount(category.productCount)}
        breadcrumbs={[
          { label: catalogContent.breadcrumbHome, href: "/" },
          { label: catalogContent.breadcrumbCatalog, href: "/productos/" },
          { label: category.name },
        ]}
      >
        <CategoryNav categories={categories} current={category.slug} />
      </CatalogHero>

      <Section tone="cream" sheet>
        <ProductGrid products={products} headingLevel={2} />
      </Section>
    </main>
  );
}
