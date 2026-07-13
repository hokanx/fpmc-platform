/* FPMC hero — canvas frame-sequence scroll scrub.
 * Scrolling runs the projector: a pinned (position: sticky) full-bleed canvas
 * draws the frame matching scroll progress through the 350vh section.
 * Letterbox bars open like a curtain in the first 12% of the scrub; a live
 * timecode counts the frames. prefers-reduced-motion → static poster.
 * The draw clamps its scale on narrow screens so the filmed logotype is never
 * cropped — the frame letterboxes into the void instead. */
import { useEffect, useRef, useState } from "react";

import { HERO_FRAME_COUNT, heroFramePath, HERO_POSTER } from "./hero-frames";
import { useI18n } from "../i18n";

export const HERO_ID = "fpmc-hero";

function drawCover(ctx: CanvasRenderingContext2D, img: CanvasImageSource, w: number, h: number) {
  const iw = (img as HTMLImageElement).naturalWidth || (img as ImageBitmap).width;
  const ih = (img as HTMLImageElement).naturalHeight || (img as ImageBitmap).height;
  if (!iw || !ih) return;
  const cover = Math.max(w / iw, h / ih);
  const maxScale = w / (iw * 0.72);
  const scale = Math.min(cover, maxScale);
  const dw = iw * scale;
  const dh = ih * scale;
  ctx.fillStyle = "#0a0a0a";
  ctx.fillRect(0, 0, w, h);
  ctx.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh);
}

function pad(n: number, l = 2) {
  return String(n).padStart(l, "0");
}

