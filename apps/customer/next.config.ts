import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  transpilePackages: ['@kiaan/database', '@kiaan/ui'],
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true, // Using Biome instead
  },
  typescript: {
    ignoreBuildErrors: false,
  },
}

export default nextConfig
