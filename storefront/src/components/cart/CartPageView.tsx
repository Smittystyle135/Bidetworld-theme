"use client";

import Link from "next/link";
import { formatMoney } from "@/lib/shopify/utils";
import { CartLines } from "./CartLines";
import { useCart } from "./CartProvider";

export function CartPageView() {
  const { cart, loading, pending, error } = useCart();

  if (loading) {
    return (
      <div className="container-x py-16">
        <h1 className="text-4xl font-bold">Your cart</h1>
        <p className="mt-6 text-neutral-500">Loading…</p>
      </div>
    );
  }

  if (!cart || cart.lines.length === 0) {
    return (
      <div className="container-x py-16 text-center">
        <h1 className="text-4xl font-bold">Your cart is empty</h1>
        <p className="mt-3 text-neutral-600">Not sure which bidet is right for you?</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/quiz" className="btn btn-primary">
            Take the Bidet Quiz
          </Link>
          <Link href="/collections/all-bidets-1" className="btn btn-secondary">
            Browse all bidets
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-x py-12 lg:py-16">
      <h1 className="text-4xl font-bold sm:text-5xl">Your cart</h1>
      <div className="mt-10 grid gap-12 lg:grid-cols-3">
        <div className={`lg:col-span-2 ${pending ? "opacity-60" : ""}`}>
          <CartLines cart={cart} />
        </div>
        <aside className="h-fit rounded-3xl bg-paper-soft p-6 lg:sticky lg:top-32">
          <h2 className="text-lg font-semibold">Order summary</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-neutral-600">Subtotal</dt>
              <dd className="font-medium tabular-nums">{formatMoney(cart.cost.subtotalAmount)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-neutral-600">Shipping</dt>
              <dd className="text-neutral-500">Calculated at checkout</dd>
            </div>
          </dl>
          <p className="mt-4 text-xs text-neutral-500">Discount codes (like NEWCUSTOMER) are applied at checkout.</p>
          {error && <p className="mt-3 rounded-xl bg-error-bg px-4 py-2 text-sm text-error">{error}</p>}
          <a href={cart.checkoutUrl} className="btn btn-primary btn-lg mt-6 w-full">
            Checkout
          </a>
          <Link href="/collections/all-bidets-1" className="mt-3 block text-center text-sm underline underline-offset-4">
            Continue shopping
          </Link>
        </aside>
      </div>
    </div>
  );
}
