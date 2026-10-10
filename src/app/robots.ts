import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site-url";

/** Required for `output: "export"` (fully static site). */
export const dynamic = "force-static";

/** Generated at build time — works with `output: "export"`. */
export default function robots(): MetadataRoute.Robots {
  const base = getSiteUrl();
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: base ? `${base}/sitemap.xml` : "/sitemap.xml",
    host: base || undefined,
  };
}
