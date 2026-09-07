"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { MenuItem } from "@/lib/shopify/types";
import { ChevronDownIcon } from "@/components/Icons";

function isActive(pathname: string, url: string) {
  if (url === "/") return pathname === "/";
  return pathname === url || pathname.startsWith(url + "/");
}

export function DesktopNav({ items }: { items: MenuItem[] }) {
  const pathname = usePathname();

  return (
    <nav aria-label="Main" className="hidden lg:block">
      <ul className="flex items-center gap-1">
        {items.map((item) => {
          const active = isActive(pathname, item.url) || item.items.some((c) => isActive(pathname, c.url));
          const hasChildren = item.items.length > 0;
          return (
            <li key={item.title + item.url} className="group relative">
              <Link
                href={item.url}
                className={`inline-flex items-center gap-1 rounded-full px-4 py-2.5 text-base font-medium transition-colors ${
                  active ? "bg-ink text-white" : "hover:bg-neutral-100"
                }`}
              >
                {item.title}
                {hasChildren && <ChevronDownIcon size={14} className="opacity-70" />}
              </Link>
              {hasChildren && (
                <div className="invisible absolute left-0 top-full pt-2 opacity-0 transition-all group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                  <ul className="min-w-56 rounded-2xl border border-neutral-200 bg-white p-2 shadow-xl">
                    {item.items.map((child) => (
                      <li key={child.title + child.url}>
                        <Link
                          href={child.url}
                          className="block rounded-xl px-4 py-2.5 text-sm font-medium hover:bg-neutral-100"
                        >
                          {child.title}
                        </Link>
                        {child.items.length > 0 && (
                          <ul className="mb-1 ml-3 border-l border-neutral-200 pl-2">
                            {child.items.map((g) => (
                              <li key={g.title + g.url}>
                                <Link href={g.url} className="block rounded-lg px-3 py-1.5 text-sm text-neutral-600 hover:bg-neutral-100 hover:text-ink">
                                  {g.title}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
