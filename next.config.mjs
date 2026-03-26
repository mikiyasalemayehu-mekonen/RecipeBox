/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "recipe-app-api-zop4.onrender.com",
        pathname: "/**",
      },
      {
        // Allow any https host (covers S3, CDN, etc. the backend may use)
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;

