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

  // Bundle and compile-time optimizations
  experimental: {
    // Tree-shake and selectively load icon/utility barrel modules to reduce memory usage during build & SSR
    optimizePackageImports: ["lucide-react"],
  },
};

export default nextConfig;
