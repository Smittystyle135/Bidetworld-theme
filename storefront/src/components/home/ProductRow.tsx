import Link from "next/link";
import { getCollection, getProducts, type ProductCard } from "@/lib/shopify";
import { ArrowRightIcon } from "@/components/Icons";
import { ProductGrid } from "@/components/product/ProductGrid";

type Props = {
  heading: string;
  subheading?: string;
  collectionHandle?: string;
  limit?: number;
  viewAllHref?: string;
  viewAllLabel?: string;
  muted?: boolean;
};

export async function ProductRow({
  heading,
  subheading,
  collectionHandle,
  limit = 4,
  viewAllHref,
  viewAllLabel = "View all",
  muted = false,
}: Props) {
  let products: ProductCard[] = [];
  try {
    if (collectionHandle) {
      const c = await getCollection(collectionHandle, "featured");
      products = c?.products ?? [];
    } else {
      products = await getProducts({ first: limit, sortKey: "BEST_SELLING" });
    }
  } catch {
    products = [];
  }
  products = products.filter((p) => p.availableForSale).slice(0, limit);
  if (products.length === 0) return null;

  const href = viewAllHref ?? (collectionHandle ? `/collections/${collectionHandle}` : "/collections/all-bidets-1");

  return (
    <section className={muted ? "bg-paper-soft" : ""}>
      <div className="container-x py-16 lg:py-24">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold sm:text-4xl">
              <span className="highlight">{heading}</span>
            </h2>
            {subheading && <p className="mt-2 text-neutral-600">{subheading}</p>}
          </div>
          <Link href={href} className="hidden shrink-0 items-center gap-1 text-sm font-medium underline-offset-4 hover:underline sm:inline-flex">
            {viewAllLabel} <ArrowRightIcon size={16} />
          </Link>
        </div>
        <div className="mt-10">
          <ProductGrid products={products} columns={4} />
        </div>
        <Link href={href} className="btn btn-secondary mt-8 w-full sm:hidden">
          {viewAllLabel}
        </Link>
      </div>
    </section>
  );
}
