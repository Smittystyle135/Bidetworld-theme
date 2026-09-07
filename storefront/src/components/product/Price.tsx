import type { Money } from "@/lib/shopify/types";
import { formatMoney, isOnSale, savingsPercent } from "@/lib/shopify/utils";

export function Price({
  price,
  compareAt,
  from = false,
  size = "md",
  showSavings = false,
}: {
  price: Money;
  compareAt?: Money | null;
  from?: boolean;
  size?: "sm" | "md" | "lg";
  showSavings?: boolean;
}) {
  const sale = isOnSale(price, compareAt);
  const sizeClass = size === "lg" ? "text-2xl" : size === "sm" ? "text-sm" : "text-base";

  return (
    <span className={`inline-flex flex-wrap items-baseline gap-x-2 gap-y-0.5 ${sizeClass}`}>
      {from && <span className="text-neutral-500">From</span>}
      <span className={`font-semibold tabular-nums ${sale ? "text-sale" : "text-ink"}`}>{formatMoney(price)}</span>
      {sale && compareAt && (
        <>
          <s className="text-neutral-400 tabular-nums">{formatMoney(compareAt)}</s>
          {showSavings && <span className="badge-sale">Save {savingsPercent(price, compareAt)}%</span>}
        </>
      )}
    </span>
  );
}
