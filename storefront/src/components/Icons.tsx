import type { SVGProps } from "react";

type Props = SVGProps<SVGSVGElement> & { size?: number };

function base({ size = 20, ...rest }: Props) {
  return {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.75,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
    ...rest,
  };
}

export const SearchIcon = (p: Props) => (
  <svg {...base(p)}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </svg>
);
export const UserIcon = (p: Props) => (
  <svg {...base(p)}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21a8 8 0 0 1 16 0" />
  </svg>
);
export const CartIcon = (p: Props) => (
  <svg {...base(p)}>
    <path d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.6a2 2 0 0 0 2-1.5L21 8H6" />
    <circle cx="9.5" cy="20" r="1.25" />
    <circle cx="17" cy="20" r="1.25" />
  </svg>
);
export const MenuIcon = (p: Props) => (
  <svg {...base(p)}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </svg>
);
export const CloseIcon = (p: Props) => (
  <svg {...base(p)}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);
export const ChevronDownIcon = (p: Props) => (
  <svg {...base(p)}>
    <path d="m6 9 6 6 6-6" />
  </svg>
);
export const ChevronLeftIcon = (p: Props) => (
  <svg {...base(p)}>
    <path d="m15 6-6 6 6 6" />
  </svg>
);
export const ChevronRightIcon = (p: Props) => (
  <svg {...base(p)}>
    <path d="m9 6 6 6-6 6" />
  </svg>
);
export const ArrowRightIcon = (p: Props) => (
  <svg {...base(p)}>
    <path d="M4 12h16m-6-6 6 6-6 6" />
  </svg>
);
export const MinusIcon = (p: Props) => (
  <svg {...base(p)}>
    <path d="M5 12h14" />
  </svg>
);
export const PlusIcon = (p: Props) => (
  <svg {...base(p)}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);
export const CheckIcon = (p: Props) => (
  <svg {...base(p)}>
    <path d="m5 12 4.5 4.5L19 7" />
  </svg>
);
export const StarIcon = (p: Props) => (
  <svg {...base(p)} fill="currentColor" stroke="none">
    <path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6L2.5 9.4l6.6-.8L12 2.5z" />
  </svg>
);
export const TruckIcon = (p: Props) => (
  <svg {...base(p)}>
    <path d="M3 6h11v10H3zM14 9h4l3 3v4h-7z" />
    <circle cx="7" cy="18" r="1.75" />
    <circle cx="17" cy="18" r="1.75" />
  </svg>
);
export const GiftIcon = (p: Props) => (
  <svg {...base(p)}>
    <path d="M3 9h18v4H3zM5 13v8h14v-8M12 9v12M12 9c-2-4-6-4-6-1.5S10 9 12 9zm0 0c2-4 6-4 6-1.5S14 9 12 9z" />
  </svg>
);
export const MailIcon = (p: Props) => (
  <svg {...base(p)}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3 7 9 6 9-6" />
  </svg>
);
export const PhoneIcon = (p: Props) => (
  <svg {...base(p)}>
    <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />
  </svg>
);
export const WalletIcon = (p: Props) => (
  <svg {...base(p)}>
    <path d="M3 7a2 2 0 0 1 2-2h13v4" />
    <path d="M3 7v11a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-8a1 1 0 0 0-1-1H5a2 2 0 0 1-2-2z" />
    <circle cx="16.5" cy="14.5" r="1" />
  </svg>
);
export const BoxIcon = (p: Props) => (
  <svg {...base(p)}>
    <path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3zM4 7.5l8 4.5 8-4.5M12 12v9" />
  </svg>
);
export const SupportIcon = (p: Props) => (
  <svg {...base(p)}>
    <path d="M4 13a8 8 0 0 1 16 0" />
    <rect x="3" y="12" width="4" height="6" rx="1.5" />
    <rect x="17" y="12" width="4" height="6" rx="1.5" />
    <path d="M19 18a3 3 0 0 1-3 3h-3" />
  </svg>
);
export const ShieldIcon = (p: Props) => (
  <svg {...base(p)}>
    <path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6l-8-3z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);
