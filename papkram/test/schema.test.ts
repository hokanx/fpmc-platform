import { assert, test } from "vitest";
import { parseLetter, type Letter } from "../api/_lib/schema";

/**
 * parseLetter is the last thing standing between a bad model response and the
 * action box. Structured outputs make malformed responses unlikely, but
 * "unlikely" is not "impossible", and the failure modes here are the expensive
 * kind: a wrong `betrag.richtung` tells someone they owe money when they are
 * owed it, and an unparseable `frist` renders as "Noch NaN Tage".
 */

const valid: Letter = {
  absender: "Jobcenter Köln",
  art: "behoerde",
  worum_geht_es: "Sie bekommen weiter Bürgergeld.",
  aktion: "Sie müssen nichts tun.",
  frist: "2026-08-15",
  frist_text: "innerhalb von 4 Wochen",
  betrag: { wert: 563, waehrung: "EUR", richtung: "erhalten" },
  zusammenfassung: ["Das Jobcenter hat Ihren Antrag geprüft.", "Sie bekommen weiter Geld."],
  schwierige_woerter: [{ wort: "Bewilligung", erklaerung: "Das Amt sagt Ja zu Ihrem Antrag." }],
  unklar: [],
  hilfe_empfohlen: true,
};

test("accepts a well-formed letter unchanged", () => {
  assert.deepEqual(parseLetter(structuredClone(valid)), valid);
});

test("rejects non-objects", () => {
  for (const bad of [null, undefined, "text", 42, []]) {
    assert.equal(parseLetter(bad), null, `should reject ${JSON.stringify(bad)}`);
  }
});

test("rejects a missing or empty worum_geht_es", () => {
  assert.equal(parseLetter({ ...valid, worum_geht_es: "" }), null);
  assert.equal(parseLetter({ ...valid, worum_geht_es: undefined }), null);
});

test("rejects an unknown letter kind", () => {
  assert.equal(parseLetter({ ...valid, art: "spam" }), null);
});

test("rejects an empty summary", () => {
  assert.equal(parseLetter({ ...valid, zusammenfassung: [] }), null);
  assert.equal(parseLetter({ ...valid, zusammenfassung: "ein Satz" }), null);
});

test("drops a deadline that is not a real calendar date", () => {
  // The UI would otherwise render "Noch NaN Tage".
  for (const bad of ["bald", "15.08.2026", "2026-13-45", "2026-8-1", ""]) {
    const parsed = parseLetter({ ...valid, frist: bad });
    assert.ok(parsed, `should still parse with frist=${bad}`);
    assert.equal(parsed.frist, null, `frist=${bad} should be dropped`);
  }
});

test("keeps a valid ISO deadline", () => {
  assert.equal(parseLetter({ ...valid, frist: "2026-12-01" })?.frist, "2026-12-01");
});

test("drops an amount with an invalid direction", () => {
  // Better no amount at all than one pointing the wrong way.
  const parsed = parseLetter({
    ...valid,
    betrag: { wert: 100, waehrung: "EUR", richtung: "vielleicht" },
  });
  assert.ok(parsed);
  assert.equal(parsed.betrag, null);
});

test("drops an amount that is not a finite number", () => {
  for (const wert of ["100", NaN, Infinity, null]) {
    const parsed = parseLetter({
      ...valid,
      betrag: { wert, waehrung: "EUR", richtung: "zahlen" },
    });
    assert.ok(parsed);
    assert.equal(parsed.betrag, null, `wert=${String(wert)} should be dropped`);
  }
});

test("keeps both amount directions", () => {
  for (const richtung of ["zahlen", "erhalten"] as const) {
    const parsed = parseLetter({ ...valid, betrag: { wert: 42.5, waehrung: "EUR", richtung } });
    assert.equal(parsed?.betrag?.richtung, richtung);
    assert.equal(parsed?.betrag?.wert, 42.5);
  }
});

test("filters malformed glossary entries but keeps good ones", () => {
  const parsed = parseLetter({
    ...valid,
    schwierige_woerter: [
      { wort: "Frist", erklaerung: "Ein letzter Tag." },
      { wort: "kaputt" },
      "nur ein String",
      null,
    ],
  });
  assert.deepEqual(parsed?.schwierige_woerter, [{ wort: "Frist", erklaerung: "Ein letzter Tag." }]);
});

test("treats a non-true hilfe_empfohlen as false", () => {
  assert.equal(parseLetter({ ...valid, hilfe_empfohlen: "ja" })?.hilfe_empfohlen, false);
  assert.equal(parseLetter({ ...valid, hilfe_empfohlen: undefined })?.hilfe_empfohlen, false);
});

test("nulls out optional strings that arrive as the wrong type", () => {
  const parsed = parseLetter({ ...valid, absender: 12, aktion: {}, frist_text: [] });
  assert.equal(parsed?.absender, null);
  assert.equal(parsed?.aktion, null);
  assert.equal(parsed?.frist_text, null);
});
