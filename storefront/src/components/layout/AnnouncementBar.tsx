"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { announcements, socialLinks } from "@/lib/config";
import { ChevronLeftIcon, ChevronRightIcon, announcementIcons, socialIcons } from "@/components/Icons";

export function AnnouncementBar() {
  const [index, setIndex] = useState(0);
  const count = announcements.length;

  useEffect(() => {
    if (count < 2) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % count), 5000);
    return () => clearInterval(id);
  }, [count]);

  const current = announcements[index];
  const Icon = announcementIcons[current.icon];
  const socials = socialLinks.filter((s) => s.url);

  return (
    <div className="bg-ink-soft text-sm text-paper-soft">
      <div className="container-x flex h-11 items-center justify-between gap-4">
        <div className="hidden items-center gap-4 md:flex">
          {socials.map((s) => {
            const SocialIcon = socialIcons[s.name];
            return (
              <a key={s.name} href={s.url} target="_blank" rel="noreferrer" aria-label={s.name} className="opacity-80 hover:opacity-100">
                <SocialIcon size={16} />
              </a>
            );
          })}
        </div>

        <div className="flex flex-1 items-center justify-center gap-3">
          {count > 1 && (
            <button
              type="button"
              aria-label="Previous announcement"
              onClick={() => setIndex((i) => (i - 1 + count) % count)}
              className="hidden rounded-full p-1 opacity-70 hover:opacity-100 sm:block"
            >
              <ChevronLeftIcon size={16} />
            </button>
          )}
          <Link key={index} href={current.href} className="animate-fade-up inline-flex items-center gap-2 hover:underline">
            <Icon size={16} className="hidden sm:block" />
            <span>{current.text}</span>
          </Link>
          {count > 1 && (
            <button
              type="button"
              aria-label="Next announcement"
              onClick={() => setIndex((i) => (i + 1) % count)}
              className="hidden rounded-full p-1 opacity-70 hover:opacity-100 sm:block"
            >
              <ChevronRightIcon size={16} />
            </button>
          )}
        </div>

        <div className="hidden w-24 justify-end md:flex">
          <span className="opacity-80">United States (USD $)</span>
        </div>
      </div>
    </div>
  );
}
