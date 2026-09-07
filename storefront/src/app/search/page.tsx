import type { Metadata } from "next";
import Link from "next/link";
import { homeCategories } from "@/lib/config";
import { searchProducts } from "@/lib/shopify";
import { SearchIcon } from "@/components/Icons";
import { ProductGrid } from "@/components/product/ProductGrid";

type Props = { searchParams: Promise<{ q?: string }> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { q } = await searchParams;
  return { title: q ? `Search: ${q}` : "Search", robots: { index: false } };
}

export default async function SearchPage({ searchParams }: Props) {
  const { q = "" } = await searchParams;
  const term = q.trim();
  const products = term ? await searchProducts(term) : [];

  return (
    <div className="container-x py-12 lg:py-16">
      <h1 className="text-4xl font-bold sm:text-5xl">Search</h1>
      <form action="/search" method="get" className="relative mt-8 max-w-2xl">
        <label htmlFor="search-q" className="sr-only">
          Search products
        </label>
        <input
          id="search-q"
          name="q"
          type="search"
          defaultValue={term}
          placeholder="Search bidet seats, attachments, sprayers…"
          autoFocus
          className="input h-14 pl-12 text-lg"
        />
        <SearchIcon size={22} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
        <button type="submit" className="btn btn-primary btn-sm absolute right-2 top-1/2 -translate-y-1/2">
          Search
        </button>
      </form>

      {term ? (
        <div className="mt-10">
          <p className="text-sm text-neutral-500">
            {products.length} result{products.length === 1 ? "" : "s"} for “{term}”
          </p>
          <div className="mt-6">
            <ProductGrid products={products} columns={4} emptyMessage={`Nothing matched “${term}”. Try a different word, or take the quiz below.`} />
          </div>
          {products.length === 0 && (
            <Link href="/quiz" className="btn btn-primary mt-8">
              Take the Bidet Quiz
            </Link>
          )}
        </div>
      ) : (
        <div className="mt-10">
          <p className="text-sm font-semibold uppercase tracking-wider text-neutral-500">Browse by category</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {homeCategories.map((c) => (
              <Link key={c.handle} href={`/collections/${c.handle}`} className="rounded-full border-2 border-neutral-200 px-4 py-2 text-sm font-medium hover:border-ink">
                {c.title}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
