module.exports = {
  reactStrictMode: true,
  
  async redirects() {
    return [
      {
        source: '/',
        destination: '/dash/craigslist',
        permanent: true,
      },
    ]
  },
}
