"use client";

import { useEffect, useState } from "react";
import { site, socialLinks } from "@/lib/config";
import { CloseIcon, socialIcons } from "@/components/Icons";
import { NewsletterForm } from "./NewsletterForm";

const STORAGE_KEY = "bw_popup_dismissed";

export function NewsletterPopup() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let dismissed = false;
    try {
      dismissed = localStorage.getItem(STORAGE_KEY) === "1";
    } catch {
      dismissed = true;
    }
    if (dismissed) return;
    const id = setTimeout(() => setOpen(true), 7000);
    return () => clearTimeout(id);
  }, []);

  function close() {
    setOpen(false);
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // ignore
    }
  }

  if (!open) return null;
  const socials = socialLinks.filter((s) => s.url);

  return (
    <div role="dialog" aria-modal="true" aria-labelledby="popup-title" className="fixed inset-x-4 bottom-4 z-50 sm:inset-x-auto sm:right-6 sm:bottom-6 sm:w-[440px]">
      <div className="animate-fade-up relative rounded-3xl bg-white p-7 shadow-2xl ring-1 ring-neutral-200">
        <button type="button" aria-label="Close" onClick={close} className="absolute right-4 top-4 rounded-full border border-neutral-200 p-2 hover:bg-neutral-100">
          <CloseIcon size={16} />
        </button>
        <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">First timer?</p>
        <h2 id="popup-title" className="mt-2 text-2xl font-bold">
          Sign up and get <span className="highlight">{site.newCustomerDiscount}</span> your first order
        </h2>
        <p className="mt-3 text-base font-semibold">
          Discount code: <span className="highlight">{site.newCustomerCode}</span>
        </p>
        <p className="mt-1 text-sm text-neutral-500">({site.newCustomerExclusion})</p>
        <div className="mt-5">
          <NewsletterForm />
        </div>
        {socials.length > 0 && (
          <div className="mt-5 flex items-center gap-4 text-neutral-600">
            {socials.map((s) => {
              const Icon = socialIcons[s.name];
              return (
                <a key={s.name} href={s.url} target="_blank" rel="noreferrer" aria-label={s.name} className="hover:text-ink">
                  <Icon size={18} />
                </a>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
