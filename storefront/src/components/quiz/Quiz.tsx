"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { quizQuestions, recommend, type QuizAnswers, type Recommendation } from "@/lib/quiz";
import { getQuizProducts, type QuizProductsResult } from "@/lib/quiz/actions";
import { site } from "@/lib/config";
import { ArrowRightIcon, CheckIcon, ChevronLeftIcon, PhoneIcon } from "@/components/Icons";
import { ProductGrid } from "@/components/product/ProductGrid";

export function Quiz() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>({});
  const [result, setResult] = useState<Recommendation | null>(null);

  const question = quizQuestions[step];
  const total = quizQuestions.length;
  const current = answers[question?.id] ?? [];

  function choose(optionId: string) {
    if (question.multi) {
      const next = current.includes(optionId) ? current.filter((x) => x !== optionId) : [...current, optionId];
      setAnswers((a) => ({ ...a, [question.id]: next }));
      return;
    }
    const nextAnswers = { ...answers, [question.id]: [optionId] };
    setAnswers(nextAnswers);
    advance(nextAnswers);
  }

  function advance(nextAnswers: QuizAnswers) {
    if (step + 1 < total) {
      setStep(step + 1);
    } else {
      setResult(recommend(nextAnswers));
    }
  }

  function restart() {
    setStep(0);
    setAnswers({});
    setResult(null);
  }

  if (result) {
    return <QuizResult key={`${result.key}-${result.minPrice ?? ""}-${result.maxPrice ?? ""}`} result={result} onRestart={restart} />;
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="flex items-center justify-between text-sm text-neutral-500">
        <span>
          Question {step + 1} of {total}
        </span>
        {step > 0 && (
          <button type="button" onClick={() => setStep(step - 1)} className="inline-flex items-center gap-1 font-medium text-ink hover:underline">
            <ChevronLeftIcon size={16} /> Back
          </button>
        )}
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-neutral-200">
        <div className="h-full rounded-full bg-ink transition-all duration-500" style={{ width: `${((step + 1) / total) * 100}%` }} />
      </div>

      <div key={question.id} className="animate-fade-up mt-10">
        <h2 className="text-3xl font-bold sm:text-4xl">{question.title}</h2>
        {question.subtitle && <p className="mt-3 text-neutral-600">{question.subtitle}</p>}

        <div className={`mt-8 grid gap-3 ${question.multi ? "sm:grid-cols-2" : ""}`}>
          {question.options.map((opt) => {
            const active = current.includes(opt.id);
            return (
              <button
                key={opt.id}
                type="button"
                aria-pressed={active}
                onClick={() => choose(opt.id)}
                className={`flex items-center justify-between gap-4 rounded-3xl border-2 px-6 py-5 text-left transition ${
                  active ? "border-ink bg-ink text-white" : "border-neutral-200 bg-white hover:border-ink"
                }`}
              >
                <span>
                  <span className="block text-lg font-semibold">{opt.label}</span>
                  {opt.description && <span className={`mt-0.5 block text-sm ${active ? "text-neutral-300" : "text-neutral-500"}`}>{opt.description}</span>}
                </span>
                <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 ${active ? "border-white bg-white text-ink" : "border-neutral-300"}`}>
                  {active && <CheckIcon size={16} />}
                </span>
              </button>
            );
          })}
        </div>

        {question.multi && (
          <button type="button" onClick={() => advance(answers)} className="btn btn-primary btn-lg mt-8 w-full sm:w-auto">
            {current.length > 0 ? "Continue" : "Skip"} <ArrowRightIcon size={18} />
          </button>
        )}
      </div>
    </div>
  );
}

function QuizResult({ result, onRestart }: { result: Recommendation; onRestart: () => void }) {
  const [data, setData] = useState<QuizProductsResult | null>(null);

  useEffect(() => {
    let cancelled = false;
    getQuizProducts(result.collectionHandle, result.minPrice, result.maxPrice).then((r) => {
      if (!cancelled) setData(r);
    });
    return () => {
      cancelled = true;
    };
  }, [result]);

  return (
    <div className="animate-fade-up">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-neutral-500">Our recommendation</p>
        <h2 className="mt-3 text-4xl font-bold sm:text-5xl">
          <span className="highlight">{result.title}</span>
        </h2>
        <p className="mt-5 text-lg text-neutral-600">{result.reason}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href={`/collections/${result.collectionHandle}`} className="btn btn-primary btn-lg">
            Shop all {result.collectionTitle} <ArrowRightIcon size={18} />
          </Link>
          <button type="button" onClick={onRestart} className="btn btn-secondary btn-lg">
            Retake the quiz
          </button>
        </div>
      </div>

      <div className="mt-16">
        <div className="flex items-end justify-between gap-4">
          <h3 className="text-2xl font-bold">Picks for you</h3>
          {data && !data.matchedBudget && data.products.length > 0 && (
            <p className="text-sm text-neutral-500">Nothing in your exact budget right now — here&apos;s the closest.</p>
          )}
        </div>
        <div className="mt-6">
          {data ? (
            <ProductGrid products={data.products} columns={4} emptyMessage="We couldn't load products right now. Use the button above to browse the collection." />
          ) : (
            <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="aspect-square animate-pulse rounded-3xl bg-paper-soft" />
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-16 grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl bg-paper-soft p-7 ring-1 ring-neutral-200/70">
          <h3 className="text-lg font-semibold">Good to know</h3>
          <ul className="mt-4 space-y-3 text-sm text-neutral-700">
            {result.tips.map((t) => (
              <li key={t} className="flex gap-3">
                <CheckIcon size={18} className="mt-0.5 shrink-0 text-success" /> {t}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col gap-6">
          {result.alsoConsider && (
            <div className="rounded-3xl bg-paper-soft p-7 ring-1 ring-neutral-200/70">
              <h3 className="text-lg font-semibold">Also consider: {result.alsoConsider.title}</h3>
              <p className="mt-2 text-sm text-neutral-700">{result.alsoConsider.why}</p>
              <Link href={result.alsoConsider.href} className="mt-4 inline-flex items-center gap-1 text-sm font-medium underline-offset-4 hover:underline">
                Browse {result.alsoConsider.title} <ArrowRightIcon size={16} />
              </Link>
            </div>
          )}
          <div className="rounded-3xl bg-ink p-7 text-white">
            <h3 className="text-lg font-semibold">Still not sure?</h3>
            <p className="mt-2 text-sm text-neutral-300">Talk to a real person. We&apos;ll help you pick the right bidet for your bathroom.</p>
            <a href={site.phoneHref} className="btn btn-light mt-4">
              <PhoneIcon size={16} /> {site.phone}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
