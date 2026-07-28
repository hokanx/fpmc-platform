import type { LetterResult } from "../../api/_lib/schema";
import { LABELS } from "../i18n/labels";
import { formatBetrag, fristInfo } from "./frist";

/**
 * Ways to keep the result, all of them entirely on the device.
 *
 * People want to show this to a partner, a neighbour or an advisor at a
 * Beratungsstelle, and right now closing the tab loses everything. The
 * temptation is a "save my letters" account — which would mean storing letters,
 * and the no-storage promise is the reason this app deserves trust. Printing,
 * copying and the share sheet get the same outcome without a server ever
 * holding anything.
 */

/** Plain-text rendering, for the clipboard and the share sheet. */
export function asText(letter: LetterResult): string {
  const l = LABELS[letter.sprache];
  const frist = fristInfo(letter.frist, letter.sprache);
  const lines: string[] = [];

  lines.push(letter.worum_geht_es, "");
  if (letter.absender) lines.push(`${l.von}: ${letter.absender}`);

  lines.push(`${l.aktion} ${letter.aktion ?? l.keineAktion}`);

  if (frist) lines.push(`${l.frist}: ${frist.text} (${frist.datum})`);
  else if (letter.frist_text) lines.push(`${l.frist}: ${letter.frist_text}`);

  if (letter.betrag) {
    const label = letter.betrag.richtung === "zahlen" ? l.zahlen : l.erhalten;
    lines.push(`${label}: ${formatBetrag(letter.betrag.wert, letter.betrag.waehrung, letter.sprache)}`);
  }

  lines.push("", l.zusammenfassung, ...letter.zusammenfassung.map((s) => `• ${s}`));

  if (letter.schwierige_woerter.length > 0) {
    lines.push("", l.schwereWoerter);
    for (const w of letter.schwierige_woerter) lines.push(`• ${w.wort}: ${w.erklaerung}`);
  }

  if (letter.unklar.length > 0) {
    lines.push("", l.unklar, ...letter.unklar.map((u) => `• ${u}`));
  }

  lines.push("", l.hinweis, "", "Papkram");
  return lines.join("\n");
}

export async function copyToClipboard(letter: LetterResult): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(asText(letter));
    return true;
  } catch {
    return false;
  }
}

/** True when the browser offers a share sheet — iOS and Android, mostly. */
export function canShare(): boolean {
  return typeof navigator !== "undefined" && typeof navigator.share === "function";
}

export async function share(letter: LetterResult): Promise<boolean> {
  if (!canShare()) return false;
  try {
    await navigator.share({ title: "Papkram", text: asText(letter) });
    return true;
  } catch {
    // Includes the user simply dismissing the sheet, which is not an error.
    return false;
  }
}

/**
 * Printing is also the "save as PDF" path — every mobile and desktop print
 * dialogue offers it, so this covers keeping a copy without us writing a PDF
 * generator or shipping one to the browser.
 */
export function print(): void {
  window.print();
}
