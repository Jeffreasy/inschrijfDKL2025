/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*', // Vervang dit later met uw specifieke Webflow domein voor betere beveiliging
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
          },
          {
            key: 'X-Frame-Options',
            value: 'ALLOW-FROM https://jeffrey-portfolio-591ef2.webflow.io/inschrijving-2025', // Vervang dit met uw Webflow domein
          },
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors 'self' https://jeffrey-portfolio-591ef2.webflow.io/inschrijving-2025", // Vervang dit met uw Webflow domein
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;