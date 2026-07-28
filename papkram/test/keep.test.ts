import { assert, test } from "vitest";
import { asText } from "../src/lib/keep";
import type { LetterResult } from "../api/_lib/schema";

/**
 * The printed / copied / shared text is what someone hands to an advisor at a
 * Beratungsstelle. If the action box says one thing on screen and the copy in
 * their hand says another, the app has actively misled them — so the same facts
 * have to survive the round trip.
 */
const letter: LetterResult = {
  absender: "Jobcenter Köln",
  art: "behoerde",
  worum_geht_es: "Sie bekommen ab August 2026 Bürgergeld.",
  aktion: "Sie müssen die Anlage EK ausfüllen.",
  frist: "2026-08-21",
  frist_text: "bis spätestens 21.08.2026",
  betrag: { wert: 563, waehrung: "EUR", richtung: "erhalten" },
  zusammenfassung: ["Das Jobcenter hat Ihren Antrag geprüft.", "Sie bekommen 563 Euro im Monat."],
  schwierige_woerter: [{ wort: "Bewilligung", erklaerung: "Das Amt sagt Ja." }],
  unklar: ["Die Unterschrift war nicht lesbar."],
  hilfe_empfohlen: true,
  sprache: "de",
};

test("carries every fact from the action box", () => {
  const text = asText(letter);
  assert.include(text, "Sie bekommen ab August 2026 Bürgergeld.");
  assert.include(text, "Jobcenter Köln");
  assert.include(text, "Anlage EK");
  assert.include(text, "21. August 2026"); // the deadline, written out
  assert.include(text, "563"); // the amount
});

test("states the amount direction, not just the number", () => {
  // A bare "563 €" on paper is ambiguous in exactly the way that matters.
  assert.include(asText(letter), "Sie bekommen Geld");
  assert.include(
    asText({ ...letter, betrag: { wert: 90, waehrung: "EUR", richtung: "zahlen" } }),
    "Sie müssen zahlen",
  );
});

test("always carries the disclaimer", () => {
  assert.include(asText(letter), "keine Rechts·beratung");
});

test("includes the summary, the glossary and what could not be read", () => {
  const text = asText(letter);
  assert.include(text, "Das Jobcenter hat Ihren Antrag geprüft.");
  assert.include(text, "Bewilligung: Das Amt sagt Ja.");
  assert.include(text, "Die Unterschrift war nicht lesbar.");
});

test("says so explicitly when nothing has to be done", () => {
  assert.include(asText({ ...letter, aktion: null }), "Sie müssen nichts tun.");
});

test("falls back to the letter's own wording when there is no calendar date", () => {
  const text = asText({ ...letter, frist: null });
  assert.include(text, "bis spätestens 21.08.2026");
});

test("omits optional sections rather than printing empty headings", () => {
  const bare = asText({
    ...letter,
    absender: null,
    betrag: null,
    frist: null,
    frist_text: null,
    schwierige_woerter: [],
    unklar: [],
  });
  assert.notInclude(bare, "Schwere Wörter erklärt");
  assert.notInclude(bare, "Das konnten wir nicht lesen");
  assert.notInclude(bare, "Frist");
});

test("follows the reader's language, headings included", () => {
  const tr = asText({ ...letter, sprache: "tr" });
  assert.include(tr, "Ne yapmanız gerekiyor?");
  assert.include(tr, "Son tarih");
  assert.notInclude(tr, "Worum geht es?");
});
