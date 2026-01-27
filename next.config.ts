import type { NextConfig } from "next";

const backendUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"

const nextConfig: NextConfig = {
  async rewrites() {
    return [{ source: "/api/:path*", destination: `${backendUrl.replace(/\/$/, "")}/:path*` }]
  },
};

export default nextConfig;
