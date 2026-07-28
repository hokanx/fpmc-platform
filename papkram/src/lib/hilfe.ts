import type { LetterKind } from "../../api/_lib/schema";

/**
 * Free help, curated by hand.
 *
 * Deliberately NOT model-generated. A hallucinated phone number or a made-up
 * advice centre sends a worried person to a dead end — or to someone charging
 * them for free advice. The model only decides *whether* help is worth
 * offering (`hilfe_empfohlen`); which organisation appears is fixed here.
 *
 * These are national umbrella entry points, so they stay correct without asking
 * for a postcode. Keep the list short — a wall of links helps nobody.
 *
 * ⚠️ UNVERIFIED. The build environment's network policy blocks these hosts, so
 * none of the five URLs below has been fetched. Deep links rot. Open every one
 * of them before launch, and re-check periodically — sending a worried person
 * to a 404, or worse to a paid service where free advice exists, is the most
 * damaging thing this file can do.
 */
export type Hilfe = {
  name: string;
  was: string;
  url: string;
};

const VERBRAUCHERZENTRALE: Hilfe = {
  name: "Verbraucher·zentrale",
  was: "Hilft bei Verträgen, Rechnungen und Abzocke. Erste Auskunft oft kostenlos.",
  url: "https://www.verbraucherzentrale.de/beratung",
};

const SCHULDNERBERATUNG: Hilfe = {
  name: "Schuldner·beratung",
  was: "Kostenlose Beratung, wenn Sie Schulden haben oder Mahnungen bekommen.",
  url: "https://www.meine-schulden.de/schuldnerberatung-finden/",
};

const SOZIALVERBAND: Hilfe = {
  name: "Sozial·verband VdK",
  was: "Hilft bei Bescheiden vom Amt, bei Rente und bei Widerspruch.",
  url: "https://www.vdk.de/deutschland/pages/beratung",
};

const UNABHAENGIGE_PATIENTENBERATUNG: Hilfe = {
  name: "Bundes·ministerium für Gesundheit",
  was: "Bürger·telefon zu Kranken·versicherung und Pflege.",
  url: "https://www.bundesgesundheitsministerium.de/service/buergertelefon",
};

const MIETERBUND: Hilfe = {
  name: "Deutscher Mieter·bund",
  was: "Berät zu Miete, Neben·kosten und Kündigung der Wohnung.",
  url: "https://www.mieterbund.de/mieterverein-vor-ort.html",
};

const BY_KIND: Record<LetterKind, Hilfe[]> = {
  behoerde: [SOZIALVERBAND, VERBRAUCHERZENTRALE],
  versicherung: [UNABHAENGIGE_PATIENTENBERATUNG, VERBRAUCHERZENTRALE],
  rechnung: [VERBRAUCHERZENTRALE, SCHULDNERBERATUNG],
  mahnung: [SCHULDNERBERATUNG, VERBRAUCHERZENTRALE],
  vertrag: [VERBRAUCHERZENTRALE, MIETERBUND],
  medizin: [UNABHAENGIGE_PATIENTENBERATUNG],
  sonstiges: [VERBRAUCHERZENTRALE],
};

export function hilfeFor(art: LetterKind): Hilfe[] {
  return BY_KIND[art] ?? BY_KIND.sonstiges;
}
