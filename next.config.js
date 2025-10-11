
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
};

module.exports = nextConfig;
