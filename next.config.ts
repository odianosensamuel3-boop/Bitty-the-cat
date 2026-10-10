import type { NextConfig } from "next";

/**
 * Bitty the Cat — Next.js configuration.
 *
 * `output: "export"` produces a fully static site in `out/` so it can be hosted
 * on any static host (Vercel, Netlify, Cloudflare Pages, GitHub Pages, S3,
 * nginx...). Delete the `output` line if you would rather deploy with a Node
 * server and use `npm run start`.
 *
 * Images are pre-optimized at build-asset time (see `scripts/generate-assets.mjs`)
 * and served through <picture>/<img> with explicit width/height, so Next's
 * image optimizer is not required.
 */
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
