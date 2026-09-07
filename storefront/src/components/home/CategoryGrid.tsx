import Image from "next/image";
import Link from "next/link";
import { homeCategories } from "@/lib/config";
import { getCollections } from "@/lib/shopify";
import { ArrowRightIcon } from "@/components/Icons";

export async function CategoryGrid({ heading = "Shop by category" }: { heading?: string }) {
  let collections: Awaited<ReturnType<typeof getCollections>> = [];
  try {
    collections = await getCollections();
  } catch {
    collections = [];
  }
  const byHandle = new Map(collections.map((c) => [c.handle, c]));

  return (
    <section className="container-x py-16 lg:py-24">
      <div className="flex items-end justify-between gap-4">
        <h2 className="text-3xl font-bold sm:text-4xl">
          <span className="highlight">{heading}</span>
        </h2>
        <Link href="/collections/all-bidets-1" className="hidden items-center gap-1 text-sm font-medium underline-offset-4 hover:underline sm:inline-flex">
          View all bidets <ArrowRightIcon size={16} />
        </Link>
      </div>

      <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
        {homeCategories.map((cat, i) => {
          const c = byHandle.get(cat.handle);
          const image = c?.image ?? null;
          return (
            <Link
              key={cat.handle}
              href={`/collections/${cat.handle}`}
              className={`group flex flex-col overflow-hidden rounded-3xl bg-paper-soft ring-1 ring-neutral-200/70 transition hover:ring-ink ${i === 0 ? "lg:col-span-2 lg:row-span-2" : ""}`}
            >
              <div className={`relative w-full ${i === 0 ? "aspect-square lg:aspect-auto lg:flex-1" : "aspect-[4/3]"}`}>
                {image ? (
                  <Image
                    src={image.url}
                    alt={image.altText ?? cat.title}
                    fill
                    sizes={i === 0 ? "(min-width: 1024px) 50vw, 100vw" : "(min-width: 1024px) 25vw, 50vw"}
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-mint/40 via-paper-soft to-peach/50" />
                )}
              </div>
              <div className="flex items-center justify-between gap-3 p-4 sm:p-5">
                <div>
                  <h3 className="text-base font-semibold sm:text-lg">{c?.title ?? cat.title}</h3>
                  <p className="mt-0.5 text-xs text-neutral-500 sm:text-sm">{cat.blurb}</p>
                </div>
                <ArrowRightIcon size={18} className="shrink-0 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
