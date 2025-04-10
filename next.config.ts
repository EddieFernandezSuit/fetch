import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    // domains: ['frontend-take-home.fetch.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'frontend-take-home.fetch.com',
        pathname: '**',
      },
    ],
  },
};

export default nextConfig;
