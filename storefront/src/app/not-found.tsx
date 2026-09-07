import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-x py-24 text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-neutral-500">404</p>
      <h1 className="mt-3 text-4xl font-bold sm:text-5xl">We couldn&apos;t find that page</h1>
      <p className="mt-4 text-neutral-600">It may have moved, or the link might be out of date.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/collections/all-bidets-1" className="btn btn-primary">
          Shop all bidets
        </Link>
        <Link href="/quiz" className="btn btn-secondary">
          Take the Bidet Quiz
        </Link>
      </div>
    </div>
  );
}
