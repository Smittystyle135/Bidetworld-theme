import Link from "next/link";
import { getBlog } from "@/lib/shopify";
import { ArrowRightIcon } from "@/components/Icons";
import { ArticleCard } from "@/components/blog/ArticleCard";

export async function LatestArticles() {
  let data: Awaited<ReturnType<typeof getBlog>> = null;
  try {
    data = await getBlog("news", 4);
  } catch {
    data = null;
  }
  if (!data || data.articles.length === 0) return null;

  return (
    <section className="container-x py-16 lg:py-24">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold sm:text-4xl">Bidet World Blog</h2>
        <p className="mt-3 text-neutral-600">
          In-depth bidet guides: cost-saving strategies, eco-friendly benefits and expert tips for a cleaner bathroom routine.
        </p>
      </div>
      <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {data.articles.map((a) => (
          <ArticleCard key={a.id} article={a} blogHandle={data.blog.handle} />
        ))}
      </div>
      <div className="mt-10 text-center">
        <Link href={`/blogs/${data.blog.handle}`} className="btn btn-secondary">
          Read all articles <ArrowRightIcon size={16} />
        </Link>
      </div>
    </section>
  );
}
