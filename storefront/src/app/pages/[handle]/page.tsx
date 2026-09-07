import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getPage } from "@/lib/shopify";
import { QuizCta } from "@/components/home/QuizCta";

type Props = { params: Promise<{ handle: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = await params;
  const page = await getPage(handle);
  if (!page) return { title: "Page not found" };
  return {
    title: page.seo.title ?? page.title,
    description: page.seo.description ?? undefined,
  };
}

export default async function ShopifyPage({ params }: Props) {
  const { handle } = await params;
  if (handle === "bidet-quiz" || handle === "quiz") redirect("/quiz");

  const page = await getPage(handle);
  if (!page) notFound();

  return (
    <>
      <article className="container-x max-w-4xl py-12 lg:py-16">
        <h1 className="text-4xl font-bold sm:text-5xl">{page.title}</h1>
        <div className="rte mt-8" dangerouslySetInnerHTML={{ __html: page.body }} />
      </article>
      <QuizCta compact />
    </>
  );
}
