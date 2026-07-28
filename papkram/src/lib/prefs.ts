import { LEVELS, type Level } from "../../api/_lib/schema";

/**
 * The only thing Papkram remembers: which reading level you chose.
 *
 * No cookies, no analytics, no identifiers — and never anything from a letter.
 * localStorage is used because a preference that resets every visit is a small
 * daily insult to someone who needs Leichte Sprache every time.
 */
const KEY = "papkram.level";

export function readLevel(): Level {
  try {
    const stored = window.localStorage.getItem(KEY);
    return LEVELS.includes(stored as Level) ? (stored as Level) : "einfach";
  } catch {
    return "einfach";
  }
}

export function writeLevel(level: Level): void {
  try {
    window.localStorage.setItem(KEY, level);
  } catch {
    /* private mode or storage disabled — the choice just won't persist */
  }
}
