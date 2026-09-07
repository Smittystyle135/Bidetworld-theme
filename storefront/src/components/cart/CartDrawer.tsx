"use client";

import Link from "next/link";
import { formatMoney } from "@/lib/shopify/utils";
import { CloseIcon } from "@/components/Icons";
import { CartLines } from "./CartLines";
import { useCart } from "./CartProvider";

export function CartDrawer() {
  const { cart, isOpen, closeCart, pending, error } = useCart();
  if (!isOpen) return null;

  const empty = !cart || cart.lines.length === 0;

  return (
    <div className="fixed inset-0 z-50">
      <button type="button" aria-label="Close cart" onClick={closeCart} className="absolute inset-0 bg-ink/50" />
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-title"
        className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-white shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-5">
          <h2 id="cart-title" className="text-xl font-bold">
            Your cart {cart && cart.totalQuantity > 0 && <span className="text-neutral-400">({cart.totalQuantity})</span>}
          </h2>
          <button type="button" aria-label="Close cart" onClick={closeCart} className="rounded-full p-2 hover:bg-neutral-100">
            <CloseIcon size={22} />
          </button>
        </div>

        <div className={`flex-1 overflow-y-auto px-6 ${pending ? "opacity-60" : ""}`}>
          {empty ? (
            <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
              <p className="text-lg font-medium">Your cart is empty</p>
              <p className="text-sm text-neutral-500">Not sure which bidet is right for you?</p>
              <Link href="/quiz" onClick={closeCart} className="btn btn-primary">
                Take the Bidet Quiz
              </Link>
              <Link href="/collections/all-bidets-1" onClick={closeCart} className="text-sm underline underline-offset-4">
                Browse all bidets
              </Link>
            </div>
          ) : (
            <CartLines cart={cart} compact />
          )}
        </div>

        {!empty && (
          <div className="border-t border-neutral-200 px-6 py-5">
            {error && <p className="mb-3 rounded-xl bg-error-bg px-4 py-2 text-sm text-error">{error}</p>}
            <div className="flex items-center justify-between text-base">
              <span className="font-medium">Subtotal</span>
              <span className="font-semibold tabular-nums">{formatMoney(cart.cost.subtotalAmount)}</span>
            </div>
            <p className="mt-1 text-xs text-neutral-500">Shipping, taxes and discount codes are calculated at checkout.</p>
            <a href={cart.checkoutUrl} className="btn btn-primary btn-lg mt-4 w-full">
              Checkout
            </a>
            <Link href="/cart" onClick={closeCart} className="mt-3 block text-center text-sm underline underline-offset-4">
              View full cart
            </Link>
          </div>
        )}
      </aside>
    </div>
  );
}
