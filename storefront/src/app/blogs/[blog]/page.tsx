import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBlog } from "@/lib/shopify";
import { ArticleCard } from "@/components/blog/ArticleCard";
import { QuizCta } from "@/components/home/QuizCta";

type Props = { params: Promise<{ blog: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { blog } = await params;
  const data = await getBlog(blog, 1);
  if (!data) return { title: "Blog not found" };
  return { title: data.blog.title, description: `Articles and guides from ${data.blog.title} at Bidet World.` };
}

export default async function BlogPage({ params }: Props) {
  const { blog } = await params;
  const data = await getBlog(blog, 48);
  if (!data) notFound();

  return (
    <>
      <div className="container-x py-12 lg:py-16">
        <h1 className="text-4xl font-bold sm:text-5xl">{data.blog.title === "News" ? "Bidet World Blog" : data.blog.title}</h1>
        <p className="mt-3 max-w-2xl text-neutral-600">
          In-depth bidet guides: cost-saving strategies, eco-friendly benefits and expert tips for a cleaner bathroom routine.
        </p>
        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {data.articles.map((a) => (
            <ArticleCard key={a.id} article={a} blogHandle={data.blog.handle} />
          ))}
        </div>
        {data.articles.length === 0 && <p className="mt-10 text-neutral-500">No articles yet.</p>}
      </div>
      <QuizCta compact />
    </>
  );
}
