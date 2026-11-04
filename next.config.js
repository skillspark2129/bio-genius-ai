/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/admin',
        destination: '/admin',
      },
      {
        source: '/admin-login',
        destination: '/admin-login',
      },
    ];
  },
};

export default nextConfig;
