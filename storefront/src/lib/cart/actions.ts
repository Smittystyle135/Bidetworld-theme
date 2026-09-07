"use server";

import { cookies } from "next/headers";
import {
  addCartLines,
  createCart,
  getCart as fetchCart,
  removeCartLines,
  updateCartLines,
  type Cart,
} from "@/lib/shopify";

const CART_COOKIE = "bw_cart_id";

async function readCartId(): Promise<string | undefined> {
  return (await cookies()).get(CART_COOKIE)?.value;
}

async function writeCartId(id: string) {
  (await cookies()).set(CART_COOKIE, id, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export type CartResult = { cart: Cart | null; error?: string };

export async function getCartAction(): Promise<CartResult> {
  const id = await readCartId();
  if (!id) return { cart: null };
  try {
    return { cart: await fetchCart(id) };
  } catch (e) {
    return { cart: null, error: (e as Error).message };
  }
}

export async function addToCartAction(variantId: string, quantity = 1): Promise<CartResult> {
  try {
    const id = await readCartId();
    let cart: Cart | null = null;
    if (id) {
      try {
        cart = await addCartLines(id, [{ merchandiseId: variantId, quantity }]);
      } catch {
        cart = null; // stale/expired cart id — fall through to create
      }
    }
    if (!cart) {
      cart = await createCart([{ merchandiseId: variantId, quantity }]);
      await writeCartId(cart.id);
    }
    return { cart };
  } catch (e) {
    return { cart: null, error: (e as Error).message };
  }
}

export async function updateLineAction(lineId: string, quantity: number): Promise<CartResult> {
  const id = await readCartId();
  if (!id) return { cart: null, error: "No cart" };
  try {
    const cart =
      quantity <= 0
        ? await removeCartLines(id, [lineId])
        : await updateCartLines(id, [{ id: lineId, quantity }]);
    return { cart };
  } catch (e) {
    return { cart: null, error: (e as Error).message };
  }
}

export async function removeLineAction(lineId: string): Promise<CartResult> {
  const id = await readCartId();
  if (!id) return { cart: null, error: "No cart" };
  try {
    return { cart: await removeCartLines(id, [lineId]) };
  } catch (e) {
    return { cart: null, error: (e as Error).message };
  }
}
