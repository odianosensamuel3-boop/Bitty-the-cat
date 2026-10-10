import { BitcoinIcon, PawIcon } from "@/components/ui/icons";
import { marqueeItems } from "@/data/content";

/**
 * Decorative brand ticker between the hero and the About section.
 * Purely presentational: hidden from assistive tech and paused by
 * `prefers-reduced-motion` (see globals.css).
 */
export function Marquee() {
  const items = [...marqueeItems, ...marqueeItems];

  return (
    <div
      aria-hidden="true"
      className="relative overflow-hidden border-y border-bitcoin/20 bg-[linear-gradient(90deg,#160D02,#1F1206_50%,#160D02)] py-4"
    >
      <div className="animate-marquee flex w-max items-center gap-10 whitespace-nowrap will-change-transform">
        {items.map((item, index) => (
          <span key={`${item}-${index}`} className="flex items-center gap-10">
            <span className="font-display text-sm font-black uppercase tracking-[0.28em] text-white/70 sm:text-base">
              {item}
            </span>
            {index % 2 === 0 ? (
              <BitcoinIcon className="h-5 w-5 text-golden" />
            ) : (
              <PawIcon className="h-5 w-5 text-bitcoin" />
            )}
          </span>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-ink to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-ink to-transparent" />
    </div>
  );
}

export default Marquee;
