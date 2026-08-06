/* FPMC film hero — Mode A: ONE generated film, cut at its midpoint into TWO
 * chapters. Each chapter is a <video> whose currentTime is driven by the scroll
 * progress of its own band, so scrolling literally runs the projector.
 *
 * Rules this component holds to:
 *  - the poster paints a finished hero before any JS runs
 *  - `linger` is 0: a chapter answers within a frame of crossing its band
 *  - seeks are coalesced (no seek storm while the wheel is spinning)
 *  - chapter copy moves with transform + clip-path only, never opacity-to-zero
 *  - both the motion and the reduced-motion variant live in the DOM; CSS picks
 *  - with reduced motion NO video is ever fetched (src is assigned in JS only)
 *  - the mark is registered onto the surface the film lands on, over the last
 *    5% of scrub progress, wearing the scene's grade
 */
import { useEffect, useRef, type ReactNode } from "react";

import "./film-hero.css";

export type FilmChapter = {
  eyebrow: string;
  title: string;
  line: string;
  align?: "left" | "right";
  actions?: ReactNode;
};

/** Where the real mark sits on the surface the film lands on. */
export type MarkPlacement = {
  left: string;
  top: string;
  width: string;
  transform?: string;
  opacity?: number;
  /** blend mode against the surface — a bright surface needs multiply/darken */
  blend?: "soft-light" | "screen" | "multiply" | "darken" | "overlay";
};

type Props = {
  /** folder under /media/film/<slug>/ holding scene-01/02 + posters */
  slug: string;
  chapters: [FilmChapter, FilmChapter];
  mark?: MarkPlacement;
  ariaLabel?: string;
};

/** Band weights. Chapter 2 is slightly longer so the landing beat can breathe. */
const WEIGHTS = [1.35, 1.45] as const;
const TOTAL = WEIGHTS[0] + WEIGHTS[1];
const BOUNDARY = WEIGHTS[0] / TOTAL;
/** Never raise this: at 0.2 the film reads as frozen at the chapter entry. */
const LINGER = 0;

function clamp01(v: number) {
  return v < 0 ? 0 : v > 1 ? 1 : v;
}

