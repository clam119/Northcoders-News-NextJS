/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  async rewrites() {
    return [
      {
        source: '/docs',
        destination: '/index.html',
      },
      // Articles Rewrites
      {
        source: '/docs/articles/get-articles',
        destination: '/articles/get-articles.html',
      },

      {
        source: '/docs/articles/post-articles',
        destination: '/articles/post-articles.html'
      },

      {
        source: '/docs/articles/get-articles-by-id',
        destination: '/articles/get-articles-by-id.html'
      },

      {
        source: '/docs/articles/patch-articles-by-id',
        destination: '/articles/patch-articles-by-id.html'
      },

      {
        source: '/docs/articles/delete-articles-by-id',
        destination: '/articles/delete-articles-by-id.html'
      }

    ]
  }
}

module.exports = nextConfig
