import Image from "next/image";
import Link from "next/link";
import type { Article } from "@/lib/shopify/types";

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

export function ArticleCard({ article, blogHandle }: { article: Article; blogHandle: string }) {
  const href = `/blogs/${blogHandle}/${article.handle}`;
  return (
    <article className="group flex flex-col">
      <Link href={href} className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-paper-soft">
        {article.image ? (
          <Image
            src={article.image.url}
            alt={article.image.altText ?? article.title}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-peach/60 to-mint/40" />
        )}
      </Link>
      <div className="mt-4">
        <p className="text-xs text-neutral-500">
          <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
          {article.tags[0] && <> · {article.tags[0]}</>}
        </p>
        <h3 className="mt-1 text-lg font-semibold leading-snug">
          <Link href={href} className="group-hover:underline">
            {article.title}
          </Link>
        </h3>
        {article.excerpt && <p className="mt-2 line-clamp-2 text-sm text-neutral-600">{article.excerpt}</p>}
      </div>
    </article>
  );
}
