const domain = process.env.SHOPIFY_STORE_DOMAIN;
const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
const apiVersion = process.env.SHOPIFY_STOREFRONT_API_VERSION ?? "2025-07";
// Override for local development against scripts/mock-shopify.mjs.
const endpoint = process.env.SHOPIFY_STOREFRONT_API_URL ?? `https://${domain}/api/${apiVersion}/graphql.json`;

export function isShopifyConfigured(): boolean {
  return Boolean(domain && token);
}

export function storeDomain(): string {
  return domain ?? "";
}

export class ShopifyError extends Error {
  constructor(message: string, public readonly query?: string) {
    super(message);
    this.name = "ShopifyError";
  }
}

type FetchOptions = {
  query: string;
  variables?: Record<string, unknown>;
  // Seconds. `false` means never cache (cart operations).
  revalidate?: number | false;
  tags?: string[];
};

export async function shopifyFetch<T>({
  query,
  variables,
  revalidate = 60,
  tags,
}: FetchOptions): Promise<T> {
  if (!domain || !token) {
    throw new ShopifyError(
      "Shopify is not configured. Set SHOPIFY_STORE_DOMAIN and SHOPIFY_STOREFRONT_ACCESS_TOKEN.",
    );
  }

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": token,
    },
    body: JSON.stringify({ query, variables }),
    ...(revalidate === false
      ? { cache: "no-store" as const }
      : { next: { revalidate, tags } }),
  });

  if (!res.ok) {
    throw new ShopifyError(`Shopify responded ${res.status} ${res.statusText}`, query);
  }

  const json = (await res.json()) as {
    data?: T;
    errors?: { message: string }[];
  };

  if (json.errors?.length) {
    throw new ShopifyError(json.errors.map((e) => e.message).join("; "), query);
  }
  if (!json.data) {
    throw new ShopifyError("Shopify returned no data", query);
  }
  return json.data;
}
