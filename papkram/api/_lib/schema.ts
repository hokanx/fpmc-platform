/**
 * The contract between the model, the API routes and the UI.
 *
 * This file is imported by BOTH the serverless functions and the browser
 * bundle, so it must stay free of Node and DOM APIs — types and plain data only.
 */

/** How much the language is simplified. */
export type Level = "einfach" | "leicht";

export const LEVELS: readonly Level[] = ["einfach", "leicht"];

/** Languages the simplified summary can be translated into. */
export type OutLang = "de" | "en" | "tr" | "ar" | "uk" | "ru";

export const OUT_LANGS: readonly OutLang[] = ["de", "en", "tr", "ar", "uk", "ru"];

export const RTL_LANGS: readonly OutLang[] = ["ar"];

/** What kind of post this is. Drives which help organisations the UI offers. */
export type LetterKind =
  | "behoerde"
  | "versicherung"
  | "rechnung"
  | "mahnung"
  | "vertrag"
  | "medizin"
  | "sonstiges";

export type Betrag = {
  wert: number;
  waehrung: string;
  /** Does the reader pay this, or receive it? Getting this backwards is the worst failure mode. */
  richtung: "zahlen" | "erhalten";
};

export type SchweresWort = { wort: string; erklaerung: string };

/** The simplified letter. Every field is either read off the letter or null. */
export type Letter = {
  absender: string | null;
  art: LetterKind;
  /** One sentence: what this letter is about. */
  worum_geht_es: string;
  /** What the reader has to do, or null if nothing is required of them. */
  aktion: string | null;
  /** ISO date (YYYY-MM-DD). The UI computes days remaining from this. */
  frist: string | null;
  /** The deadline as the letter words it, e.g. "innerhalb von 4 Wochen nach Erhalt". */
  frist_text: string | null;
  betrag: Betrag | null;
  /** The summary, one sentence per item. Rendered one per line. */
  zusammenfassung: string[];
  schwierige_woerter: SchweresWort[];
  /** Anything the model could not read or is unsure about. Honesty beats confidence here. */
  unklar: string[];
  /** True when this letter has legal/financial consequences worth getting free advice on. */
  hilfe_empfohlen: boolean;
};

/** A `Letter` plus the server-stamped language it is written in. */
export type LetterResult = Letter & { sprache: OutLang };

// --- Request/response shapes ------------------------------------------------

export type Media = {
  /** "image/jpeg" | "image/png" | "image/webp" | "image/gif" | "application/pdf" */
  media_type: string;
  /** Base64, no data: prefix, no newlines. */
  data: string;
};

export type SimplifyRequest = { media: Media; level: Level };
export type TranslateRequest = { letter: Letter; target: OutLang; level: Level };

export type ApiError = {
  /** Machine-readable. The UI maps this to a plain-German message. */
  error:
    | "method_not_allowed"
    | "bad_json"
    | "bad_request"
    | "too_large"
    | "unsupported_media"
    | "rate_limited"
    | "not_configured"
    | "refused"
    | "no_letter_found"
    | "provider_failed";
  retry_after?: number;
};

export const SUPPORTED_MEDIA = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "application/pdf",
] as const;

/** Hard ceiling on the decoded upload. Matched by the client before it even tries. */
export const MAX_MEDIA_BYTES = 8 * 1024 * 1024;

// --- JSON schema for structured output --------------------------------------

const nullable = (schema: Record<string, unknown>) => ({
  anyOf: [schema, { type: "null" }],
});

/**
 * Constrains the model's response. Structured outputs mean the action box can
 * trust its fields: the model cannot return prose where a date belongs, and it
 * cannot silently omit `frist`.
 *
 * Only constructs the API supports are used here — no minLength/maximum, no
 * recursion, `additionalProperties: false` and a full `required` on every object.
 */
