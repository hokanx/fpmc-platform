/* FPMC reel band — the studio's real Instagram reels, previewed in place.
 *
 * The clips are FPMC's own reels, downloaded and re-encoded as silent 8s loops
 * served from our own origin (no Instagram embed, no third-party cookies, no
 * layout jank). A card plays only while it is on screen and pauses when it
 * leaves; the poster frame paints first. Clicking opens the real reel.
 *
 * layout: "fixed" lays every clip out at once in a fixed grid (nothing hidden
 * off-screen, no horizontal scrolling); "row" is the snapping scroll rail.
 */
import { useEffect, useRef } from "react";

import { reelPoster, reelSrc, type Reel } from "../config";
import { useI18n } from "../i18n";

type Props = {
  eyebrow: string;
  title: string;
  body?: string;
  reels: Reel[];
  layout?: "row" | "fixed";
};

function ReelCard({ reel }: { reel: Reel }) {
  const { t } = useI18n();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            if (!video.src) video.src = reelSrc(reel.code);
            void video.play().catch(() => {
              /* autoplay refused — the poster stays, click still works */
            });
          } else {
            video.pause();
          }
        }
      },
      { threshold: 0.35 },
    );
    io.observe(video);
    return () => io.disconnect();
  }, [reel.code]);

  return (
    <a
      href={reel.href}
      target="_blank"
      rel="noreferrer noopener"
      className="fpmc-reel"
      aria-label={`${reel.caption} — ${t("reels.open")}`}
    >
      <video
        ref={videoRef}
        poster={reelPoster(reel.code)}
        muted
        loop
        playsInline
        preload="none"
        disablePictureInPicture
        aria-hidden
      />
      <span className="fpmc-reel-meta">
        <span className="fpmc-reel-caption" dir="auto">
          {reel.caption}
        </span>
        <span className="fpmc-reel-plays">
          {reel.plays.toLocaleString("en-US")} {t("reels.plays")}
        </span>
      </span>
    </a>
  );
}

export function ReelBand({ eyebrow, title, body, reels, layout = "row" }: Props) {
  return (
    <section className="fpmc-band">
      <div className="fpmc-band-head">
        <span className="fh-eyebrow">{eyebrow}</span>
        <h2>{title}</h2>
        {body ? <p className="fpmc-band-body">{body}</p> : null}
      </div>
      <div className={layout === "fixed" ? "fpmc-reel-row fpmc-reel-row--fixed" : "fpmc-reel-row"}>
        {reels.map((reel) => (
          <ReelCard key={reel.code} reel={reel} />
        ))}
      </div>
    </section>
  );
}
