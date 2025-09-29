/** @type {import('next').NextConfig} */
const nextConfig = {
  // This is the standard output mode for Next.js applications when deployed
  // on modern hosting platforms like Firebase App Hosting.
  output: 'standalone',

  // This 'images' configuration tells the Next.js Image component which
  // remote domains are allowed to serve images to your application.
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        port: '',
        pathname: '**',
      },
    ],
  },

  // This 'experimental' configuration is the fix for the warning.
  // It tells the Next.js development server to trust requests originating
  // from your specific Firebase Studio cloud workstation domain.
  experimental: {
    allowedDevOrigins: [
      "6000-firebase-studio-1757605031944.cluster-64pjnskmlbaxowh5lzq6i7v4ra.cloudworkstations.dev",
    ],
  },
};

module.exports = nextConfig;