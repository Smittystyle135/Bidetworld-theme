import Link from "next/link";
import { site } from "@/lib/config";

// Placeholder wordmark. Drop the real logo at public/logo.png and swap this for
// <Image src="/logo.png" .../> — see README "Logo".
export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" aria-label={`${site.name} home`} className={`inline-flex items-center ${className}`}>
      <svg viewBox="0 0 120 120" className="h-14 w-14 sm:h-16 sm:w-16 lg:h-20 lg:w-20" aria-hidden="true">
        <defs>
          <radialGradient id="bw-globe" cx="35%" cy="30%" r="80%">
            <stop offset="0%" stopColor="#7fc8ff" />
            <stop offset="55%" stopColor="#1e7fe0" />
            <stop offset="100%" stopColor="#0b3f8f" />
          </radialGradient>
        </defs>
        <circle cx="60" cy="60" r="56" fill="url(#bw-globe)" />
        <path
          d="M18 44c14 6 32 8 48 3 12-4 22-10 34-7M14 72c16-4 34-3 50 3 12 4 24 8 40 4M60 6c-18 18-18 90 0 108M60 6c18 18 18 90 0 108"
          fill="none"
          stroke="#ffffff"
          strokeOpacity="0.35"
          strokeWidth="2.5"
        />
        <text x="60" y="56" textAnchor="middle" fontFamily="Inter, system-ui, sans-serif" fontWeight="800" fontSize="26" fill="#fff" letterSpacing="1">
          BIDET
        </text>
        <text x="60" y="84" textAnchor="middle" fontFamily="Inter, system-ui, sans-serif" fontWeight="800" fontSize="26" fill="#fff" letterSpacing="1">
          WORLD
        </text>
      </svg>
    </Link>
  );
}
