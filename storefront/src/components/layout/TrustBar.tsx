import { trustPoints } from "@/lib/config";
import { trustIcons } from "@/components/Icons";

export function TrustBar() {
  return (
    <section aria-label="Why shop with us" className="border-t border-neutral-200 bg-white">
      <div className="container-x grid grid-cols-1 divide-y divide-neutral-200 py-6 sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4 lg:divide-x lg:py-12">
        {trustPoints.map((t) => {
          const Icon = trustIcons[t.icon];
          return (
            <div key={t.heading} className="flex items-start gap-4 py-5 sm:px-6 lg:py-0">
              <span className="rounded-full bg-peach p-3 text-ink">
                <Icon size={22} />
              </span>
              <div>
                <h3 className="text-base font-semibold">{t.heading}</h3>
                <p className="mt-1 text-sm text-neutral-600">{t.text}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
