import { DropletIcon, LeafIcon, SparkleIcon, WalletIcon } from "@/components/Icons";

const reasons = [
  { icon: DropletIcon, title: "Cleaner than paper", text: "Water cleans thoroughly and gently — no irritation, no residue." },
  { icon: LeafIcon, title: "Eco-friendly", text: "Cut toilet paper use dramatically and save trees and water." },
  { icon: WalletIcon, title: "Pays for itself", text: "Most households save on toilet paper within the first year." },
  { icon: SparkleIcon, title: "Comfort features", text: "Heated seats, warm water, dryers and remotes — as much or as little as you want." },
];

export function WhyBidet() {
  return (
    <section className="container-x py-16 lg:py-24">
      <div className="max-w-2xl">
        <h2 className="text-3xl font-bold sm:text-4xl">
          Why switch to a <span className="highlight">bidet</span>?
        </h2>
        <p className="mt-3 text-neutral-600">
          At Bidet World we&apos;re redefining bathroom comfort and hygiene — from simple attachments to luxurious smart seats.
        </p>
      </div>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {reasons.map((r) => (
          <div key={r.title} className="rounded-3xl bg-paper-soft p-6 ring-1 ring-neutral-200/70">
            <span className="inline-flex rounded-full bg-mint p-3 text-ink">
              <r.icon size={22} />
            </span>
            <h3 className="mt-4 text-lg font-semibold">{r.title}</h3>
            <p className="mt-1 text-sm text-neutral-600">{r.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
