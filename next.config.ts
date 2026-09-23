import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // Standalone output traces only required node_modules for a minimal runtime memory footprint
  output: "standalone",

  // Disable X-Powered-By header to reduce response overhead and enhance security
  poweredByHeader: false,

  // Enable gzip compression for rendered content and static files
  compress: true,

  // Clean build directory before building to prevent memory and disk bloat
  cleanDistDir: true,

  // Prevent memory-heavy source map generation in production
  productionBrowserSourceMaps: false,

  // Image optimization configuration
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
    ],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: false,
  },

  // HTTP Security and caching headers
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains",
          },
        ],
      },
    ];
  },

  // Bundle and compile-time optimizations
  experimental: {
    // Tree-shake and selectively load icon/utility barrel modules to reduce memory usage during build & SSR
    optimizePackageImports: ["lucide-react"],
  },
};

export default nextConfig;
