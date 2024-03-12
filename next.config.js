/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "standalone",
  compress: true,
  async redirects() {
    return [
      {
        destination: "/home",
        source: "/",
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;
