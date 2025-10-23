import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  turbopack: {
    // Set the project root to the current directory to resolve ambiguity.
    root: __dirname,
  },

  // ini dibutuhkan untuk cross origin

  // async rewrites() {
  //   return [
  //     {
  //       source: '/api/:path*',
  //       destination: 'http://localhost:8000/:path*', // Ganti dengan URL backend kakak
  //     },
  //   ];
  // },

};

export default nextConfig;
