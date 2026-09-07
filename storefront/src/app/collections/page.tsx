import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getCollections } from "@/lib/shopify";

export const metadata: Metadata = { title: "All collections" };

export default async function CollectionsPage() {
  const collections = await getCollections().catch(() => []);

  return (
    <div className="container-x py-12 lg:py-16">
      <h1 className="text-4xl font-bold sm:text-5xl">All collections</h1>
      <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
        {collections.map((c) => (
          <Link key={c.id} href={`/collections/${c.handle}`} className="group overflow-hidden rounded-3xl bg-paper-soft ring-1 ring-neutral-200/70 transition hover:ring-ink">
            <div className="relative aspect-[4/3]">
              {c.image ? (
                <Image src={c.image.url} alt={c.image.altText ?? c.title} fill sizes="(min-width: 1024px) 25vw, 50vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-mint/40 to-peach/50" />
              )}
            </div>
            <div className="p-4">
              <h2 className="font-semibold group-hover:underline">{c.title}</h2>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
