import { fallbackNav } from "@/lib/config";
import { shopifyFetch } from "./client";
import {
  ALL_HANDLES_QUERY,
  ARTICLE_QUERY,
  BLOG_QUERY,
  CART_CREATE_MUTATION,
  CART_LINES_ADD_MUTATION,
  CART_LINES_REMOVE_MUTATION,
  CART_LINES_UPDATE_MUTATION,
  CART_QUERY,
  COLLECTION_QUERY,
  COLLECTIONS_QUERY,
  MENU_QUERY,
  PAGE_QUERY,
  PRODUCT_QUERY,
  PRODUCT_RECOMMENDATIONS_QUERY,
  PRODUCTS_QUERY,
} from "./queries";
import type {
  Article,
  ArticleWithContent,
  Blog,
  Cart,
  Collection,
  CollectionWithProducts,
  Image,
  MenuItem,
  Page,
  Product,
  ProductCard,
  ProductVariant,
} from "./types";
import { normalizeMenuUrl } from "./utils";

export { isShopifyConfigured, storeDomain, ShopifyError } from "./client";
export * from "./types";
export * from "./utils";

type Connection<T> = { nodes: T[] };

type RawMenuItem = { title: string; url: string; items?: RawMenuItem[] };
type RawProduct = Omit<Product, "images" | "variants"> & {
  images: Connection<Image>;
  variants: Connection<ProductVariant>;
};
type RawCart = Omit<Cart, "lines"> & { lines: Connection<Cart["lines"][number]> };

function reshapeMenu(items: RawMenuItem[]): MenuItem[] {
  return items.map((item) => ({
    title: item.title,
    url: normalizeMenuUrl(item.url),
    items: item.items ? reshapeMenu(item.items) : [],
  }));
}

function reshapeProduct(raw: RawProduct): Product {
  return { ...raw, images: raw.images.nodes, variants: raw.variants.nodes };
}

function reshapeCart(raw: RawCart): Cart {
  return { ...raw, lines: raw.lines.nodes };
}

export async function getMenu(): Promise<MenuItem[]> {
  const handle = process.env.SHOPIFY_MENU_HANDLE ?? "main-menu";
  try {
    const data = await shopifyFetch<{ menu: { items: RawMenuItem[] } | null }>({
      query: MENU_QUERY,
      variables: { handle },
      revalidate: 3600,
      tags: ["menu"],
    });
    const items = data.menu?.items ?? [];
    return items.length ? reshapeMenu(items) : fallbackNav.map((i) => ({ ...i, items: [] }));
  } catch {
    return fallbackNav.map((i) => ({ ...i, items: [] }));
  }
}

export async function getCollections(): Promise<Collection[]> {
  const data = await shopifyFetch<{ collections: Connection<Collection> }>({
    query: COLLECTIONS_QUERY,
    revalidate: 600,
    tags: ["collections"],
  });
  return data.collections.nodes;
}

export type CollectionSort = "featured" | "best-selling" | "newest" | "price-asc" | "price-desc" | "title";

const collectionSortMap: Record<CollectionSort, { sortKey: string; reverse: boolean }> = {
  featured: { sortKey: "COLLECTION_DEFAULT", reverse: false },
  "best-selling": { sortKey: "BEST_SELLING", reverse: false },
  newest: { sortKey: "CREATED", reverse: true },
  "price-asc": { sortKey: "PRICE", reverse: false },
  "price-desc": { sortKey: "PRICE", reverse: true },
  title: { sortKey: "TITLE", reverse: false },
};

export async function getCollection(
  handle: string,
  sort: CollectionSort = "featured",
): Promise<CollectionWithProducts | null> {
  const { sortKey, reverse } = collectionSortMap[sort] ?? collectionSortMap.featured;
  const data = await shopifyFetch<{
    collection: (Collection & { products: Connection<ProductCard> }) | null;
  }>({
    query: COLLECTION_QUERY,
    variables: { handle, sortKey, reverse },
    revalidate: 300,
    tags: ["collections", `collection:${handle}`],
  });
  if (!data.collection) return null;
  return { ...data.collection, products: data.collection.products.nodes };
}

export async function getProducts(opts: {
  first?: number;
  query?: string;
  sortKey?: string;
  reverse?: boolean;
} = {}): Promise<ProductCard[]> {
  const data = await shopifyFetch<{ products: Connection<ProductCard> }>({
    query: PRODUCTS_QUERY,
    variables: {
      first: opts.first ?? 24,
      query: opts.query,
      sortKey: opts.sortKey ?? "BEST_SELLING",
      reverse: opts.reverse ?? false,
    },
    revalidate: 300,
    tags: ["products"],
  });
  return data.products.nodes;
}

