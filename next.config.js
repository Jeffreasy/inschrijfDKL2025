module.exports = {
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'ALLOW-FROM https://*.webflow.io https://*.koninklijkeloop.nl',
          },
        ],
      },
    ]
  },
}