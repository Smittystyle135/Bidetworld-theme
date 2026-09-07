"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { heroSlides } from "@/lib/config";
import { ArrowRightIcon, ChevronLeftIcon, ChevronRightIcon } from "@/components/Icons";

export function Hero() {
  const [index, setIndex] = useState(0);
  const count = heroSlides.length;

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % count), 8000);
    return () => clearInterval(id);
  }, [count]);

  const slide = heroSlides[index];

  return (
    <section className="relative overflow-hidden bg-ink text-white">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 top-1/3 h-96 w-96 rounded-full bg-mint/20 blur-3xl" />
        <div className="absolute -right-24 -top-24 h-[28rem] w-[28rem] rounded-full bg-peach/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-72 w-[40rem] -translate-x-1/2 rounded-full bg-focus/20 blur-3xl" />
      </div>

      <div className="container-x relative flex min-h-[70vh] flex-col justify-center py-20 lg:min-h-[78vh] lg:py-28">
        <div key={index} className="animate-fade-up max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-peach">{slide.eyebrow}</p>
          <h1 className="mt-4 text-5xl font-bold sm:text-6xl lg:text-7xl">{slide.heading}</h1>
          <p className="mt-6 max-w-xl text-lg text-neutral-300 sm:text-xl">{slide.text}</p>
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Link href={slide.cta.href} className="btn btn-light btn-lg">
              {slide.cta.label} <ArrowRightIcon size={18} />
            </Link>
            <Link href={slide.secondary.href} className="btn btn-ghost-light btn-lg">
              {slide.secondary.label}
            </Link>
          </div>
        </div>

        <div className="mt-14 flex items-center gap-4">
          <button
            type="button"
            aria-label="Previous slide"
            onClick={() => setIndex((i) => (i - 1 + count) % count)}
            className="rounded-full border border-white/30 p-2 hover:bg-white hover:text-ink"
          >
            <ChevronLeftIcon size={18} />
          </button>
          <div className="flex items-center gap-2">
            {heroSlides.map((s, i) => (
              <button
                key={s.heading}
                type="button"
                aria-label={`Go to slide ${i + 1}`}
                aria-current={i === index}
                onClick={() => setIndex(i)}
                className={`h-2 rounded-full transition-all ${i === index ? "w-8 bg-white" : "w-2 bg-white/40 hover:bg-white/70"}`}
              />
            ))}
          </div>
          <button
            type="button"
            aria-label="Next slide"
            onClick={() => setIndex((i) => (i + 1) % count)}
            className="rounded-full border border-white/30 p-2 hover:bg-white hover:text-ink"
          >
            <ChevronRightIcon size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}