export const SparkleIcon = (p: Props) => (
  <svg {...base(p)}>
    <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6" />
  </svg>
);
export const DropletIcon = (p: Props) => (
  <svg {...base(p)}>
    <path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z" />
  </svg>
);
export const LeafIcon = (p: Props) => (
  <svg {...base(p)}>
    <path d="M4 20c0-9 5-14 16-16-1 11-6 16-14 16" />
    <path d="M4 20c3-4 6-7 10-10" />
  </svg>
);

const brandBase = (p: Props) => ({
  width: p.size ?? 20,
  height: p.size ?? 20,
  viewBox: "0 0 24 24",
  fill: "currentColor",
  "aria-hidden": true,
});

export const FacebookIcon = (p: Props) => (
  <svg {...brandBase(p)}>
    <path d="M13.5 21v-7.5h2.6l.4-3h-3V8.6c0-.9.3-1.5 1.5-1.5h1.6V4.4c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.2H7.8v3h2.6V21h3.1z" />
  </svg>
);
export const XIcon = (p: Props) => (
  <svg {...brandBase(p)}>
    <path d="M17.5 3h3l-6.8 7.8L21.7 21h-6.2l-4.9-6.4L5 21H2l7.3-8.3L1.6 3H8l4.4 5.8L17.5 3zm-1.1 16.2h1.7L7 4.7H5.2l11.2 14.5z" />
  </svg>
);
export const InstagramIcon = (p: Props) => (
  <svg {...brandBase(p)} fill="none" stroke="currentColor" strokeWidth={1.75}>
    <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
    <circle cx="12" cy="12" r="3.75" />
    <circle cx="17.2" cy="6.8" r="0.9" fill="currentColor" stroke="none" />
  </svg>
);
export const YoutubeIcon = (p: Props) => (
  <svg {...brandBase(p)}>
    <path d="M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2 26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.8zM10 15V9l5.2 3L10 15z" />
  </svg>
);
export const TiktokIcon = (p: Props) => (
  <svg {...brandBase(p)}>
    <path d="M16.5 3c.3 2.2 1.6 3.6 3.9 3.8v3.1c-1.4.1-2.7-.3-3.9-1.1v6.4A5.3 5.3 0 1 1 11.2 10v3.2a2.2 2.2 0 1 0 2.2 2.2V3h3.1z" />
  </svg>
);
export const SnapchatIcon = (p: Props) => (
  <svg {...brandBase(p)}>
    <path d="M12 2.5c3 0 5 2.3 5 5.4v2.4c.5.2 1.3-.2 1.6.2.3.5-.6 1-1.3 1.3.4 1.6 2 2.8 3.6 3.2-.2 1-1.7.9-2.4 1.2-.2.5-.1 1.1-.5 1.2-.8.1-1.6-.2-2.4.1-1 .4-1.9 1.6-3.6 1.6s-2.6-1.2-3.6-1.6c-.8-.3-1.6 0-2.4-.1-.4-.1-.3-.7-.5-1.2-.7-.3-2.2-.2-2.4-1.2 1.6-.4 3.2-1.6 3.6-3.2-.7-.3-1.6-.8-1.3-1.3.3-.4 1.1 0 1.6-.2V7.9c0-3.1 2-5.4 5-5.4z" />
  </svg>
);

export const socialIcons = {
  facebook: FacebookIcon,
  x: XIcon,
  instagram: InstagramIcon,
  youtube: YoutubeIcon,
  tiktok: TiktokIcon,
  snapchat: SnapchatIcon,
};

export const announcementIcons = { truck: TruckIcon, gift: GiftIcon, mail: MailIcon };
export const trustIcons = { wallet: WalletIcon, box: BoxIcon, support: SupportIcon, shield: ShieldIcon };
