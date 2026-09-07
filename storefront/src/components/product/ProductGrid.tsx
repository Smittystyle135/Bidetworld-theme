import type { ProductCard as ProductCardType } from "@/lib/shopify/types";
import { ProductCard } from "./ProductCard";

export function ProductGrid({
  products,
  columns = 4,
  emptyMessage = "No products found.",
}: {
  products: ProductCardType[];
  columns?: 3 | 4 | 5;
  emptyMessage?: string;
}) {
  if (products.length === 0) {
    return <p className="rounded-2xl bg-paper-soft px-6 py-16 text-center text-neutral-500">{emptyMessage}</p>;
  }
  const cols =
    columns === 5
      ? "lg:grid-cols-4 xl:grid-cols-5"
      : columns === 3
        ? "lg:grid-cols-3"
        : "lg:grid-cols-3 xl:grid-cols-4";

  return (
    <div className={`grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 ${cols}`}>
      {products.map((p, i) => (
        <ProductCard key={p.id} product={p} priority={i < 4} />
      ))}
    </div>
  );
}
