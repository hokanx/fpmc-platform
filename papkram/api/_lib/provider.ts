import type { ApiError, Letter, Level, Media, OutLang } from "./schema";

/**
 * One interface, two implementations.
 *
 * The whole point is that `AI_PROVIDER` decides where a letter is processed —
 * Anthropic (US, under a DPA) or Mistral (EU end-to-end) — without a single
 * line of UI or route code knowing which one ran. That keeps the GDPR posture a
 * deployment decision rather than a rewrite.
 */
export interface Provider {
  /** Human-readable name, shown on /datenschutz so the page can't drift from the code. */
  readonly id: "anthropic" | "mistral";
  /** `pages` is one letter in page order — a single photo is a one-page letter. */
  simplify(input: { pages: Media[]; level: Level }): Promise<Letter>;
  translate(input: { letter: Letter; target: OutLang; level: Level }): Promise<Letter>;
}

/** Thrown by providers; routes turn it into an ApiError the UI can render in plain German. */
export class ProviderError extends Error {
  constructor(
    readonly code: ApiError["error"],
    message: string,
  ) {
    super(message);
    this.name = "ProviderError";
  }
}

export function providerId(): "anthropic" | "mistral" {
  return process.env.AI_PROVIDER === "mistral" ? "mistral" : "anthropic";
}

export async function getProvider(): Promise<Provider> {
  if (providerId() === "mistral") {
    const { mistralProvider } = await import("./mistral");
    return mistralProvider();
  }
  const { anthropicProvider } = await import("./anthropic");
  return anthropicProvider();
}
