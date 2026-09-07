import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { homeCategories } from "@/lib/config";
import { getCollection, type CollectionSort } from "@/lib/shopify";
import { ProductGrid } from "@/components/product/ProductGrid";
import { SortSelect } from "@/components/collection/SortSelect";
import { QuizCta } from "@/components/home/QuizCta";

type Props = {
  params: Promise<{ handle: string }>;
  searchParams: Promise<{ sort?: string }>;
};

const validSorts: CollectionSort[] = ["featured", "best-selling", "newest", "price-asc", "price-desc", "title"];

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = await params;
  const collection = await getCollection(handle);
  if (!collection) return { title: "Collection not found" };
  return {
    title: collection.title,
    description: collection.description || `Shop ${collection.title} at Bidet World.`,
    openGraph: collection.image ? { images: [{ url: collection.image.url }] } : undefined,
  };
}

export default async function CollectionPage({ params, searchParams }: Props) {
  const { handle } = await params;
  const { sort: sortParam } = await searchParams;
  const sort = validSorts.includes(sortParam as CollectionSort) ? (sortParam as CollectionSort) : "featured";

  const collection = await getCollection(handle, sort);
  if (!collection) notFound();

  const showCategories = handle === "all-bidets-1" || handle === "all-bidets";

  return (
    <>
      <div className="container-x pt-10 lg:pt-14">
        <nav aria-label="Breadcrumb" className="text-sm text-neutral-500">
          <Link href="/" className="hover:underline">
            Home
          </Link>{" "}
          / <span className="text-ink">{collection.title}</span>
        </nav>
        <div className="mt-4 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold sm:text-5xl">{collection.title}</h1>
            {collection.descriptionHtml && (
              <div className="rte mt-4" dangerouslySetInnerHTML={{ __html: collection.descriptionHtml }} />
            )}
          </div>
          {collection.image && !showCategories && (
            <div className="relative hidden h-32 w-48 overflow-hidden rounded-3xl bg-paper-soft lg:block">
              <Image src={collection.image.url} alt={collection.image.altText ?? collection.title} fill sizes="192px" className="object-cover" />
            </div>
          )}
        </div>

        {showCategories && (
          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-7">
            {homeCategories.map((c) => (
              <Link key={c.handle} href={`/collections/${c.handle}`} className="rounded-2xl bg-paper-soft px-4 py-4 text-center text-sm font-medium ring-1 ring-neutral-200/70 transition hover:bg-ink hover:text-white">
                {c.title}
              </Link>
            ))}
          </div>
        )}

        <div className="mt-10 flex items-center justify-between border-t border-neutral-200 pt-6">
          <p className="text-sm text-neutral-500">
            {collection.products.length} product{collection.products.length === 1 ? "" : "s"}
          </p>
          <Suspense>
            <SortSelect value={sort} />
          </Suspense>
        </div>

        <div className="mt-8 pb-20">
          <ProductGrid products={collection.products} columns={4} emptyMessage="No products in this collection yet." />
        </div>
      </div>
      <QuizCta compact />
    </>
  );
}
