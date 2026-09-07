export type Money = { amount: string; currencyCode: string };

export type Image = {
  url: string;
  altText: string | null;
  width: number | null;
  height: number | null;
};

export type SelectedOption = { name: string; value: string };

export type ProductVariant = {
  id: string;
  title: string;
  availableForSale: boolean;
  selectedOptions: SelectedOption[];
  price: Money;
  compareAtPrice: Money | null;
  image: Image | null;
};

export type ProductOption = { name: string; optionValues: { name: string }[] };

export type ProductCard = {
  id: string;
  handle: string;
  title: string;
  vendor: string;
  availableForSale: boolean;
  featuredImage: Image | null;
  priceRange: { minVariantPrice: Money; maxVariantPrice: Money };
  compareAtPriceRange: { minVariantPrice: Money; maxVariantPrice: Money };
};

export type Product = ProductCard & {
  description: string;
  descriptionHtml: string;
  tags: string[];
  options: ProductOption[];
  images: Image[];
  variants: ProductVariant[];
  seo: { title: string | null; description: string | null };
};

export type Collection = {
  id: string;
  handle: string;
  title: string;
  description: string;
  descriptionHtml: string;
  image: Image | null;
};

export type CollectionWithProducts = Collection & { products: ProductCard[] };

export type MenuItem = { title: string; url: string; items: MenuItem[] };

export type Page = {
  title: string;
  handle: string;
  body: string;
  seo: { title: string | null; description: string | null };
};

export type CartLine = {
  id: string;
  quantity: number;
  cost: { totalAmount: Money };
  merchandise: {
    id: string;
    title: string;
    selectedOptions: SelectedOption[];
    price: Money;
    image: Image | null;
    product: { title: string; handle: string };
  };
};

export type Cart = {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: {
    subtotalAmount: Money;
    totalAmount: Money;
    totalTaxAmount: Money | null;
  };
  lines: CartLine[];
};

export type Article = {
  id: string;
  handle: string;
  title: string;
  excerpt: string | null;
  publishedAt: string;
  tags: string[];
  image: Image | null;
  authorV2: { name: string } | null;
};

export type ArticleWithContent = Article & {
  contentHtml: string;
  seo: { title: string | null; description: string | null };
};

export type Blog = { title: string; handle: string };

export type ProductSortKey =
  | "BEST_SELLING"
  | "CREATED"
  | "PRICE"
  | "TITLE"
  | "MANUAL"
  | "COLLECTION_DEFAULT"
  | "RELEVANCE";
