/**
 * Prefixes a public asset path with the deployment base path.
 *
 * Next.js only applies `basePath` to its own output (`/_next/*`, `next/image`,
 * metadata URLs). Paths we write by hand — mascot files, favicons, gallery art —
 * must be prefixed manually, otherwise the site 404s its images when hosted
 * under a sub-path such as GitHub Pages (`/Bitty-the-cat/`).
 *
 * On a root domain `NEXT_PUBLIC_BASE_PATH` is unset and this is a no-op.
 */
const RAW_BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const BASE_PATH = RAW_BASE_PATH.replace(/\/+$/, "");

export function assetPath(pathname: string): string {
  if (!pathname.startsWith("/")) return pathname;
  if (!BASE_PATH) return pathname;
  // Never touch absolute URLs or protocol-relative paths.
  if (pathname.startsWith("//")) return pathname;
  return `${BASE_PATH}${pathname}`;
}

/** Builds a `srcSet` string from asset paths, prefixing each candidate. */
export function assetSrcSet(candidates: readonly { readonly src: string; readonly width: number }[]): string {
  return candidates.map((c) => `${assetPath(c.src)} ${c.width}w`).join(", ");
}
