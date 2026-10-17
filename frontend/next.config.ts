import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  devIndicators: false,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api-backend/:path*",
        destination: `${process.env.INTERNAL_API_URL || "http://localhost:5001"}/api/v1/:path*`,
      },
    ];
  },
};

export default nextConfig;

