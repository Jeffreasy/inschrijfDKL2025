/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors 'self' https://*.webflow.io https://*.webflow.com https://jouw-domain.nl",
          },
          {
            key: 'X-Frame-Options',
            value: 'ALLOW-FROM https://*.webflow.io https://*.webflow.com https://jouw-domain.nl',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig