import Link from "next/link";
import { getMenu, storeDomain } from "@/lib/shopify";
import { Logo } from "@/components/Logo";
import { SearchIcon, UserIcon } from "@/components/Icons";
import { CartButton } from "@/components/cart/CartButton";
import { DesktopNav } from "./DesktopNav";
import { MobileMenu } from "./MobileMenu";

export async function Header() {
  const menu = await getMenu();
  const accountHref = `https://${storeDomain()}/account`;

  return (
    <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white">
      <div className="container-x flex h-20 items-center justify-between gap-4 lg:h-28">
        <div className="flex items-center gap-2 lg:hidden">
          <MobileMenu items={menu} accountHref={accountHref} />
        </div>

        <Logo />

        <DesktopNav items={menu} />

        <div className="flex items-center gap-1">
          <Link href="/search" aria-label="Search" className="rounded-full p-2.5 hover:bg-neutral-100">
            <SearchIcon size={22} />
          </Link>
          <a href={accountHref} aria-label="Account" className="hidden rounded-full p-2.5 hover:bg-neutral-100 sm:block">
            <UserIcon size={22} />
          </a>
          <CartButton />
        </div>
      </div>
    </header>
  );
}
