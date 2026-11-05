import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { WhatsAppIcon } from "@/components/icons";
import { ArrowLink } from "@/components/ui/arrow-link";
import { LinkButton } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Section } from "@/components/ui/section";
import { Text } from "@/components/ui/text";
import { productQuoteMessage } from "@/content/whatsapp-messages";
import { Breadcrumbs } from "@/features/catalog/breadcrumbs";
import { catalogContent } from "@/features/catalog/catalog-content";
import { PriceTag } from "@/features/catalog/price-tag";
import { ProductGallery } from "@/features/catalog/product-gallery";
import { ProductGrid } from "@/features/catalog/product-grid";
import { RichText } from "@/features/catalog/rich-text";
import { SpecList } from "@/features/catalog/spec-list";
import {
  CATALOG_PLACEHOLDER,
  categoryHref,
  getProductBySlug,
  getProducts,
  getProductsByCategory,
  productHref,
  withPlaceholder,
} from "@/lib/catalog";
import { baseOpenGraph, jsonLdScript, productJsonLd } from "@/lib/seo";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

type Params = { categoria: string; slug: string };

export const dynamicParams = false;

export async function generateStaticParams(): Promise<Params[]> {
  const params = (await getProducts()).map((p) => ({ categoria: p.category.slug, slug: p.slug }));
  return withPlaceholder(params, { categoria: CATALOG_PLACEHOLDER, slug: CATALOG_PLACEHOLDER });
}

/** El producto debe existir Y pertenecer a la categoría de la URL. */
async function findProduct(params: Promise<Params>) {
  const { categoria, slug } = await params;
  const product = await getProductBySlug(slug);
  return product?.category.slug === categoria ? product : undefined;
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const product = await findProduct(params);
  if (!product) return {};
  const title = product.seo?.title ?? product.name;
  const description = product.seo?.description ?? product.shortDescription;
  const url = productHref(product);
  const image = product.seo?.image ?? product.images[0];
  const imageVariant = image?.variants.at(-1);
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      ...baseOpenGraph,
      title: `${title} | Shaddai Colombia`,
      description,
      url,
      ...(image && imageVariant
        ? { images: [{ url: imageVariant.src, width: imageVariant.width, alt: image.alt }] }
        : {}),
    },
  };
}

/** Una fila completa de la rejilla en escritorio ancho. */
const RELATED_LIMIT = 6;

export default async function ProductPage({ params }: { params: Promise<Params> }) {
  const product = await findProduct(params);
  if (!product) notFound();

  const related = (await getProductsByCategory(product.category.slug))
    .filter((p) => p.slug !== product.slug)
    .slice(0, RELATED_LIMIT);
  const url = productHref(product);
  const quoteUrl = buildWhatsAppUrl(productQuoteMessage(product));

  return (
    <main className="flex flex-1 flex-col">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(productJsonLd(product, url)) }} />

      <Section tone="aurora" size="compact" underHeader labelledBy="producto-title">
        <div className="space-y-6">
          <Breadcrumbs
            items={[
              { label: catalogContent.breadcrumbHome, href: "/" },
              { label: catalogContent.breadcrumbCatalog, href: "/productos/" },
              { label: product.category.name, href: categoryHref(product.category) },
              { label: product.name },
            ]}
          />
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-14">
            <ProductGallery name={product.name} images={product.images} />

            <div className="space-y-6 lg:pt-4">
              <div className="space-y-3">
                {product.brand ? <p className="text-sm font-semibold [color:var(--muted)]">{product.brand}</p> : null}
                <Heading level={1} id="producto-title" size="h2" className="text-balance">
                  {product.name}
                </Heading>
                {product.presentation ? <Text muted>{product.presentation}</Text> : null}
              </div>
              <PriceTag price={product.price} size="lg" />
              {product.shortDescription ? <Text variant="lead">{product.shortDescription}</Text> : null}
              <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                <LinkButton href={quoteUrl} size="lg">
                  <WhatsAppIcon size={22} />
                  {catalogContent.quoteCta}
                </LinkButton>
                <ArrowLink href={categoryHref(product.category)}>
                  {catalogContent.seeCategory(product.category.name)}
                </ArrowLink>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Orden pedido por el usuario (2026-11-05): primero la descripción, luego la ficha técnica. */}
      <Section tone="cream" sheet labelledBy={product.description.length ? "descripcion-title" : "ficha-title"}>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-16">
          {product.description.length ? (
            <div className="space-y-5">
              <Heading id="descripcion-title" size="h3">
                {catalogContent.descriptionTitle}
              </Heading>
              <RichText blocks={product.description} />
            </div>
          ) : null}
          {product.specs.length ? (
            <div className="space-y-5">
              <Heading id="ficha-title" size="h3">
                {catalogContent.specsTitle}
              </Heading>
              <SpecList specs={product.specs} />
            </div>
          ) : null}
        </div>
      </Section>

      {related.length ? (
        <Section tone="cream-warm" sheet labelledBy="relacionados-title">
          <div className="space-y-6">
            <Heading id="relacionados-title" size="h3" className="text-h2">
              {catalogContent.relatedTitle(product.category.name)}
            </Heading>
            <ProductGrid products={related} />
          </div>
        </Section>
      ) : null}
    </main>
  );
}
