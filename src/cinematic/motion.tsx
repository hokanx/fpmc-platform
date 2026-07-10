/* FPMC motion toolkit — custom cursor, magnetic elements, split titles,
 * marquee. All gated: fine pointers / prefers-reduced-motion. */
import { useEffect, useRef, type ReactNode } from "react";

/* ---------- custom cursor (dot + beam halo) ---------- */

export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const haloRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const dot = dotRef.current;
    const halo = haloRef.current;
    if (!dot || !halo) return;

    let x = -100;
    let y = -100;
    let hx = -100;
    let hy = -100;
    let raf = 0;

    const move = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      const target = e.target as HTMLElement | null;
      const hot = !!target?.closest("a, button, input, [data-cursor-hot]");
      halo.dataset.hot = hot ? "true" : "false";
    };

    const loop = () => {
      hx += (x - hx) * 0.16;
      hy += (y - hy) * 0.16;
      dot.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
      halo.style.transform = `translate(${hx}px, ${hy}px) translate(-50%, -50%)`;
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("pointermove", move, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("pointermove", move);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div ref={haloRef} className="fpmc-cursor-halo" aria-hidden />
      <div ref={dotRef} className="fpmc-cursor-dot" aria-hidden />
    </>
  );
}

/* ---------- magnetic wrapper (CTAs pull toward the pointer) ---------- */

export function Magnetic({ children, strength = 0.32 }: { children: ReactNode; strength?: number }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = ref.current;
    if (!el) return;

    let raf = 0;
    let tx = 0;
    let ty = 0;
    let cx = 0;
    let cy = 0;
    let active = false;

    const loop = () => {
      cx += (tx - cx) * 0.18;
      cy += (ty - cy) * 0.18;
      el.style.transform = `translate(${cx.toFixed(2)}px, ${cy.toFixed(2)}px)`;
      if (active || Math.abs(cx) > 0.1 || Math.abs(cy) > 0.1) raf = requestAnimationFrame(loop);
      else el.style.transform = "";
    };

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const mx = e.clientX - (r.left + r.width / 2);
      const my = e.clientY - (r.top + r.height / 2);
      tx = mx * strength;
      ty = my * strength;
    };
    const onEnter = () => {
      active = true;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(loop);
    };
    const onLeave = () => {
      active = false;
      tx = 0;
      ty = 0;
    };

    el.addEventListener("pointerenter", onEnter);
    el.addEventListener("pointermove", onMove, { passive: true });
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointerenter", onEnter);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, [strength]);

  return (
    <span ref={ref} className="fpmc-magnet">
      {children}
    </span>
  );
}

/* ---------- split words (GSAP targets [data-split-word]) ---------- */

export function SplitWords({ text }: { text: string }) {
  return (
    <>
      {text.split(" ").map((word, i) => (
        <span key={i} style={{ display: "inline-block", whiteSpace: "pre" }}>
          <span data-split-word style={{ display: "inline-block" }}>
            {word}
          </span>
          {" "}
        </span>
      ))}
    </>
  );
}

/* ---------- beam rule (light sweeps along the section divider) ---------- */

export function BeamRule() {
  return (
    <div className="fpmc-beam" aria-hidden>
      <span data-beam-sweep />
    </div>
  );
}

/* ---------- marquee ---------- */

const MARQUEE_WORDS = ["Film", "Musik", "KI", "DACH ↔ MENA", "Cinema", "Sound"];

export function Marquee() {
  const items = [...MARQUEE_WORDS, ...MARQUEE_WORDS];
  return (
    <div className="fpmc-marquee" aria-hidden>
      <div className="fpmc-marquee-track">
        {items.map((w, i) => (
          <span key={i}>{w}</span>
        ))}
      </div>
    </div>
  );
}

/* ---------- tilt (portfolio cards, fine pointers) ---------- */

export function useTilt() {
  const ref = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = ref.current;
    if (!el) return;

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      el.style.transform = `perspective(900px) rotateX(${(-py * 4).toFixed(2)}deg) rotateY(${(px * 5).toFixed(2)}deg) translateY(-3px)`;
    };
    const onLeave = () => {
      el.style.transform = "";
    };
    el.addEventListener("pointermove", onMove, { passive: true });
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return ref;
}