export const LETTER_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: [
    "absender",
    "art",
    "worum_geht_es",
    "aktion",
    "frist",
    "frist_text",
    "betrag",
    "zusammenfassung",
    "schwierige_woerter",
    "unklar",
    "hilfe_empfohlen",
  ],
  properties: {
    absender: nullable({
      type: "string",
      description: "Wer den Brief geschickt hat, z. B. 'Jobcenter Köln'. null, wenn unklar.",
    }),
    art: {
      type: "string",
      enum: ["behoerde", "versicherung", "rechnung", "mahnung", "vertrag", "medizin", "sonstiges"],
      description: "Art des Schreibens.",
    },
    worum_geht_es: {
      type: "string",
      description: "Ein einziger kurzer Satz: worum es in dem Brief geht.",
    },
    aktion: nullable({
      type: "string",
      description:
        "Was die Person tun muss, in einem Satz. null, wenn der Brief keine Handlung verlangt.",
    }),
    frist: nullable({
      type: "string",
      format: "date",
      description:
        "Das Datum der Frist als YYYY-MM-DD, nur wenn im Brief ein konkretes Datum steht. Niemals raten oder rechnen.",
    }),
    frist_text: nullable({
      type: "string",
      description:
        "Die Frist so, wie sie im Brief formuliert ist, z. B. 'innerhalb von 4 Wochen nach Erhalt'.",
    }),
    betrag: nullable({
      type: "object",
      additionalProperties: false,
      required: ["wert", "waehrung", "richtung"],
      properties: {
        wert: { type: "number" },
        waehrung: { type: "string", description: "ISO-Code, meist 'EUR'." },
        richtung: {
          type: "string",
          enum: ["zahlen", "erhalten"],
          description: "'zahlen' = die Person muss zahlen. 'erhalten' = die Person bekommt Geld.",
        },
      },
    }),
    zusammenfassung: {
      type: "array",
      items: { type: "string" },
      description: "Die Zusammenfassung. Ein Satz pro Eintrag.",
    },
    schwierige_woerter: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["wort", "erklaerung"],
        properties: {
          wort: { type: "string" },
          erklaerung: { type: "string" },
        },
      },
      description: "Schwere Wörter aus dem Brief, jeweils in einem einfachen Satz erklärt.",
    },
    unklar: {
      type: "array",
      items: { type: "string" },
      description:
        "Was nicht lesbar war oder unsicher ist. Lieber hier eintragen als im Text raten.",
    },
    hilfe_empfohlen: {
      type: "boolean",
      description:
        "true, wenn es um Geld, Fristen, Kündigung, Mahnung oder Widerspruch geht — also kostenlose Beratung sinnvoll ist.",
    },
  },
} as const;

// --- Runtime validation -----------------------------------------------------

const isStringArray = (v: unknown): v is string[] =>
  Array.isArray(v) && v.every((x) => typeof x === "string");

/**
 * Structured outputs make a malformed response very unlikely, but "very
 * unlikely" is not "impossible" — and a bad `betrag.richtung` would tell someone
 * they owe money when they are owed it. Everything the action box shows gets
 * checked before it leaves the server.
 */
export function parseLetter(value: unknown): Letter | null {
  if (typeof value !== "object" || value === null) return null;
  const v = value as Record<string, unknown>;

  const kinds: LetterKind[] = [
    "behoerde",
    "versicherung",
    "rechnung",
    "mahnung",
    "vertrag",
    "medizin",
    "sonstiges",
  ];

  if (typeof v.worum_geht_es !== "string" || v.worum_geht_es.trim() === "") return null;
  if (!kinds.includes(v.art as LetterKind)) return null;
  if (!isStringArray(v.zusammenfassung) || v.zusammenfassung.length === 0) return null;
  if (!isStringArray(v.unklar)) return null;

  const absender = typeof v.absender === "string" ? v.absender : null;
  const aktion = typeof v.aktion === "string" ? v.aktion : null;
  const frist_text = typeof v.frist_text === "string" ? v.frist_text : null;

  // A deadline the UI can't parse is worse than no deadline — it would render
  // "Noch NaN Tage". Anything that isn't a real calendar date is dropped.
  const frist =
    typeof v.frist === "string" && /^\d{4}-\d{2}-\d{2}$/.test(v.frist) && !isNaN(Date.parse(v.frist))
      ? v.frist
      : null;

  let betrag: Betrag | null = null;
  if (typeof v.betrag === "object" && v.betrag !== null) {
    const b = v.betrag as Record<string, unknown>;
    if (
      typeof b.wert === "number" &&
      isFinite(b.wert) &&
      typeof b.waehrung === "string" &&
      (b.richtung === "zahlen" || b.richtung === "erhalten")
    ) {
      betrag = { wert: b.wert, waehrung: b.waehrung, richtung: b.richtung };
    }
  }

  const schwierige_woerter: SchweresWort[] = Array.isArray(v.schwierige_woerter)
    ? v.schwierige_woerter.flatMap((w) => {
        if (typeof w !== "object" || w === null) return [];
        const e = w as Record<string, unknown>;
        return typeof e.wort === "string" && typeof e.erklaerung === "string"
          ? [{ wort: e.wort, erklaerung: e.erklaerung }]
          : [];
      })
    : [];

  return {
    absender,
    art: v.art as LetterKind,
    worum_geht_es: v.worum_geht_es,
    aktion,
    frist,
    frist_text,
    betrag,
    zusammenfassung: v.zusammenfassung,
    schwierige_woerter,
    unklar: v.unklar,
    hilfe_empfohlen: v.hilfe_empfohlen === true,
  };
}
