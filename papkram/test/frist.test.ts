import { assert, test } from "vitest";
import { formatBetrag, formatDate, fristInfo } from "../src/lib/frist";

/**
 * The deadline countdown is the one number in the app that Papkram computes
 * rather than reads. The model is explicitly told never to work out a date, so
 * if "Noch 5 Tage" is wrong, it is wrong here.
 *
 * A fixed "today" keeps these tests from breaking overnight.
 */
const HEUTE = new Date("2026-07-28T09:00:00Z");

test("counts whole calendar days, ignoring clock time", () => {
  // Late in the evening must not turn "tomorrow" into "today".
  const spaet = new Date("2026-07-28T23:59:00Z");
  assert.equal(fristInfo("2026-07-29", "de", spaet)?.tage, 1);
  assert.equal(fristInfo("2026-08-02", "de", HEUTE)?.tage, 5);
});

test("marks the day itself as heute", () => {
  const info = fristInfo("2026-07-28", "de", HEUTE);
  assert.equal(info?.status, "heute");
  assert.equal(info?.text, "Die Frist ist heute");
});

test("flags anything inside a fortnight as knapp", () => {
  assert.equal(fristInfo("2026-08-10", "de", HEUTE)?.status, "knapp"); // 13 days
  assert.equal(fristInfo("2026-08-11", "de", HEUTE)?.status, "offen"); // 14 days
});

test("reports an expired deadline in the past tense", () => {
  const gestern = fristInfo("2026-07-27", "de", HEUTE);
  assert.equal(gestern?.status, "abgelaufen");
  assert.equal(gestern?.text, "Die Frist war gestern");
  assert.equal(fristInfo("2026-07-20", "de", HEUTE)?.text, "Die Frist war vor 8 Tagen");
});

test("uses singular for one day", () => {
  assert.equal(fristInfo("2026-07-29", "de", HEUTE)?.text, "Noch 1 Tag");
  assert.equal(fristInfo("2026-07-30", "de", HEUTE)?.text, "Noch 2 Tage");
});

test("returns null rather than NaN for an unusable date", () => {
  assert.equal(fristInfo(null, "de", HEUTE), null);
  assert.equal(fristInfo("irgendwann", "de", HEUTE), null);
  assert.equal(fristInfo("28.07.2026", "de", HEUTE), null);
});

test("localises the countdown text", () => {
  assert.equal(fristInfo("2026-08-02", "en", HEUTE)?.text, "5 days left");
  assert.equal(fristInfo("2026-08-02", "tr", HEUTE)?.text, "5 gün kaldı");
  // Russian and Ukrainian avoid numeral agreement by construction.
  assert.equal(fristInfo("2026-08-02", "ru", HEUTE)?.text, "Осталось дней: 5");
  assert.equal(fristInfo("2026-08-02", "uk", HEUTE)?.text, "Залишилося днів: 5");
});

test("writes the date out in the reader's language", () => {
  assert.equal(formatDate("2026-08-15", "de"), "15. August 2026");
  assert.match(formatDate("2026-08-15", "en"), /15 August 2026/);
  // Never shifted by the local timezone — the date on the letter is the date shown.
  assert.equal(formatDate("2026-01-01", "de"), "1. Januar 2026");
});

test("formats amounts with the right currency and locale", () => {
  assert.match(formatBetrag(563, "EUR", "de"), /563/);
  assert.match(formatBetrag(563, "EUR", "de"), /€/);
  assert.match(formatBetrag(1234.5, "EUR", "de"), /1\.234,50/);
});

test("falls back to plain digits for an unknown currency code", () => {
  assert.equal(formatBetrag(20, "NOTACURRENCY", "de"), "20 NOTACURRENCY");
});
