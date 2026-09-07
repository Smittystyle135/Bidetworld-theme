"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { CollectionSort } from "@/lib/shopify";

const options: { value: CollectionSort; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "best-selling", label: "Best selling" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "title", label: "Alphabetical" },
];

export function SortSelect({ value }: { value: CollectionSort }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return (
    <label className="inline-flex items-center gap-2 text-sm">
      <span className="text-neutral-500">Sort by</span>
      <select
        value={value}
        onChange={(e) => {
          const params = new URLSearchParams(searchParams.toString());
          params.set("sort", e.target.value);
          router.replace(`${pathname}?${params.toString()}`, { scroll: false });
        }}
        className="rounded-full border-2 border-neutral-200 bg-white px-4 py-2 font-medium focus:border-ink focus:outline-none"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
