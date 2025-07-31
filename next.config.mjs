import withPWA from "next-pwa";

/** @type {import('next').NextConfig} */
const nextConfig = {
  compress: true,
  reactStrictMode: true,
  images:{
    remotePatterns:[
      {
        protocol: 'https',
        hostname:"nng-phinf.pstatic.net",
      },
      {
        protocol: 'https',
        hostname:"ssl.pstatic.net",
      }
    ],
    formats: ['image/avif', 'image/webp'],
  }
};

export default withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
})(nextConfig);
