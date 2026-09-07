import type { Metadata } from "next";
import { Quiz } from "@/components/quiz/Quiz";

export const metadata: Metadata = {
  title: "Bidet Quiz – Find your perfect bidet",
  description:
    "Answer 5 quick questions and we'll recommend the right bidet seat, attachment, smart toilet or assisted toilet lift for your bathroom and budget.",
};

export default function QuizPage() {
  return (
    <div className="container-x py-12 lg:py-20">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-neutral-500">Bidet Quiz</p>
        <h1 className="mt-3 text-4xl font-bold sm:text-5xl">Find your perfect bidet</h1>
        <p className="mt-4 text-neutral-600">Five quick questions. About 60 seconds. Real products you can buy today.</p>
      </div>
      <div className="mt-12">
        <Quiz />
      </div>
    </div>
  );
}
