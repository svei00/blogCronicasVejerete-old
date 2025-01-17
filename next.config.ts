import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  images: {
    domains: ['firebasestorage.googleapis.com'], // Add this line
  },
};


export default nextConfig;
