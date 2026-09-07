"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import type { Product, ProductVariant } from "@/lib/shopify/types";
import { site } from "@/lib/config";
import { useCart } from "@/components/cart/CartProvider";
import { BoxIcon, CheckIcon, MinusIcon, PhoneIcon, PlusIcon, ShieldIcon, WalletIcon } from "@/components/Icons";
import { Price } from "./Price";

function hasRealOptions(product: Product) {
  return !(
    product.options.length === 1 &&
    product.options[0].optionValues.length === 1 &&
    product.options[0].optionValues[0].name === "Default Title"
  );
}

export function ProductView({ product, initialVariantId }: { product: Product; initialVariantId?: string }) {
  const initialVariant: ProductVariant =
    product.variants.find((v) => v.id === initialVariantId) ??
    product.variants.find((v) => v.availableForSale) ??
    product.variants[0];

  const [selected, setSelected] = useState<Record<string, string>>(
    Object.fromEntries(initialVariant.selectedOptions.map((o) => [o.name, o.value])),
  );
  const [quantity, setQuantity] = useState(1);
  const [manualImage, setManualImage] = useState<{ variantId: string; index: number } | null>(null);
  const [justAdded, setJustAdded] = useState(false);
  const { add, pending, error } = useCart();

  const variant = useMemo(
    () => product.variants.find((v) => v.selectedOptions.every((o) => selected[o.name] === o.value)),
    [product.variants, selected],
  );

  const images = product.images;
  const variantImageIndex = variant?.image ? images.findIndex((im) => im.url === variant.image?.url) : -1;
  const activeImage =
    manualImage && manualImage.variantId === (variant?.id ?? "")
      ? manualImage.index
      : Math.max(variantImageIndex, 0);
  const setActiveImage = (index: number) => setManualImage({ variantId: variant?.id ?? "", index });

  useEffect(() => {
    if (!variant || !hasRealOptions(product)) return;
    const url = new URL(window.location.href);
    url.searchParams.set("variant", variant.id.split("/").pop() ?? variant.id);
    window.history.replaceState(null, "", url.toString());
  }, [variant, product]);

  function isAvailable(optionName: string, value: string) {
    return product.variants.some(
      (v) =>
        v.availableForSale &&
        v.selectedOptions.every((o) => (o.name === optionName ? o.value === value : selected[o.name] === o.value)),
    );
  }

  async function handleAdd() {
    if (!variant) return;
    const ok = await add(variant.id, quantity);
    if (ok) {
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 2500);
    }
  }

  const canBuy = Boolean(variant?.availableForSale);
  const main = images[activeImage] ?? images[0] ?? null;

  return (
    <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
      <div>
        <div className="relative aspect-square overflow-hidden rounded-3xl bg-paper-soft">
          {main ? (
            <Image key={main.url} src={main.url} alt={main.altText ?? product.title} fill priority sizes="(min-width: 1024px) 50vw, 100vw" className="object-contain p-6" />
          ) : (
            <div className="flex h-full items-center justify-center text-neutral-400">No image</div>
          )}
        </div>
        {images.length > 1 && (
          <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
            {images.map((im, i) => (
              <button
                key={`${i}-${im.url}`}
                type="button"
                aria-label={`View image ${i + 1}`}
                aria-current={i === activeImage}
                onClick={() => setActiveImage(i)}
                className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-paper-soft ring-2 transition ${i === activeImage ? "ring-ink" : "ring-transparent hover:ring-neutral-300"}`}
              >
                <Image src={im.url} alt={im.altText ?? ""} fill sizes="80px" className="object-contain p-1.5" />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="lg:sticky lg:top-32 lg:self-start">
        {product.vendor && <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">{product.vendor}</p>}
        <h1 className="mt-2 text-3xl font-bold sm:text-4xl">{product.title}</h1>
        <div className="mt-4">
          {variant ? <Price price={variant.price} compareAt={variant.compareAtPrice} size="lg" showSavings /> : <Price price={product.priceRange.minVariantPrice} size="lg" />}
        </div>

        {hasRealOptions(product) && (
          <div className="mt-8 space-y-6">
            {product.options.map((opt) => (
              <fieldset key={opt.name}>
                <legend className="text-sm font-semibold">
                  {opt.name}: <span className="font-normal text-neutral-600">{selected[opt.name]}</span>
                </legend>
                <div className="mt-3 flex flex-wrap gap-2">
                  {opt.optionValues.map((v) => {
                    const active = selected[opt.name] === v.name;
                    const available = isAvailable(opt.name, v.name);
                    return (
                      <button
                        key={v.name}
                        type="button"
                        aria-pressed={active}
                        onClick={() => setSelected((s) => ({ ...s, [opt.name]: v.name }))}
                        className={`rounded-full border-2 px-4 py-2 text-sm font-medium transition ${
                          active ? "border-ink bg-ink text-white" : "border-neutral-200 bg-white hover:border-ink"
                        } ${available ? "" : "opacity-40 line-through"}`}
                      >
                        {v.name}
                      </button>
                    );
                  })}
                </div>
              </fieldset>
            ))}
          </div>
        )}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <div className="inline-flex h-14 items-center rounded-full border-2 border-neutral-200">
            <button type="button" aria-label="Decrease quantity" onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="px-4 py-3 hover:bg-neutral-100">
              <MinusIcon size={16} />
            </button>
            <span className="w-10 text-center font-medium tabular-nums">{quantity}</span>
            <button type="button" aria-label="Increase quantity" onClick={() => setQuantity((q) => q + 1)} className="px-4 py-3 hover:bg-neutral-100">
              <PlusIcon size={16} />
            </button>
          </div>
          <button type="button" onClick={handleAdd} disabled={!canBuy || pending} className="btn btn-primary btn-lg h-14 flex-1">
            {justAdded ? (
              <>
                <CheckIcon size={18} /> Added to cart
              </>
            ) : pending ? (
              "Adding…"
            ) : canBuy ? (
              "Add to cart"
            ) : (
              "Sold out"
            )}
          </button>
        </div>
        {error && <p className="mt-3 rounded-xl bg-error-bg px-4 py-2 text-sm text-error">{error}</p>}

        <ul className="mt-8 grid gap-3 rounded-3xl bg-paper-soft p-5 text-sm sm:grid-cols-2">
          <li className="flex items-center gap-2">
            <BoxIcon size={18} className="shrink-0" /> Free shipping on orders $100+
          </li>
          <li className="flex items-center gap-2">
            <WalletIcon size={18} className="shrink-0" /> 100% price match
          </li>
          <li className="flex items-center gap-2">
            <ShieldIcon size={18} className="shrink-0" /> Secure Shopify checkout
          </li>
          <li className="flex items-center gap-2">
            <PhoneIcon size={18} className="shrink-0" />
            <a href={site.phoneHref} className="underline-offset-2 hover:underline">
              Questions? {site.phone}
            </a>
          </li>
        </ul>

        {product.descriptionHtml && (
          <div className="mt-10">
            <h2 className="text-lg font-semibold">Description</h2>
            <div className="rte mt-3" dangerouslySetInnerHTML={{ __html: product.descriptionHtml }} />
          </div>
        )}
      </div>
    </div>
  );
}
