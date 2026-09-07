"use client";

import Image from "next/image";
import Link from "next/link";
import type { Cart } from "@/lib/shopify/types";
import { formatMoney } from "@/lib/shopify/utils";
import { CloseIcon, MinusIcon, PlusIcon } from "@/components/Icons";
import { useCart } from "./CartProvider";

export function CartLines({ cart, compact = false }: { cart: Cart; compact?: boolean }) {
  const { update, remove, pending } = useCart();

  return (
    <ul className="divide-y divide-neutral-200">
      {cart.lines.map((line) => {
        const { merchandise: m } = line;
        const options = m.selectedOptions.filter((o) => o.value !== "Default Title");
        return (
          <li key={line.id} className="flex gap-4 py-5">
            <Link href={`/products/${m.product.handle}`} className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-paper-soft">
              {m.image && (
                <Image src={m.image.url} alt={m.image.altText ?? m.product.title} fill sizes="96px" className="object-contain p-1" />
              )}
            </Link>
            <div className="flex min-w-0 flex-1 flex-col">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <Link href={`/products/${m.product.handle}`} className={`block font-medium leading-snug hover:underline ${compact ? "text-sm" : "text-base"}`}>
                    {m.product.title}
                  </Link>
                  {options.length > 0 && (
                    <p className="mt-0.5 text-xs text-neutral-500">{options.map((o) => o.value).join(" / ")}</p>
                  )}
                </div>
                <button
                  type="button"
                  aria-label={`Remove ${m.product.title}`}
                  disabled={pending}
                  onClick={() => remove(line.id)}
                  className="rounded-full p-1 text-neutral-400 hover:bg-neutral-100 hover:text-ink"
                >
                  <CloseIcon size={16} />
                </button>
              </div>
              <div className="mt-auto flex items-center justify-between pt-3">
                <div className="inline-flex items-center rounded-full border border-neutral-300">
                  <button
                    type="button"
                    aria-label="Decrease quantity"
                    disabled={pending}
                    onClick={() => update(line.id, line.quantity - 1)}
                    className="p-2 hover:bg-neutral-100 disabled:opacity-50"
                  >
                    <MinusIcon size={14} />
                  </button>
                  <span className="w-8 text-center text-sm font-medium tabular-nums">{line.quantity}</span>
                  <button
                    type="button"
                    aria-label="Increase quantity"
                    disabled={pending}
                    onClick={() => update(line.id, line.quantity + 1)}
                    className="p-2 hover:bg-neutral-100 disabled:opacity-50"
                  >
                    <PlusIcon size={14} />
                  </button>
                </div>
                <span className="text-sm font-semibold tabular-nums">{formatMoney(line.cost.totalAmount)}</span>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
