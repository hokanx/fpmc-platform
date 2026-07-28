import type {
  ApiError,
  Letter,
  LetterResult,
  Level,
  Media,
  OutLang,
} from "../../api/_lib/schema";

/**
 * Every failure the user can hit, phrased the way the rest of the app is
 * phrased. An error screen is the worst place to fall back into system-speak —
 * someone already confused by a letter should not then be confused by us.
 */
const MESSAGES: Record<ApiError["error"] | "network" | "unknown", string> = {
  method_not_allowed: "Da ist etwas schief gelaufen. Bitte versuchen Sie es noch einmal.",
  bad_json: "Da ist etwas schief gelaufen. Bitte versuchen Sie es noch einmal.",
  bad_request: "Mit dem Bild stimmt etwas nicht. Bitte machen Sie ein neues Foto.",
  too_large: "Die Fotos sind zusammen zu groß. Bitte schicken Sie weniger Seiten auf einmal.",
  unsupported_media: "Diese Datei können wir nicht lesen. Nutzen Sie ein Foto oder eine PDF-Datei.",
  rate_limited: "Sie haben gerade viele Briefe geschickt. Bitte warten Sie kurz.",
  daily_cap: "Papkram ist für heute ausgelastet. Bitte versuchen Sie es morgen wieder.",
  not_configured: "Papkram ist gerade nicht bereit. Bitte versuchen Sie es später.",
  refused: "Diesen Brief können wir nicht zusammenfassen.",
  no_letter_found: "Auf dem Bild ist kein Brief zu erkennen. Bitte machen Sie ein neues Foto.",
  too_many_pages: "Das sind zu viele Seiten. Bitte schicken Sie weniger Seiten auf einmal.",
  provider_failed: "Wir konnten den Brief gerade nicht lesen. Bitte versuchen Sie es noch einmal.",
  network: "Keine Verbindung. Bitte prüfen Sie Ihr Internet.",
  unknown: "Wir konnten den Brief gerade nicht lesen. Bitte versuchen Sie es noch einmal.",
};

export class ApiFailure extends Error {
  constructor(
    readonly code: keyof typeof MESSAGES,
    /** Seconds to wait, when the server sent one. */
    readonly retryAfter?: number,
  ) {
    super(MESSAGES[code]);
    this.name = "ApiFailure";
  }

  get userMessage(): string {
    if (this.code === "rate_limited" && this.retryAfter) {
      const minutes = Math.ceil(this.retryAfter / 60);
      return `Sie haben gerade viele Briefe geschickt. Bitte warten Sie ${minutes} Minuten.`;
    }
    return MESSAGES[this.code];
  }
}

async function post<T>(path: string, body: unknown, signal?: AbortSignal): Promise<T> {
  let res: Response;
  try {
    res = await fetch(path, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
      signal,
    });
  } catch (err) {
    if ((err as Error).name === "AbortError") throw err;
    throw new ApiFailure("network");
  }

  let payload: unknown;
  try {
    payload = await res.json();
  } catch {
    throw new ApiFailure(res.ok ? "unknown" : "provider_failed");
  }

  if (!res.ok) {
    const err = payload as Partial<ApiError>;
    const code = (err.error ?? "unknown") as keyof typeof MESSAGES;
    throw new ApiFailure(code in MESSAGES ? code : "unknown", err.retry_after);
  }

  return payload as T;
}

export function vereinfachen(
  pages: Media[],
  level: Level,
  signal?: AbortSignal,
): Promise<LetterResult> {
  return post<LetterResult>("/api/vereinfachen", { pages, level }, signal);
}

export function uebersetzen(
  letter: Letter,
  target: OutLang,
  level: Level,
  signal?: AbortSignal,
): Promise<LetterResult> {
  return post<LetterResult>("/api/uebersetzen", { letter, target, level }, signal);
}
