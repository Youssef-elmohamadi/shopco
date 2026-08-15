import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://www.shopco.somee.com/api/:path*'
      },
      {
        source: '/images/products/:path*',
        destination: 'http://www.shopco.somee.com/images/products/:path*'
      },
      {
        source: '/images/categories/:path*',
        destination: 'http://www.shopco.somee.com/images/categories/:path*'
      },
      {
        source: '/images/users/:path*',
        destination: 'http://www.shopco.somee.com/images/users/:path*'
      }
    ];
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "http",
        hostname: "www.shopco.somee.com",
      },
      {
        protocol: "http",
        hostname: "shopco.somee.com",
      },
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
