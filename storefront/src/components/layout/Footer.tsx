import Link from "next/link";
import { footerNav, site, socialLinks } from "@/lib/config";
import { MailIcon, PhoneIcon, socialIcons } from "@/components/Icons";
import { NewsletterForm } from "./NewsletterForm";
import { TrustBar } from "./TrustBar";

export function Footer() {
  const socials = socialLinks.filter((s) => s.url);
  const year = new Date().getFullYear();

  return (
    <>
      <TrustBar />
      <footer className="bg-ink-soft text-white">
        <div className="container-x grid gap-12 py-16 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <h2 className="text-2xl font-bold sm:text-3xl">
              Sign up for our email list and get 10% off your first purchase!
            </h2>
            <p className="mt-3 text-sm text-neutral-300">
              Apply discount code <strong className="text-white">{site.newCustomerCode}</strong> at checkout for {site.newCustomerDiscount}.{" "}
              <span className="text-neutral-400">({site.newCustomerExclusion})</span>
            </p>
            <div className="mt-6 max-w-md">
              <NewsletterForm dark />
            </div>
            {socials.length > 0 && (
              <div className="mt-8 flex items-center gap-4">
                {socials.map((s) => {
                  const Icon = socialIcons[s.name];
                  return (
                    <a key={s.name} href={s.url} target="_blank" rel="noreferrer" aria-label={s.name} className="rounded-full bg-white/10 p-2.5 hover:bg-white/20">
                      <Icon size={18} />
                    </a>
                  );
                })}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-7 lg:grid-cols-4">
            {Object.entries(footerNav).map(([heading, links]) => (
              <div key={heading}>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-400">{heading}</h3>
                <ul className="mt-4 space-y-2.5">
                  {links.map((l) => (
                    <li key={l.url}>
                      <Link href={l.url} className="text-sm text-neutral-200 hover:text-white hover:underline">
                        {l.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-400">Contact Us</h3>
              <ul className="mt-4 space-y-3">
                <li>
                  <a href={site.phoneHref} className="inline-flex items-center gap-2 text-sm text-neutral-200 hover:text-white">
                    <PhoneIcon size={16} /> {site.phone}
                  </a>
                </li>
                <li>
                  <a href={`mailto:${site.email}`} className="inline-flex items-center gap-2 text-sm text-neutral-200 hover:text-white">
                    <MailIcon size={16} /> {site.email}
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-ink">
          <div className="container-x flex flex-col items-center justify-between gap-3 py-5 text-xs text-neutral-400 sm:flex-row">
            <p>
              © {year} {site.name}. All rights reserved.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Link href="/pages/privacy-policy" className="hover:text-white">
                Privacy
              </Link>
              <Link href="/pages/terms-of-service" className="hover:text-white">
                Terms
              </Link>
              <Link href="/pages/refund-policy" className="hover:text-white">
                Refunds
              </Link>
              <Link href="/pages/shipping-policy" className="hover:text-white">
                Shipping
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
