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
      },

      //Article-Comments Rewrites
      {
        source: '/docs/articles-comments/get-articles-comments',
        destination: '/articles-comments/get-articles-comments.html'
      },

      {
        source: '/docs/articles-comments/post-articles-comments',
        destination: '/articles-comments/post-articles-comments.html'
      },

      //Comments Rewrites
      {
        source: '/docs/comments/get-comments',
        destination: '/comments/get-comments.html'
      },

      {
        source: '/docs/comments/get-comment-by-id',
        destination: '/comments/get-comment-by-id.html'
      },

      {
        source: '/docs/comments/patch-comment-by-id',
        destination: '/comments/patch-comment-by-id.html'
      },

      {
        source: '/docs/comments/delete-comment-by-id',
        destination: '/comments/delete-comment-by-id.html'
      },
      //Topics Rewrites
      {
        source: '/docs/topics/get-topics',
        destination: '/topics/get-topics.html'
      },

      {
        source: '/docs/topics/post-topics',
        destination: '/topics/post-topics.html'
      },
      
      //Users Rewrites
      {
        source: '/docs/users/get-users',
        destination: '/users/get-users.html'
      },

      {
        source: '/docs/users/get-users-by-username',
        destination: '/users/get-users-by-username.html'
      },

      {
        source: '/docs/users/post-user',
        destination: '/users/post-user.html'
      }
      
    ]
  }
}

module.exports = nextConfig
