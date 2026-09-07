import Link from "next/link";
import { ArrowRightIcon, CheckIcon } from "@/components/Icons";

const points = ["5 quick questions, about 60 seconds", "Matches your toilet, outlet and budget", "Real products you can buy today"];

export function QuizCta({ compact = false }: { compact?: boolean }) {
  return (
    <section className={`bg-ink text-white ${compact ? "py-12" : "py-20"}`}>
      <div className="container-x flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-peach">Bidet Quiz</p>
          <h2 className="mt-3 text-3xl font-bold sm:text-4xl lg:text-5xl">Not sure what bidet? Take the quiz!</h2>
          {!compact && (
            <ul className="mt-6 space-y-2 text-neutral-300">
              {points.map((p) => (
                <li key={p} className="flex items-center gap-2">
                  <CheckIcon size={18} className="text-mint" /> {p}
                </li>
              ))}
            </ul>
          )}
        </div>
        <Link href="/quiz" className="btn btn-light btn-lg shrink-0">
          Find your perfect bidet <ArrowRightIcon size={18} />
        </Link>
      </div>
    </section>
  );
}
