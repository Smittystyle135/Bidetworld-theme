import { brandLogos } from "@/lib/config";

export function BrandMarquee() {
  const items = [...brandLogos, ...brandLogos];
  return (
    <section aria-label="Brands we carry" className="overflow-hidden border-y border-neutral-200 bg-paper-soft py-6">
      <div className="animate-marquee flex w-max items-center gap-12 whitespace-nowrap px-6">
        {items.map((b, i) => (
          <span key={`${b}-${i}`} className="text-xl font-bold uppercase tracking-wide text-neutral-400 sm:text-2xl">
            {b}
          </span>
        ))}
      </div>
    </section>
  );
}
