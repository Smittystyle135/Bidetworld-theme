import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { site } from "@/lib/config";
import { getArticle, getBlog } from "@/lib/shopify";
import { ArticleCard, formatDate } from "@/components/blog/ArticleCard";
import { QuizCta } from "@/components/home/QuizCta";

type Props = { params: Promise<{ blog: string; article: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { blog, article } = await params;
  const data = await getArticle(blog, article);
  if (!data) return { title: "Article not found" };
  const a = data.article;
  return {
    title: a.seo.title ?? a.title,
    description: a.seo.description ?? a.excerpt ?? undefined,
    openGraph: {
      type: "article",
      publishedTime: a.publishedAt,
      images: a.image ? [{ url: a.image.url }] : undefined,
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { blog, article } = await params;
  const data = await getArticle(blog, article);
  if (!data) notFound();
  const a = data.article;

  const more = await getBlog(blog, 5);
  const related = (more?.articles ?? []).filter((x) => x.handle !== a.handle).slice(0, 4);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: a.title,
    datePublished: a.publishedAt,
    image: a.image ? [a.image.url] : undefined,
    author: a.authorV2 ? { "@type": "Person", name: a.authorV2.name } : { "@type": "Organization", name: site.name },
    publisher: { "@type": "Organization", name: site.name },
    mainEntityOfPage: `${site.url}/blogs/${blog}/${a.handle}`,
  };

  return (
    <>
      <article className="container-x max-w-3xl py-12 lg:py-16">
        <nav aria-label="Breadcrumb" className="text-sm text-neutral-500">
          <Link href="/" className="hover:underline">
            Home
          </Link>{" "}
          /{" "}
          <Link href={`/blogs/${blog}`} className="hover:underline">
            {data.blog.title === "News" ? "Blog" : data.blog.title}
          </Link>
        </nav>
        <h1 className="mt-4 text-4xl font-bold sm:text-5xl">{a.title}</h1>
        <p className="mt-4 text-sm text-neutral-500">
          <time dateTime={a.publishedAt}>{formatDate(a.publishedAt)}</time>
          {a.authorV2?.name && <> · {a.authorV2.name}</>}
        </p>
        {a.image && (
          <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-3xl bg-paper-soft">
            <Image src={a.image.url} alt={a.image.altText ?? a.title} fill priority sizes="(min-width: 768px) 768px, 100vw" className="object-cover" />
          </div>
        )}
        <div className="rte mt-8 text-lg" dangerouslySetInnerHTML={{ __html: a.contentHtml }} />
        {a.tags.length > 0 && (
          <div className="mt-10 flex flex-wrap gap-2">
            {a.tags.map((t) => (
              <span key={t} className="badge-muted">
                {t}
              </span>
            ))}
          </div>
        )}
      </article>

      {related.length > 0 && (
        <section className="container-x border-t border-neutral-200 py-14">
          <h2 className="text-3xl font-bold">Latest stories</h2>
          <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((r) => (
              <ArticleCard key={r.id} article={r} blogHandle={blog} />
            ))}
          </div>
        </section>
      )}
      <QuizCta compact />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
