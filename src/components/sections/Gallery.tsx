"use client";

import { useCallback, useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import SectionHeading from "@/components/ui/SectionHeading";
import { CloseIcon, PawIcon } from "@/components/ui/icons";
import { galleryItems, gallerySrcWidths } from "@/data/content";
import { getSocialLinks } from "@/config/site.config";
import { cx } from "@/lib/utils";

function srcSet(base: string) {
  // Largest width (900) is the plain file name; smaller ones carry a suffix.
  const widths = gallerySrcWidths.map((width) => (width === 900 ? `${base}.jpg ${width}w` : `${base}-${width}.jpg ${width}w`));
  return widths.join(", ");
}

/**
 * Meme gallery. The supplied mascot artwork is the visual reference for every
 * tile — drop your own images into /public/gallery and point `galleryItems`
 * at them to feature community creations.
 */
export function Gallery() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const active = openIndex === null ? null : galleryItems[openIndex];

  const close = useCallback(() => setOpenIndex(null), []);

  useEffect(() => {
    if (openIndex === null) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [openIndex, close]);

  const socials = getSocialLinks().filter((link) => link.href);
  const communityHref = socials[0]?.href ?? "#community";

  return (
    <section id="memes" className="relative overflow-hidden py-20 sm:py-24">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-x-0 top-0 h-px hairline" />
        <div className="absolute -left-24 top-1/4 h-64 w-64 rounded-full bg-orange/10 blur-[120px]" />
        <div className="absolute -right-20 bottom-1/4 h-64 w-64 rounded-full bg-golden/10 blur-[120px]" />
      </div>

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Meme Gallery"
          title={
            <>
              THE MANY MOODS <span className="text-gradient-orange">OF BITTY</span>
            </>
          }
          description={
            <p>
              Same cat, endless energy. These tiles are original placeholder art built from the official Bitty mascot —
              swap in community creations any time.
            </p>
          }
        />

        <ul className="mt-12 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {galleryItems.map((item, index) => (
            <li
              key={item.base}
              className="reveal"
              style={{ "--reveal-delay": `${(index % 4) * 70}ms` } as React.CSSProperties}
            >
              <button
                type="button"
                onClick={() => setOpenIndex(index)}
                aria-label={`Open "${item.caption}" larger`}
                className="group relative block aspect-square w-full overflow-hidden rounded-card border border-white/8 bg-charcoal transition-[transform,border-color,box-shadow] duration-500 hover:-translate-y-1 hover:border-golden/50 hover:shadow-glow focus-visible:-translate-y-1"
              >
                <img
                  src={`${item.base}.jpg`}
                  srcSet={srcSet(item.base)}
                  sizes="(max-width: 640px) 46vw, (max-width: 1024px) 30vw, 22vw"
                  alt={item.alt}
                  width={900}
                  height={900}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
                />
                <span
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/10 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-95"
                />
                <span className="absolute inset-x-3 bottom-3 flex items-center justify-between gap-2 text-left">
                  <span className="font-display text-[0.7rem] font-black uppercase tracking-[0.14em] text-white drop-shadow sm:text-sm">
                    {item.caption}
                  </span>
                  <PawIcon className="h-4 w-4 shrink-0 text-golden opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                </span>
              </button>
            </li>
          ))}
        </ul>

        <div className="reveal mt-10 flex flex-col items-center gap-4 text-center">
          <Button href={communityHref} external={communityHref.startsWith("http")} size="lg" variant="secondary" icon={<PawIcon className="h-5 w-5" />}>
            More Bitty Memes
          </Button>
          <p className="max-w-xl text-xs leading-relaxed text-white/40">
            Community submissions are welcome. Follow the official channels to share your own Bitty artwork and memes.
          </p>
        </div>
      </div>

      {/* ---------- lightbox ---------- */}
      {active ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={active.caption}
          className="fixed inset-0 z-[90] flex items-center justify-center bg-ink/90 p-4 backdrop-blur-md"
          onClick={close}
        >
          <div
            className="animate-pop relative w-full max-w-2xl overflow-hidden rounded-card border border-bitcoin/30 bg-charcoal shadow-[0_40px_120px_-40px_rgba(0,0,0,1)]"
            onClick={(event) => event.stopPropagation()}
          >
            <img
              src={`${active.base}.jpg`}
              srcSet={srcSet(active.base)}
              sizes="(max-width: 768px) 92vw, 640px"
              alt={active.alt}
              width={900}
              height={900}
              className="h-auto w-full"
            />
            <div className="flex items-center justify-between gap-4 border-t border-white/8 px-5 py-4">
              <div>
                <p className="font-display text-sm uppercase tracking-wide text-white sm:text-base">{active.caption}</p>
                <p className="mt-1 text-xs text-white/45">Original placeholder art · Bitty the Cat</p>
              </div>
              <button
                type="button"
                onClick={close}
                aria-label="Close image"
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/12 bg-white/[0.05] text-white transition hover:border-golden/60 hover:text-golden"
              >
                <CloseIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
          <span className="pointer-events-none absolute inset-x-0 bottom-5 text-center text-xs uppercase tracking-[0.2em] text-white/40">
            Press Esc or tap outside to close
          </span>
        </div>
      ) : null}
    </section>
  );
}

export default Gallery;
