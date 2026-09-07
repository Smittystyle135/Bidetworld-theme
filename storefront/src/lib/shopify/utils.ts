import type { Money } from "./types";

export function formatMoney(money: Money, opts: { trimZeros?: boolean } = {}): string {
  const amount = Number(money.amount);
  const formatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: money.currencyCode,
    minimumFractionDigits: opts.trimZeros && Number.isInteger(amount) ? 0 : 2,
  }).format(amount);
  return formatted;
}

export function isOnSale(price: Money, compareAt: Money | null | undefined): boolean {
  if (!compareAt) return false;
  return Number(compareAt.amount) > Number(price.amount);
}

export function savingsPercent(price: Money, compareAt: Money): number {
  const p = Number(price.amount);
  const c = Number(compareAt.amount);
  if (c <= 0 || p >= c) return 0;
  return Math.round(((c - p) / c) * 100);
}

// Shopify menu URLs are absolute (https://store.com/collections/x). Map them to local routes.
export function normalizeMenuUrl(url: string): string {
  let path = url;
  try {
    const parsed = new URL(url);
    path = parsed.pathname + parsed.search;
  } catch {
    // already relative
  }
  if (path === "/pages/bidet-quiz" || path === "/pages/quiz") return "/quiz";
  if (path === "" || path === "/") return "/";
  return path;
}
