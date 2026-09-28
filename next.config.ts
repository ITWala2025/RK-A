import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Anchor Turbopack's root to this app since the repo root (one level up)
  // intentionally has no lockfile — it only holds docs alongside web/.
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
