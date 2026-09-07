import Image from "next/image";
import Link from "next/link";
import type { ProductCard as ProductCardType } from "@/lib/shopify/types";
import { isOnSale, savingsPercent } from "@/lib/shopify/utils";
import { Price } from "./Price";

export function ProductCard({ product, priority = false }: { product: ProductCardType; priority?: boolean }) {
  const price = product.priceRange.minVariantPrice;
  const compareAt = product.compareAtPriceRange.minVariantPrice;
  const sale = isOnSale(price, compareAt);
  const hasRange = product.priceRange.minVariantPrice.amount !== product.priceRange.maxVariantPrice.amount;

  return (
    <Link href={`/products/${product.handle}`} className="group flex flex-col">
      <div className="relative aspect-square overflow-hidden rounded-3xl bg-paper-soft">
        {product.featuredImage ? (
          <Image
            src={product.featuredImage.url}
            alt={product.featuredImage.altText ?? product.title}
            fill
            priority={priority}
            sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw"
            className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-neutral-400">No image</div>
        )}
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {sale && <span className="badge-sale">Save {savingsPercent(price, compareAt)}%</span>}
          {!product.availableForSale && <span className="badge-muted">Sold out</span>}
        </div>
      </div>
      <div className="mt-4 flex flex-1 flex-col gap-1">
        {product.vendor && (
          <p className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500">{product.vendor}</p>
        )}
        <h3 className="text-base font-medium leading-snug group-hover:underline">{product.title}</h3>
        <div className="mt-auto pt-1">
          <Price price={price} compareAt={sale ? compareAt : null} from={hasRange && !sale} />
        </div>
      </div>
    </Link>
  );
}
