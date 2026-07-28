import type { OutLang } from "../../api/_lib/schema";
import { LABELS, LOCALES } from "../i18n/labels";

/**
 * Deadline maths.
 *
 * Kept on the client on purpose: the model is told never to compute a date,
 * only to read one off the page. "How many days is that from today" is
 * arithmetic, and arithmetic belongs somewhere it cannot be hallucinated.
 */

export type FristInfo = {
  /** Negative once the deadline has passed. 0 means today. */
  tage: number;
  status: "abgelaufen" | "heute" | "knapp" | "offen";
  /** Ready to read in the active language, e.g. "Noch 5 Tage". */
  text: string;
  /** The date itself, formatted for the active language. */
  datum: string;
};

/** Whole calendar days between today and the deadline, ignoring clock time. */
function daysUntil(iso: string, today: Date): number | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!match) return null;

  const [, y, m, d] = match;
  const target = Date.UTC(Number(y), Number(m) - 1, Number(d));
  if (Number.isNaN(target)) return null;

  const now = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
  return Math.round((target - now) / 86_400_000);
}

export function formatDate(iso: string, lang: OutLang = "de"): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!match) return iso;
  const [, y, m, d] = match;
  const date = new Date(Date.UTC(Number(y), Number(m) - 1, Number(d)));
  try {
    return new Intl.DateTimeFormat(LOCALES[lang], {
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    }).format(date);
  } catch {
    return iso;
  }
}

export function fristInfo(
  iso: string | null,
  lang: OutLang = "de",
  today: Date = new Date(),
): FristInfo | null {
  if (!iso) return null;
  const tage = daysUntil(iso, today);
  if (tage === null) return null;

  const l = LABELS[lang];
  const datum = formatDate(iso, lang);

  if (tage < 0) {
    return { tage, status: "abgelaufen", datum, text: l.fristAbgelaufen(Math.abs(tage)) };
  }
  if (tage === 0) return { tage, status: "heute", datum, text: l.fristHeute };
  // Under a fortnight is where someone actually has to act now.
  if (tage <= 13) return { tage, status: "knapp", datum, text: l.fristNoch(tage) };
  return { tage, status: "offen", datum, text: l.fristNoch(tage) };
}

export function formatBetrag(wert: number, waehrung: string, lang: OutLang = "de"): string {
  try {
    return new Intl.NumberFormat(LOCALES[lang], {
      style: "currency",
      currency: waehrung,
      minimumFractionDigits: Number.isInteger(wert) ? 0 : 2,
    }).format(wert);
  } catch {
    // Unknown currency code — show the number rather than nothing.
    return `${wert} ${waehrung}`;
  }
}
