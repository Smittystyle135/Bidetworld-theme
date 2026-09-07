import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { site } from "@/lib/config";
import { getProduct, getProductRecommendations } from "@/lib/shopify";
import { ProductView } from "@/components/product/ProductView";
import { ProductGrid } from "@/components/product/ProductGrid";
import { QuizCta } from "@/components/home/QuizCta";

type Props = {
  params: Promise<{ handle: string }>;
  searchParams: Promise<{ variant?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = await params;
  const product = await getProduct(handle);
  if (!product) return { title: "Product not found" };
  return {
    title: product.seo.title ?? product.title,
    description: product.seo.description ?? product.description.slice(0, 160),
    openGraph: {
      type: "website",
      images: product.featuredImage ? [{ url: product.featuredImage.url }] : undefined,
    },
  };
}

export default async function ProductPage({ params, searchParams }: Props) {
  const { handle } = await params;
  const { variant } = await searchParams;
  const product = await getProduct(handle);
  if (!product) notFound();

  const initialVariantId = variant ? `gid://shopify/ProductVariant/${variant}` : undefined;
  const recommendations = await getProductRecommendations(product.id);

  const prices = product.variants.map((v) => Number(v.price.amount));
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    image: product.images.map((i) => i.url),
    brand: product.vendor ? { "@type": "Brand", name: product.vendor } : undefined,
    url: `${site.url}/products/${product.handle}`,
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: product.priceRange.minVariantPrice.currencyCode,
      lowPrice: Math.min(...prices),
      highPrice: Math.max(...prices),
      offerCount: product.variants.length,
      availability: product.availableForSale ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      url: `${site.url}/products/${product.handle}`,
    },
  };

  return (
    <>
      <div className="container-x py-8 lg:py-12">
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-neutral-500">
          <Link href="/" className="hover:underline">
            Home
          </Link>{" "}
          /{" "}
          <Link href="/collections/all-bidets-1" className="hover:underline">
            Bidets
          </Link>{" "}
          / <span className="text-ink">{product.title}</span>
        </nav>

        <ProductView product={product} initialVariantId={initialVariantId} />

        {recommendations.length > 0 && (
          <section className="mt-20 border-t border-neutral-200 pt-14">
            <h2 className="text-3xl font-bold">You may also like</h2>
            <div className="mt-8">
              <ProductGrid products={recommendations.slice(0, 4)} columns={4} />
            </div>
          </section>
        )}
      </div>
      <QuizCta compact />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
