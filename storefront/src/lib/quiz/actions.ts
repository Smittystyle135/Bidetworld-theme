"use server";

import { getCollection, type ProductCard } from "@/lib/shopify";

export type QuizProductsResult = {
  products: ProductCard[];
  matchedBudget: boolean;
};

export async function getQuizProducts(
  collectionHandle: string,
  minPrice?: number,
  maxPrice?: number,
): Promise<QuizProductsResult> {
  try {
    const collection = await getCollection(collectionHandle, "best-selling");
    const all = (collection?.products ?? []).filter((p) => p.availableForSale);
    const inBudget = all.filter((p) => {
      const price = Number(p.priceRange.minVariantPrice.amount);
      if (minPrice !== undefined && price < minPrice) return false;
      if (maxPrice !== undefined && price > maxPrice) return false;
      return true;
    });
    if (inBudget.length > 0) return { products: inBudget.slice(0, 8), matchedBudget: true };
    return { products: all.slice(0, 8), matchedBudget: false };
  } catch {
    return { products: [], matchedBudget: false };
  }
}
