import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@openresume/renderer", "@openresume/schema"],
};

export default nextConfig;
