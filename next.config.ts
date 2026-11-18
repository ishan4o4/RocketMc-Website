import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  allowedDevOrigins: [
    "*.space-z.ai",
    "preview-chat-708a4d15-22b1-4c96-83ca-9bafc2f63043.space-z.ai",
  ],
};

export default nextConfig;
