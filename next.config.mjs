/** @type {import('next').NextConfig} */
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  // add your own PWA options here
});

const nextConfig = {
  output: 'export',
  // Your regular Next.js config options
  images: {
    unoptimized: true,
  },
};

export default withPWA(nextConfig);
