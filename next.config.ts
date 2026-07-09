import type { NextConfig } from "next";

const nextConfig: any = {
  allowedDevOrigins: [
    'lows-shop-achieve-administrator.trycloudflare.com',
    'stranger-commission-sitting-volunteers.trycloudflare.com',
    'polite-toes-prove.loca.lt',
    'curvy-bottles-stay.loca.lt'
  ],
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
