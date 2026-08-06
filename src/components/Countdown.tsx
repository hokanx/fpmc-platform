/* FPMC countdown — counts down to the release in the visitor's own clock while
 * the target itself is a fixed instant (07.08.2026, 16:00 German time), so it
 * is correct from every timezone. Once the instant passes it flips to "live".
 */
import { useEffect, useState } from "react";

import { DROP_URL } from "../config";
import { useI18n } from "../i18n";

type Props = {
  /** ISO instant with offset, e.g. 2026-08-07T16:00:00+02:00 */
  target: string;
  className?: string;
  /** show the drop CTA under the digits (default true) */
  cta?: boolean;
};

function pad(n: number) {
  return String(Math.max(0, n)).padStart(2, "0");
}

function split(msLeft: number) {
  const s = Math.max(0, Math.floor(msLeft / 1000));
  return {
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
  };
}

export function Countdown({ target, className, cta = true }: Props) {
  const { t } = useI18n();
  const targetMs = new Date(target).getTime();
  const [left, setLeft] = useState(() => targetMs - Date.now());

  useEffect(() => {
    const id = window.setInterval(() => setLeft(targetMs - Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [targetMs]);

  const done = left <= 0;
  const { days, hours, minutes, seconds } = split(left);

  const units: Array<[string, string]> = [
    [pad(days), t("cin.release.u1")],
    [pad(hours), t("cin.release.u2")],
    [pad(minutes), t("cin.release.u3")],
    [pad(seconds), t("cin.release.u4")],
  ];

  return (
    <div className={className} aria-live="off">
      {done ? (
        <>
          <p className="text-light" style={{ fontSize: "clamp(1.4rem,3vw,2.2rem)", margin: 0 }}>
            {t("cin.release.live")}
          </p>
          {/* the CTA exists only once there is something to watch */}
          {cta ? (
            <p style={{ margin: "1.6rem 0 0" }}>
              <a
                href={DROP_URL}
                target="_blank"
                rel="noreferrer noopener"
                className="fpmc-cta fpmc-cta--release"
              >
                {t("countdown.cta")}
              </a>
            </p>
          ) : null}
        </>
      ) : (
        <div style={{ display: "flex", gap: "clamp(1rem,3vw,2.6rem)", flexWrap: "wrap" }}>
          {units.map(([value, label]) => (
            <div key={label} style={{ minWidth: "4.2rem" }}>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: "clamp(2.6rem,7vw,4.6rem)",
                  lineHeight: 0.9,
                  letterSpacing: "-0.02em",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {value}
              </div>
              <div
                style={{
                  fontSize: "0.68rem",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "var(--color-ash)",
                  marginTop: "0.5rem",
                }}
              >
                {label}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
