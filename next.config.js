/** @type {import('next').NextConfig} */
const nextConfig = {
  // This is the standard output mode for Next.js applications when deployed
  // on modern hosting platforms like Firebase App Hosting. It ensures that
  // server-side logic (like API routes) is handled correctly.
  output: 'standalone',
  
  // By leaving the 'rewrites' and 'redirects' sections empty, we ensure
  // that all routing is handled by the 'firebase.json' file. This is the
  // key to solving the 404 error on the /__/auth/handler path.
};

module.exports = nextConfig;
