"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { MenuItem } from "@/lib/shopify/types";
import { site } from "@/lib/config";
import { ChevronDownIcon, CloseIcon, MenuIcon, PhoneIcon, SearchIcon, UserIcon } from "@/components/Icons";

export function MobileMenu({ items, accountHref }: { items: MenuItem[]; accountHref: string }) {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        aria-label="Open menu"
        aria-expanded={open}
        onClick={() => setOpen(true)}
        className="rounded-full p-2.5 hover:bg-neutral-100"
      >
        <MenuIcon size={24} />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-ink/50"
          />
          <div
            className="absolute inset-y-0 left-0 flex w-[88%] max-w-sm flex-col bg-white shadow-2xl"
            onClick={(e) => {
              if ((e.target as HTMLElement).closest("a")) setOpen(false);
            }}
          >
            <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-4">
              <span className="text-lg font-bold">{site.name}</span>
              <button type="button" aria-label="Close menu" onClick={() => setOpen(false)} className="rounded-full p-2 hover:bg-neutral-100">
                <CloseIcon size={22} />
              </button>
            </div>

            <nav aria-label="Mobile" className="flex-1 overflow-y-auto px-3 py-3">
              <ul className="space-y-1">
                {items.map((item) => {
                  const key = item.title + item.url;
                  const hasChildren = item.items.length > 0;
                  const isExpanded = expanded === key;
                  return (
                    <li key={key}>
                      <div className="flex items-center">
                        <Link href={item.url} className="flex-1 rounded-xl px-3 py-3 text-lg font-medium hover:bg-neutral-100">
                          {item.title}
                        </Link>
                        {hasChildren && (
                          <button
                            type="button"
                            aria-label={`${isExpanded ? "Collapse" : "Expand"} ${item.title}`}
                            aria-expanded={isExpanded}
                            onClick={() => setExpanded(isExpanded ? null : key)}
                            className="rounded-full p-3 hover:bg-neutral-100"
                          >
                            <ChevronDownIcon size={18} className={`transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                          </button>
                        )}
                      </div>
                      {hasChildren && isExpanded && (
                        <ul className="mb-2 ml-4 border-l border-neutral-200 pl-3">
                          {item.items.map((child) => (
                            <li key={child.title + child.url}>
                              <Link href={child.url} className="block rounded-lg px-3 py-2.5 text-base text-neutral-700 hover:bg-neutral-100 hover:text-ink">
                                {child.title}
                              </Link>
                              {child.items.map((g) => (
                                <Link key={g.title + g.url} href={g.url} className="block rounded-lg px-6 py-2 text-sm text-neutral-500 hover:bg-neutral-100 hover:text-ink">
                                  {g.title}
                                </Link>
                              ))}
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className="space-y-2 border-t border-neutral-200 p-4">
              <Link href="/quiz" className="btn btn-primary w-full">
                Take the Bidet Quiz
              </Link>
              <div className="grid grid-cols-3 gap-2 pt-1 text-sm">
                <Link href="/search" className="flex flex-col items-center gap-1 rounded-xl p-2 hover:bg-neutral-100">
                  <SearchIcon size={20} /> Search
                </Link>
                <a href={accountHref} className="flex flex-col items-center gap-1 rounded-xl p-2 hover:bg-neutral-100">
                  <UserIcon size={20} /> Account
                </a>
                <a href={site.phoneHref} className="flex flex-col items-center gap-1 rounded-xl p-2 hover:bg-neutral-100">
                  <PhoneIcon size={20} /> Call us
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
