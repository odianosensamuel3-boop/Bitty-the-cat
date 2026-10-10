import siteConfig from "@/config/site.config";

/**
 * Resolves the absolute origin used for canonical URLs, Open Graph images,
 * `robots.txt` and `sitemap.xml`.
 *
 * Order of precedence:
 *   1. NEXT_PUBLIC_SITE_URL      — set this once you have your real domain.
 *   2. VERCEL_URL / CF_PAGES_URL / DEPLOY_PRIME_URL / URL
 *                                — provided automatically by most hosts, so a
 *                                  preview deployment still gets working
 *                                  absolute URLs instead of the placeholder.
 *   3. siteConfig.brand.url      — the value committed in the repo.
 *
 * The result never has a trailing slash.
 */
export function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  const platform =
    process.env.VERCEL_PROJECT_PRODUCTION_URL ??
    process.env.VERCEL_URL ??
    process.env.CF_PAGES_URL ??
    process.env.DEPLOY_PRIME_URL ??
    process.env.URL;

  const candidate = (explicit || platform || siteConfig.brand.url || "").trim();
  if (!candidate) return "";
  const withProtocol = /^https?:\/\//i.test(candidate) ? candidate : `https://${candidate}`;
  return withProtocol.replace(/\/+$/, "");
}

/** Absolute URL for a public asset path, e.g. "/brand/og-image.jpg". */
export function absoluteUrl(pathname: string): string {
  const base = getSiteUrl();
  const path = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return base ? `${base}${path}` : path;
}
