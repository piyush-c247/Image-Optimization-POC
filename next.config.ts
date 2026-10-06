import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Output format served by the optimizer (WebP only for this POC).
    formats: ["image/webp"],
    // Qualities that <Image quality={...} /> is allowed to request.
    qualities: [60, 75],
    // Remote hosts the optimizer is allowed to fetch from.
    remotePatterns: [
      { protocol: "https", hostname: "picsum.photos", pathname: "/**" },
      { protocol: "https", hostname: "fastly.picsum.photos", pathname: "/**" },
    ],
    // Keep optimized files cached for a day so repeat visits are fast.
    minimumCacheTTL: 60 * 60 * 24,
  },
};

export default nextConfig;