export function FilmHero({ slug, chapters, mark, ariaLabel = "FPMC" }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([null, null]);
  const chapterRefs = useRef<(HTMLDivElement | null)[]>([null, null]);
  const railFillRef = useRef<HTMLDivElement>(null);
  const railNumRefs = useRef<(HTMLSpanElement | null)[]>([null, null]);
  const markRef = useRef<HTMLImageElement>(null);

  const base = `/media/film/${slug}`;

  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Reduced motion never fetches a single byte of video.
    if (reduced) return;

    const section = sectionRef.current;
    if (!section) return;

    const mobile = window.matchMedia("(max-width: 767px)").matches;
    const suffix = mobile ? "-mobile" : "";

    // Assign sources in JS (not JSX) so the reduced-motion tree stays inert.
    const sources = [`${base}/scene-01${suffix}.mp4`, `${base}/scene-02${suffix}.mp4`];
    const first = videoRefs.current[0];
    if (first) {
      first.src = sources[0];
      first.load();
    }
    // Cache warm-up: chapter 2 starts fetching shortly after first paint, so
    // crossing the band does not begin with an empty buffer.
    const warm = window.setTimeout(() => {
      const second = videoRefs.current[1];
      if (second && !second.src) {
        second.src = sources[1];
        second.load();
      }
    }, 800);

    let alive = true;
    let rafId = 0;
    const lastSeek = [-1, -1];
    let lastActive = -1;

    const progress = () => {
      const rect = section.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      if (total <= 0) return 0;
      return clamp01(-rect.top / total);
    };

    const bandLocal = (p: number, index: number) => {
      const start = index === 0 ? 0 : BOUNDARY;
      const end = index === 0 ? BOUNDARY : 1;
      const span = end - start;
      if (span <= 0) return 0;
      // LINGER would hold the first/last frame at the band edges. Kept at 0.
      const raw = (p - start) / span;
      return clamp01(raw * (1 + LINGER * 2) - LINGER);
    };

    const render = () => {
      if (!alive) return;
      const p = progress();
      const active = p < BOUNDARY ? 0 : 1;

      if (active !== lastActive) {
        videoRefs.current.forEach((v, i) => {
          if (v) v.dataset.active = String(i === active);
        });
        railNumRefs.current.forEach((n, i) => {
          if (n) n.dataset.active = String(i === active);
        });
        chapterRefs.current.forEach((c, i) => {
          if (!c) return;
          const on = i === active;
          c.style.clipPath = on ? "inset(0 0 0 0)" : "inset(0 0 100% 0)";
          c.style.transform = on ? "translateY(0)" : `translateY(${i < active ? -26 : 26}px)`;
        });
        lastActive = active;
      }

      const video = videoRefs.current[active];
      if (video && video.readyState >= 1) {
        const duration = video.duration;
        if (duration && Number.isFinite(duration)) {
          const target = bandLocal(p, active) * (duration - 0.05);
          // Coalesce: only seek when the delta is worth a frame.
          if (Math.abs(target - lastSeek[active]) > 1 / 30) {
            try {
              video.currentTime = target;
              lastSeek[active] = target;
            } catch {
              /* seeking before metadata — next frame retries */
            }
          }
        }
      }

      if (railFillRef.current) {
        railFillRef.current.style.transform = `scaleX(${p.toFixed(4)})`;
      }
      if (markRef.current) {
        // The camera "finds" the mark: it resolves over the last 5% of scrub.
        const reveal = clamp01((p - 0.95) / 0.05);
        markRef.current.style.opacity = String(reveal * (mark?.opacity ?? 0.9));
      }

      rafId = requestAnimationFrame(render);
    };
    rafId = requestAnimationFrame(render);

    return () => {
      alive = false;
      cancelAnimationFrame(rafId);
      window.clearTimeout(warm);
      // Release decoders on route change.
      videoRefs.current.forEach((v) => {
        if (!v) return;
        v.removeAttribute("src");
        v.load();
      });
    };
  }, [base, mark?.opacity]);

  return (
    <section ref={sectionRef} className="fh" aria-label={ariaLabel}>
      <div className="fh-stage">
        {/* ---------- motion variant ---------- */}
        <div className="fh-motion">
          <img className="fh-poster" src={`${base}/scene-01-poster.jpg`} alt="" aria-hidden />
          {[0, 1].map((i) => (
            <video
              key={i}
              ref={(el) => {
                videoRefs.current[i] = el;
              }}
              className="fh-clip"
              data-active={i === 0 ? "true" : "false"}
              poster={`${base}/scene-0${i + 1}-poster.jpg`}
              muted
              playsInline
              preload="none"
              disablePictureInPicture
              aria-hidden
            />
          ))}

          {mark ? (
            <img
              ref={markRef}
              className="fh-mark"
              src="/fpmc-logo.svg"
              alt=""
              aria-hidden
              style={{
                left: mark.left,
                top: mark.top,
                width: mark.width,
                transform: mark.transform,
                mixBlendMode: mark.blend ?? "soft-light",
              }}
            />
          ) : null}

          <div className="fh-stages">
            {chapters.map((ch, i) => (
              <div
                key={ch.title}
                ref={(el) => {
                  chapterRefs.current[i] = el;
                }}
                className="fh-chapter"
                data-align={ch.align ?? (i === 0 ? "left" : "right")}
                style={{
                  // Chapter 1 is fully visible at scroll 0 so the first paint is
                  // complete; later chapters start clipped, before JS runs.
                  clipPath: i === 0 ? "inset(0 0 0 0)" : "inset(0 0 100% 0)",
                  transform: i === 0 ? "translateY(0)" : "translateY(26px)",
                  transition: "clip-path 520ms cubic-bezier(0.22,1,0.36,1), transform 520ms cubic-bezier(0.22,1,0.36,1)",
                }}
              >
                <span className="fh-eyebrow">{ch.eyebrow}</span>
                <h1 className="fh-title">{ch.title}</h1>
                <p className="fh-line">{ch.line}</p>
                {ch.actions ? <div className="fh-actions">{ch.actions}</div> : null}
              </div>
            ))}
          </div>

          <div className="fh-rail" aria-hidden>
            <span
              className="fh-rail-num"
              data-active="true"
              ref={(el) => {
                railNumRefs.current[0] = el;
              }}
            >
              01
            </span>
            <span className="fh-rail-track">
              <span className="fh-rail-fill" ref={railFillRef} />
            </span>
            <span
              className="fh-rail-num"
              data-active="false"
              ref={(el) => {
                railNumRefs.current[1] = el;
              }}
            >
              02
            </span>
          </div>
        </div>

        {/* ---------- reduced-motion variant (CSS decides, never JS) ---------- */}
        <div className="fh-static">
          {chapters.map((ch, i) => (
            <div className="fh-static-frame" key={`static-${ch.title}`}>
              <img src={`${base}/scene-0${i + 1}-last.jpg`} alt="" aria-hidden />
              <div className="fh-static-copy">
                <span className="fh-eyebrow">{ch.eyebrow}</span>
                {i === 0 ? <h1 className="fh-title">{ch.title}</h1> : <h2 className="fh-title">{ch.title}</h2>}
                <p className="fh-line">{ch.line}</p>
                {ch.actions ? <div className="fh-actions">{ch.actions}</div> : null}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
