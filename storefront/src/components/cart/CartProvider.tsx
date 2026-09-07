"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Cart } from "@/lib/shopify/types";
import { addToCartAction, getCartAction, removeLineAction, updateLineAction } from "@/lib/cart/actions";

type CartContextValue = {
  cart: Cart | null;
  loading: boolean;
  pending: boolean;
  error: string | null;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  add: (variantId: string, quantity?: number) => Promise<boolean>;
  update: (lineId: string, quantity: number) => Promise<void>;
  remove: (lineId: string) => Promise<void>;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    getCartAction()
      .then((r) => setCart(r.cart))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const run = useCallback(async (op: () => Promise<{ cart: Cart | null; error?: string }>) => {
    setPending(true);
    setError(null);
    try {
      const result = await op();
      if (result.error) {
        setError(result.error);
        return false;
      }
      setCart(result.cart);
      return true;
    } finally {
      setPending(false);
    }
  }, []);

  const value = useMemo<CartContextValue>(
    () => ({
      cart,
      loading,
      pending,
      error,
      isOpen,
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
      add: async (variantId, quantity = 1) => {
        const ok = await run(() => addToCartAction(variantId, quantity));
        if (ok) setIsOpen(true);
        return ok;
      },
      update: async (lineId, quantity) => {
        await run(() => updateLineAction(lineId, quantity));
      },
      remove: async (lineId) => {
        await run(() => removeLineAction(lineId));
      },
    }),
    [cart, loading, pending, error, isOpen, run],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
