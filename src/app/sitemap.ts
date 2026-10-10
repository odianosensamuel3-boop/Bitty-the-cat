import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site-url";

/** Required for `output: "export"` (fully static site). */
export const dynamic = "force-static";

/** Single-page site: one canonical URL (in-page anchors are not separate pages). */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  return [
    {
      url: base ? `${base}/` : "/",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
