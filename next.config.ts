import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // output: "standalone" removed — incompatible with Vercel (use only for self-hosted/Docker)
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  reactStrictMode: false,
};

export default nextConfig;
