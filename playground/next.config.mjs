/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  distDir: process.env.NEXT_DIST_DIR ?? ".next",
  // Local design tool only; keep it lean.
  eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;