export async function searchProducts(term: string): Promise<ProductCard[]> {
  if (!term.trim()) return [];
  // Escape quotes for Shopify's search syntax; wildcard for partial matches.
  const safe = term.replace(/["\\]/g, " ").trim();
  return getProducts({ first: 48, query: `${safe}*`, sortKey: "RELEVANCE" });
}

export async function getProduct(handle: string): Promise<Product | null> {
  const data = await shopifyFetch<{ product: RawProduct | null }>({
    query: PRODUCT_QUERY,
    variables: { handle },
    revalidate: 300,
    tags: ["products", `product:${handle}`],
  });
  return data.product ? reshapeProduct(data.product) : null;
}

export async function getProductRecommendations(productId: string): Promise<ProductCard[]> {
  try {
    const data = await shopifyFetch<{ productRecommendations: ProductCard[] | null }>({
      query: PRODUCT_RECOMMENDATIONS_QUERY,
      variables: { productId },
      revalidate: 600,
      tags: ["products"],
    });
    return data.productRecommendations ?? [];
  } catch {
    return [];
  }
}

export async function getPage(handle: string): Promise<Page | null> {
  const data = await shopifyFetch<{ page: Page | null }>({
    query: PAGE_QUERY,
    variables: { handle },
    revalidate: 600,
    tags: ["pages"],
  });
  return data.page;
}

export async function getBlog(
  handle: string,
  first = 24,
): Promise<{ blog: Blog; articles: Article[] } | null> {
  const data = await shopifyFetch<{
    blog: (Blog & { articles: Connection<Article> }) | null;
  }>({
    query: BLOG_QUERY,
    variables: { handle, first },
    revalidate: 300,
    tags: ["blog"],
  });
  if (!data.blog) return null;
  const { articles, ...blog } = data.blog;
  return { blog, articles: articles.nodes };
}

export async function getArticle(
  blogHandle: string,
  articleHandle: string,
): Promise<{ blog: Blog; article: ArticleWithContent } | null> {
  const data = await shopifyFetch<{
    blog: (Blog & { articleByHandle: ArticleWithContent | null }) | null;
  }>({
    query: ARTICLE_QUERY,
    variables: { blog: blogHandle, handle: articleHandle },
    revalidate: 300,
    tags: ["blog"],
  });
  if (!data.blog?.articleByHandle) return null;
  const { articleByHandle, ...blog } = data.blog;
  return { blog, article: articleByHandle };
}

export async function getAllHandles(): Promise<{
  products: { handle: string; updatedAt: string }[];
  collections: { handle: string; updatedAt: string }[];
  articles: { handle: string; publishedAt: string }[];
}> {
  const data = await shopifyFetch<{
    products: Connection<{ handle: string; updatedAt: string }>;
    collections: Connection<{ handle: string; updatedAt: string }>;
    blog: { articles: Connection<{ handle: string; publishedAt: string }> } | null;
  }>({ query: ALL_HANDLES_QUERY, revalidate: 3600 });
  return {
    products: data.products.nodes,
    collections: data.collections.nodes,
    articles: data.blog?.articles.nodes ?? [],
  };
}

// ---- Cart ----

type CartLineInput = { merchandiseId: string; quantity: number };
type CartPayload = { cart: RawCart | null; userErrors: { message: string }[] };

function unwrapCart(payload: CartPayload): Cart {
  if (payload.userErrors.length) {
    throw new Error(payload.userErrors.map((e) => e.message).join("; "));
  }
  if (!payload.cart) throw new Error("Cart not returned");
  return reshapeCart(payload.cart);
}

export async function getCart(cartId: string): Promise<Cart | null> {
  const data = await shopifyFetch<{ cart: RawCart | null }>({
    query: CART_QUERY,
    variables: { id: cartId },
    revalidate: false,
  });
  return data.cart ? reshapeCart(data.cart) : null;
}

export async function createCart(lines: CartLineInput[] = []): Promise<Cart> {
  const data = await shopifyFetch<{ cartCreate: CartPayload }>({
    query: CART_CREATE_MUTATION,
    variables: { lines },
    revalidate: false,
  });
  return unwrapCart(data.cartCreate);
}

export async function addCartLines(cartId: string, lines: CartLineInput[]): Promise<Cart> {
  const data = await shopifyFetch<{ cartLinesAdd: CartPayload }>({
    query: CART_LINES_ADD_MUTATION,
    variables: { cartId, lines },
    revalidate: false,
  });
  return unwrapCart(data.cartLinesAdd);
}

export async function updateCartLines(
  cartId: string,
  lines: { id: string; quantity: number }[],
): Promise<Cart> {
  const data = await shopifyFetch<{ cartLinesUpdate: CartPayload }>({
    query: CART_LINES_UPDATE_MUTATION,
    variables: { cartId, lines },
    revalidate: false,
  });
  return unwrapCart(data.cartLinesUpdate);
}

export async function removeCartLines(cartId: string, lineIds: string[]): Promise<Cart> {
  const data = await shopifyFetch<{ cartLinesRemove: CartPayload }>({
    query: CART_LINES_REMOVE_MUTATION,
    variables: { cartId, lineIds },
    revalidate: false,
  });
  return unwrapCart(data.cartLinesRemove);
}
