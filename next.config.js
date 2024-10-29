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
            value: "frame-ancestors 'self' https://*.webflow.io https://*.webflow.com https://www.koninklijkeloop.nl",
          },
          {
            key: 'X-Frame-Options',
            value: 'ALLOW-FROM https://*.webflow.io https://*.webflow.com https://www.koninklijkeloop.nl',
          },
          {
            key: 'Access-Control-Allow-Origin',
            value: 'https://www.koninklijkeloop.nl',
          }
        ],
      },
    ]
  },
}

module.exports = nextConfig