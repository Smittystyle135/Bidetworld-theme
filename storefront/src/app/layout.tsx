import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { site } from "@/lib/config";
import { isShopifyConfigured } from "@/lib/shopify/client";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { NewsletterPopup } from "@/components/layout/NewsletterPopup";
import { CartProvider } from "@/components/cart/CartProvider";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { SetupRequired } from "@/components/SetupRequired";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} – Bidets & Toilet Lifts`,
    template: `%s – ${site.name}`,
  },
  description: site.description,
  openGraph: {
    siteName: site.name,
    type: "website",
    locale: "en_US",
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  if (!isShopifyConfigured()) {
    return (
      <html lang="en" className={inter.variable}>
        <body>
          <SetupRequired />
        </body>
      </html>
    );
  }

  return (
    <html lang="en" className={inter.variable}>
      <body className="flex min-h-screen flex-col">
        <CartProvider>
          <AnnouncementBar />
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <CartDrawer />
          <NewsletterPopup />
        </CartProvider>
      </body>
    </html>
  );
}
