"use client";

import { useEffect } from "react";

/**
 * Adds `.is-visible` to every `.reveal` element as it scrolls into view.
 * Runs once at the app root; new elements are picked up automatically, which
 * keeps section components free of animation plumbing.
 */
export function ScrollReveal() {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("js-reveal");

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || typeof IntersectionObserver === "undefined") {
      document.querySelectorAll<HTMLElement>(".reveal").forEach((el) => el.classList.add("is-visible"));
      return () => root.classList.remove("js-reveal");
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
    );

    const observeAll = () => {
      document.querySelectorAll<HTMLElement>(".reveal:not(.is-visible)").forEach((el) => observer.observe(el));
    };

    observeAll();

    const mutation = new MutationObserver(observeAll);
    mutation.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutation.disconnect();
      root.classList.remove("js-reveal");
    };
  }, []);

  return null;
}

/** Returns true when the visitor prefers reduced motion. Safe during SSR. */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
