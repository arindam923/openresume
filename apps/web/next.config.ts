import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@openresume/renderer", "@openresume/schema"],
  output: "standalone",
  // Disable Next.js image optimization for the edge runtime
  images: { unoptimized: true },
};

export default nextConfig;
