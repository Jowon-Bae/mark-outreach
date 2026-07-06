import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // @ts-ignore
  allowedDevOrigins: [
    'lows-shop-achieve-administrator.trycloudflare.com',
    'stranger-commission-sitting-volunteers.trycloudflare.com',
    'polite-toes-prove.loca.lt',
    'curvy-bottles-stay.loca.lt'
  ],
  devIndicators: {
    buildActivity: false,
  },
};

export default nextConfig;
