"use client";

import { CartIcon } from "@/components/Icons";
import { useCart } from "./CartProvider";

export function CartButton() {
  const { cart, openCart } = useCart();
  const count = cart?.totalQuantity ?? 0;

  return (
    <button
      type="button"
      onClick={openCart}
      aria-label={`Open cart, ${count} item${count === 1 ? "" : "s"}`}
      className="relative rounded-full p-2.5 hover:bg-neutral-100"
    >
      <CartIcon size={22} />
      {count > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-ink px-1 text-[11px] font-semibold text-white">
          {count}
        </span>
      )}
    </button>
  );
}
