"use client";

import Link from "next/link";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="container-x py-24 text-center">
      <h1 className="text-4xl font-bold sm:text-5xl">Something went wrong</h1>
      <p className="mt-4 text-neutral-600">We couldn&apos;t load this page. Please try again.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button type="button" onClick={reset} className="btn btn-primary">
          Try again
        </button>
        <Link href="/" className="btn btn-secondary">
          Go home
        </Link>
      </div>
    </div>
  );
}
