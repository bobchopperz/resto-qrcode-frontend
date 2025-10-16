import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  turbopack: {
    // Set the project root to the current directory to resolve ambiguity.
    root: __dirname,
  },
};

export default nextConfig;
