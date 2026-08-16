/** @type {import('next').NextConfig} */
const nextConfig = {
  // Transpile these packages to ES5/ES2017 for old Safari
  transpilePackages: [
    'react-leaflet',
    'leaflet',
    'date-fns',
    // Add any other UI libs you use (e.g., 'react-icons')
  ],

  // Optional: force SWC to apply legacy transforms
  // If your Next.js version ignores this flag, it's harmless
  experimental: {
    forceSwcTransforms: true,
  },

  swcMinify: true,
}

export default nextConfig