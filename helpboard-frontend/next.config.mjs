/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
    unoptimized: true,
  },

  // ✅ Add rewrites for backend proxy
  async rewrites() {
    const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080"
    
    return [
      {
        source: "/ws/:path*", // Proxy WebSocket/SockJS requests
        destination: `${backendUrl}/ws/:path*`,
      },
      {
        source: "/api/:path*", // Proxy REST API requests if needed
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
