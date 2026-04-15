import type { NextConfig } from "next";
import withPWAInit from "next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
});

const nextConfig: NextConfig = {
  /* Your existing config options */
  reactStrictMode: true,
};

// Casting to any to resolve type incompatibility between next-pwa and Next.js versions
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default withPWA(nextConfig as any);
