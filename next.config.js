module.exports = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: 'https://www.uwwebflowdomein.com',
          },
        ],
      },
    ]
  },
}