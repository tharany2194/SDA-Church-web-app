/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  // Tell Next.js bundler not to bundle these Node.js-only packages —
  // they are loaded at runtime from node_modules instead.
  serverExternalPackages: ['mongoose', 'winston', 'bcryptjs'],

  webpack(config) {
    config.resolve.alias['@'] = path.resolve(__dirname);
    return config;
  },

  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'img.youtube.com' },
      { protocol: 'https', hostname: 'i.ytimg.com' },
      { protocol: 'http', hostname: 'localhost' },
      // Cloudflare R2 public bucket — update hostname to match R2_PUBLIC_URL
      { protocol: 'https', hostname: '*.r2.dev' },
      // If you use a custom domain for R2, add it here:
      // { protocol: 'https', hostname: 'media.yourchurch.com' },
    ],
  },
};

module.exports = nextConfig;
