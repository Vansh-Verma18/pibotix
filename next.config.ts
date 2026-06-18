import type { NextConfig } from "next";
import path from "path";
import createBundleAnalyzer from "@next/bundle-analyzer";
import glob from "glob-all";
import { PurgeCSSPlugin } from "purgecss-webpack-plugin";

const withBundleAnalyzer = createBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})

const nextConfig: NextConfig = {
  turbopack: {
    root: path.join(__dirname)
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i0.wp.com'
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com'
      },
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc'
      }
    ],
  },
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      config.plugins.push(
        new PurgeCSSPlugin({
          paths: glob.sync([
            path.join(__dirname, 'app/**/*.{js,jsx,ts,tsx}'),
            path.join(__dirname, 'components/**/*.{js,jsx,ts,tsx}'),
            path.join(__dirname, 'data/**/*.{js,jsx,ts,tsx}'),
          ]),
          safelist: {
            standard: ['html', 'body', /^dark/],
          },
          blocklist: [],
        })
      );
    }
    return config;
  },
};

export default withBundleAnalyzer(nextConfig);
