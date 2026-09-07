import type { NextConfig } from "next";

const mock = process.env.MOCK_SHOPIFY === "1";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.shopify.com" },
      ...(mock ? [{ protocol: "http" as const, hostname: "localhost" }] : []),
    ],
    unoptimized: mock,
  },
};

export default nextConfig;
