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
 *
 * SUBDIRECTORY HOSTING
 * --------------------
 * On a root domain (Netlify, Cloudflare Pages, Vercel, your own domain) leave
 * `NEXT_PUBLIC_BASE_PATH` unset. When hosting under a sub-path — e.g. GitHub
 * Pages at https://<user>.github.io/Bitty-the-cat/ — set it so that `/_next/*`
 * asset URLs and the in-page anchor links resolve correctly:
 *
 *   NEXT_PUBLIC_BASE_PATH=/Bitty-the-cat npm run build
 */
const basePath = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/\/+$/, "");

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  reactStrictMode: true,
  poweredByHeader: false,
  ...(basePath ? { basePath, assetPrefix: basePath } : {}),
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
