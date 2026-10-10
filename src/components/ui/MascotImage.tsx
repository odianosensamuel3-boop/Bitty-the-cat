import siteConfig from "@/config/site.config";
import { assetPath, assetSrcSet } from "@/lib/asset-path";
import { cx } from "@/lib/utils";

type MascotImageProps = {
  /** Rendered width/height in CSS pixels (square artwork). */
  size?: number;
  className?: string;
  /** Use `priority` for above-the-fold usage (hero) to avoid lazy-loading it. */
  priority?: boolean;
  sizes?: string;
  alt?: string;
  fetchPriority?: "high" | "low" | "auto";
  /**
   * `square` — the original artwork inside its badge frame (JPEG).
   * `circle` — transparent-background circular cut-out (PNG), for placing the
   *            mascot directly on the page background. See
   *            `scripts/make-circular-mascot.py`.
   */
  variant?: "square" | "circle";
  /** Rendered width/height attributes override (defaults to `size`). */
  width?: number;
  height?: number;
};

const { mascot, mascotCircle } = siteConfig.brand;

const ALT =
  "Bitty the Cat — an orange-and-white cat in an orange hoodie, a $BTC cap and Bitcoin sunglasses";

/**
 * Responsive mascot artwork. Serves pre-generated sizes with `srcSet` so phones
 * download a small file and large screens stay crisp — no image optimizer
 * required, which keeps the site deployable as a pure static export.
 */
export function MascotImage({
  size = 512,
  className,
  priority = false,
  sizes = "(max-width: 768px) 80vw, 42vw",
  alt = ALT,
  fetchPriority,
  variant = "square",
  width,
  height,
}: MascotImageProps) {
  const source = variant === "circle" ? mascotCircle : mascot;
  const srcSet = assetSrcSet(source.srcSet);
  const type = variant === "circle" ? "image/png" : "image/jpeg";

  return (
    <picture>
      <source type={type} srcSet={srcSet} sizes={sizes} width={source.width} height={source.height} />
      <img
        src={assetPath(source.src)}
        srcSet={srcSet}
        sizes={sizes}
        width={width ?? size}
        height={height ?? size}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        decoding={priority ? "sync" : "async"}
        fetchPriority={fetchPriority ?? (priority ? "high" : "auto")}
        className={cx("h-auto w-full select-none", className)}
        draggable={false}
      />
    </picture>
  );
}
