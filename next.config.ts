// next.config.js
module.exports = {
  async rewrites() {
    return [
      {
        source: '/supabase-api/:path*',
        destination: `${process.env.SUPABASE_TARGET_URL}/:path*`, 
      },
    ]
  },
}