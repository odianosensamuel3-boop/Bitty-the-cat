"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import Logo from "@/components/ui/Logo";
import { CloseIcon, MenuIcon } from "@/components/ui/icons";
import { getBuyUrl, siteConfig } from "@/config/site.config";
import { cx } from "@/lib/utils";

const SECTION_IDS = ["home", "about", "tokenomics", "how-to-buy", "community"];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("home");
  const buyUrl = getBuyUrl();

  /* --- condense the bar once the hero starts scrolling away --- */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* --- highlight the section currently in view --- */
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.25, 0.5] },
    );
    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  /* --- lock body scroll + close on Escape while the mobile menu is open --- */
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const close = useCallback(() => setOpen(false), []);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        className={cx(
          "border-b transition-all duration-500",
          scrolled || open
            ? "border-bitcoin/20 bg-ink/85 backdrop-blur-xl shadow-[0_18px_50px_-30px_rgba(0,0,0,1)]"
            : "border-transparent bg-transparent",
        )}
      >
        <nav
          aria-label="Primary"
          className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:h-20 sm:px-6 lg:px-8"
        >
          <Logo size={40} />

          {/* ---------- desktop links ---------- */}
          <ul className="hidden items-center gap-1 lg:flex">
            {siteConfig.navigation.map((item) => {
              const id = item.href.replace("#", "");
              const isActive = active === id;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive ? "true" : undefined}
                    className={cx(
                      "relative rounded-pill px-4 py-2 text-sm font-semibold transition-colors duration-300",
                      isActive ? "text-golden" : "text-white/75 hover:text-white",
                    )}
                  >
                    {item.label}
                    <span
                      aria-hidden="true"
                      className={cx(
                        "absolute inset-x-4 -bottom-0.5 h-0.5 rounded-full bg-[linear-gradient(90deg,transparent,#FF6B00,transparent)] transition-opacity duration-300",
                        isActive ? "opacity-100" : "opacity-0",
                      )}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* ---------- desktop CTA ---------- */}
          <div className="hidden items-center gap-3 lg:flex">
            {buyUrl ? (
              <Button href={buyUrl} external size="md" className="ring-brand">
                Buy {siteConfig.brand.ticker}
              </Button>
            ) : (
              <Button
                href="#how-to-buy"
                size="md"
                variant="secondary"
                title="Official exchange link coming soon"
                className="opacity-80"
              >
                Buy {siteConfig.brand.ticker}
              </Button>
            )}
          </div>

          {/* ---------- mobile controls ---------- */}
          <div className="flex items-center gap-2 lg:hidden">
            <Link
              href={buyUrl ?? "#how-to-buy"}
              {...(buyUrl ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="rounded-pill bg-[linear-gradient(120deg,#FFC928,#F7931A_45%,#FF6B00)] px-4 py-2 font-display text-xs font-black uppercase tracking-wide text-ink shadow-[0_10px_26px_-14px_rgba(255,107,0,0.9)]"
            >
              Buy {siteConfig.brand.ticker}
            </Link>
            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close navigation menu" : "Open navigation menu"}
              className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/12 bg-white/[0.05] text-white transition hover:border-bitcoin/60 hover:text-golden"
            >
              {open ? <CloseIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
            </button>
          </div>
        </nav>

        {/* ---------- mobile menu ---------- */}
        <div
          id="mobile-menu"
          hidden={!open}
          className="lg:hidden"
          style={open ? undefined : { display: "none" }}
        >
          <ul className="mx-auto flex w-full max-w-7xl flex-col gap-1 px-4 pb-6 pt-2 sm:px-6">
            {siteConfig.navigation.map((item, index) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={close}
                  className={cx(
                    "flex items-center justify-between rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3.5 text-base font-bold text-white/90 transition",
                    "hover:border-bitcoin/50 hover:bg-bitcoin/10 hover:text-golden",
                  )}
                >
                  {item.label}
                  <span aria-hidden="true" className="font-mono text-xs text-golden/60">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </Link>
              </li>
            ))}
            <li className="mt-2">
              {buyUrl ? (
                <Button href={buyUrl} external block size="lg">
                  Buy {siteConfig.brand.ticker}
                </Button>
              ) : (
                <Button href="#how-to-buy" block size="lg">
                  Buy {siteConfig.brand.ticker}
                </Button>
              )}
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
