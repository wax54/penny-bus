/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "standalone",
  redirects: [
    {
      async redirects() {
        return [
          {
            destination: "/home",
            source: "/",
            permanent: false,
          },
        ];
      },
    },
  ],
};

module.exports = nextConfig;
