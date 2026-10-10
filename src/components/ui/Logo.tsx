import Link from "next/link";
import siteConfig from "@/config/site.config";
import { assetPath } from "@/lib/asset-path";
import { cx } from "@/lib/utils";

export function Logo({
  className,
  size = 40,
  withText = true,
  href = "#home",
}: {
  className?: string;
  size?: number;
  withText?: boolean;
  href?: string | null;
}) {
  const content = (
    <span className={cx("group inline-flex items-center gap-3", className)}>
      <span className="relative inline-flex shrink-0 items-center justify-center">
        <span
          aria-hidden="true"
          className="absolute inset-0 rounded-full bg-glow-radial opacity-70 blur-[10px] transition-opacity duration-500 group-hover:opacity-100"
        />
        <span
          className="relative block overflow-hidden rounded-full ring-2 ring-bitcoin/70 transition-transform duration-500 group-hover:scale-105"
          style={{ width: size, height: size }}
        >
          {/* Transparent circular cut-out so the logo reads as a badge. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={assetPath("/icons/favicon-96.png")}
            alt=""
            width={96}
            height={96}
            className="h-full w-full object-cover"
          />
        </span>
      </span>
      {withText ? (
        <span className="flex flex-col leading-none">
          <span className="font-display text-base font-black tracking-tight text-white sm:text-lg">
            BITTY <span className="text-gradient-orange">THE CAT</span>
          </span>
          <span className="mt-1 font-mono text-[0.62rem] font-semibold tracking-[0.28em] text-golden/80">
            {siteConfig.brand.ticker}
          </span>
        </span>
      ) : null}
    </span>
  );

  if (!href) return content;

  return (
    <Link href={href} aria-label={`${siteConfig.brand.name} — home`} className="rounded-2xl">
      {content}
    </Link>
  );
}

export default Logo;
