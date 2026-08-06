/* Reveal-on-enter for [data-reveal] elements. Transform + opacity only, fired
 * once per element, and a no-op under prefers-reduced-motion (the CSS already
 * shows those elements unconditionally).
 */
import { useEffect } from "react";

export function useReveal(deps: unknown[] = []) {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const nodes = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    if (!nodes.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target as HTMLElement;
          el.dataset.shown = "true";
          io.unobserve(el);
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
    );
    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
