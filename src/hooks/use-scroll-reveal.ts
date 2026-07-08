"use client";

import * as React from "react";

/**
 * Reveal-on-scroll hook based on IntersectionObserver.
 * Adds the `is-visible` class to elements with `.reveal` when they enter viewport.
 * Respects prefers-reduced-motion (handled in CSS).
 *
 * @param deps — dependency array; when changed, re-scans for new .reveal elements
 */
export function useScrollReveal(deps: unknown[] = []) {
  React.useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>(".reveal:not(.is-visible)"));
    if (els.length === 0) return;

    if (typeof IntersectionObserver === "undefined") {
      els.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            const delay = el.dataset.delay;
            if (delay) el.style.transitionDelay = `${delay}ms`;
            el.classList.add("is-visible");
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );

    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