export function ScrubHero() {
  const { t } = useI18n();
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const barTopRef = useRef<HTMLDivElement>(null);
  const barBottomRef = useRef<HTMLDivElement>(null);
  const timecodeRef = useRef<HTMLSpanElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const cueRef = useRef<HTMLDivElement>(null);
  const lastDrawn = useRef(-1);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (reduced) return;
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let alive = true;
    const frames: (HTMLImageElement | null)[] = new Array(HERO_FRAME_COUNT).fill(null);

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      canvas.width = Math.round(window.innerWidth * dpr);
      canvas.height = Math.round(window.innerHeight * dpr);
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      lastDrawn.current = -1;
    };
    resize();
    window.addEventListener("resize", resize);

    const progress = () => {
      const rect = section.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      if (total <= 0) return 0;
      return Math.min(1, Math.max(0, -rect.top / total));
    };

    const nearestLoaded = (target: number) => {
      if (frames[target]) return target;
      for (let d = 1; d < HERO_FRAME_COUNT; d++) {
        if (target - d >= 0 && frames[target - d]) return target - d;
        if (target + d < HERO_FRAME_COUNT && frames[target + d]) return target + d;
      }
      return -1;
    };

    let rafId = 0;
    const render = () => {
      if (!alive) return;
      const p = progress();
      const target = Math.round(p * (HERO_FRAME_COUNT - 1));
      const idx = nearestLoaded(target);
      if (idx >= 0 && idx !== lastDrawn.current) {
        const img = frames[idx];
        if (img) {
          drawCover(ctx, img, canvas.width, canvas.height);
          lastDrawn.current = idx;
        }
      }

      const open = Math.min(1, p / 0.12);
      const bars = 1 - open;
      if (barTopRef.current) barTopRef.current.style.transform = `scaleY(${bars})`;
      if (barBottomRef.current) barBottomRef.current.style.transform = `scaleY(${bars})`;

      if (timecodeRef.current) {
        const f = Math.round(p * (HERO_FRAME_COUNT - 1));
        const sec = Math.floor(f / 24);
        timecodeRef.current.textContent = `00:00:${pad(sec)}:${pad(f % 24)} · 24 FPS`;
      }

      if (overlayRef.current) {
        // Subline fades out early so the frames own the screen …
        const fade = Math.min(1, Math.max(0, (p - 0.7) / 0.3));
        overlayRef.current.style.transform = `translateY(${(-fade * 26).toFixed(1)}px)`;
        overlayRef.current.style.opacity = String(1 - fade * 0.85);
      }
      if (cueRef.current) {
        // … but the animated scroll cue stays alive INSIDE the scrub and only
        // dissolves on the last stretch, when the section is nearly played out.
        const cueFade = Math.min(1, Math.max(0, (p - 0.86) / 0.14));
        cueRef.current.style.opacity = String(1 - cueFade);
      }

      rafId = requestAnimationFrame(render);
    };
    rafId = requestAnimationFrame(render);

    const order: number[] = [];
    for (let step = 8; step >= 1; step = Math.floor(step / 2)) {
      for (let i = 0; i < HERO_FRAME_COUNT; i += step) {
        if (!order.includes(i)) order.push(i);
      }
      if (step === 1) break;
    }
    let cursor = 0;
    const CONCURRENCY = 6;
    const loadNext = () => {
      if (!alive || cursor >= order.length) return;
      const i = order[cursor++];
      const img = new Image();
      img.decoding = "async";
      img.onload = () => {
        frames[i] = img;
        lastDrawn.current = -1;
        loadNext();
      };
      img.onerror = () => loadNext();
      img.src = heroFramePath(i);
    };
    for (let k = 0; k < CONCURRENCY; k++) loadNext();

    return () => {
      alive = false;
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
    };
  }, [reduced]);

  return (
    <section
      id={HERO_ID}
      ref={sectionRef}
      aria-label="FPMC"
      style={{ height: reduced ? "100svh" : "350vh", position: "relative" }}
    >
      <div style={{ position: "sticky", top: 0, height: "100svh", overflow: "hidden" }}>
        {reduced ? (
          <img
            src={HERO_POSTER}
            alt="FPMC — Film Production Music Club"
            className="fpmc-hero-poster"
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
          />
        ) : (
          <>
            <img
              src={HERO_POSTER}
              alt=""
              aria-hidden
              className="fpmc-hero-poster"
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
            />
            <canvas ref={canvasRef} style={{ position: "absolute", inset: 0 }} />
            <div ref={barTopRef} className="fpmc-letterbox fpmc-letterbox--top" aria-hidden />
            <div ref={barBottomRef} className="fpmc-letterbox fpmc-letterbox--bottom" aria-hidden />
            <span className="fpmc-timecode">
              <span ref={timecodeRef}>00:00:00:00 · 24 FPS</span>
            </span>
          </>
        )}

        <div
          ref={overlayRef}
          style={{
            position: "absolute",
            insetInline: 0,
            bottom: "7vh",
            zIndex: 6,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "1.4rem",
            textAlign: "center",
            padding: "0 1.5rem",
            willChange: "transform, opacity",
          }}
        >
          <p style={{ color: "var(--ash)", fontSize: "0.95rem", letterSpacing: "0.08em", margin: 0 }}>
            {t("cin.hero.subline")}
          </p>
        </div>

        {/* Animated scroll cue — separate layer so it survives the subline's
            early fade and keeps guiding through the whole scrub. */}
        <div
          ref={cueRef}
          className="fpmc-scrollcue"
          aria-hidden
          style={{
            position: "absolute",
            insetInline: 0,
            bottom: "2.6vh",
            zIndex: 6,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.55rem",
            willChange: "opacity",
          }}
        >
          <span className="fpmc-eyebrow">{t("cin.hero.scroll")}</span>
          <span className="fpmc-scrollcue-track">
            <span className="fpmc-scrollcue-drop" />
          </span>
          <span className="fpmc-scrollcue-chevrons">
            <svg width="14" height="8" viewBox="0 0 14 8" fill="none">
              <path d="M1 1l6 6 6-6" stroke="currentColor" strokeWidth="1.4" fill="none" />
            </svg>
            <svg width="14" height="8" viewBox="0 0 14 8" fill="none">
              <path d="M1 1l6 6 6-6" stroke="currentColor" strokeWidth="1.4" fill="none" />
            </svg>
          </span>
        </div>
      </div>
    </section>
  );
}
