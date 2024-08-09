/** @type {import('next').NextConfig} */
const nextConfig = {
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
    ]
  }
};

export default nextConfig;
