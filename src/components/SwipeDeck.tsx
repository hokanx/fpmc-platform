/* FPMC — swipeable portfolio deck.
 *
 * Each card is a real screenshot of the live site with its name, kind and city.
 * Swipe with touch, drag with the pointer, arrow-key, or step with the arrows.
 * The track is a scroll-snap container, so swiping is native and never fights
 * the page scroll. Clicking a card opens the live site.
 */
import { useRef } from "react";

import type { Website } from "../config";
import { useI18n } from "../i18n";

type Props = {
  websites: readonly Website[];
};

export function SwipeDeck({ websites }: Props) {
  const { t } = useI18n();
  const trackRef = useRef<HTMLDivElement>(null);

  const step = (dir: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector<HTMLElement>(".fpmc-deck-card");
    const w = card ? card.offsetWidth : 0;
    track.scrollBy({ left: dir * (w + 8), behavior: "smooth" });
  };

  return (
    <div className="fpmc-deck">
      <div className="fpmc-deck-track" ref={trackRef}>
        {websites.map((w) => (
          <a
            key={w.name}
            className="fpmc-deck-card"
            href={w.href}
            target="_blank"
            rel="noreferrer noopener"
            aria-label={`${w.name} — ${w.kind}`}
          >
            <span className="fpmc-deck-shot">
              <img src={w.preview} alt={`${w.name} — ${w.kind}, ${w.city}`} loading="lazy" decoding="async" />
            </span>
            <span className="fpmc-deck-meta">
              <span className="fpmc-deck-name">{w.name}</span>
              <span className="fpmc-deck-kind">
                {w.kind} · {w.city}
              </span>
            </span>
          </a>
        ))}
      </div>

      <div className="fpmc-deck-controls">
        <button type="button" className="fpmc-deck-btn" onClick={() => step(-1)} aria-label={t("deck.prev")}>
          ←
        </button>
        <span className="fpmc-deck-hint">{t("deck.hint")}</span>
        <button type="button" className="fpmc-deck-btn" onClick={() => step(1)} aria-label={t("deck.next")}>
          →
        </button>
      </div>
    </div>
  );
}