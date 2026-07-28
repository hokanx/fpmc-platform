import Anthropic from "@anthropic-ai/sdk";
import { ProviderError, type Provider } from "./provider";
import { LETTER_SCHEMA, parseLetter, type Letter, type Level, type Media, type OutLang } from "./schema";
import {
  systemPrompt,
  translateSystemPrompt,
  TRANSLATE_USER_PROMPT,
  USER_PROMPT,
} from "./prompts";

const DEFAULT_MODEL = "claude-opus-5";

/**
 * `max_tokens` caps thinking AND response text together, and thinking is on by
 * default on Opus 5 — so this needs real headroom above the ~1.5k tokens the
 * JSON itself costs. A letter that truncates mid-JSON is a total loss.
 */
const MAX_TOKENS = 8000;

type Effort = "low" | "medium" | "high" | "xhigh" | "max";

function effort(): Effort {
  const raw = process.env.ANTHROPIC_EFFORT;
  const allowed: Effort[] = ["low", "medium", "high", "xhigh", "max"];
  // Extraction + rewriting, not open-ended reasoning. Opus 5 is strong at the
  // low end of the ladder, and this task is latency-sensitive — someone is
  // standing in their hallway holding a letter.
  return allowed.includes(raw as Effort) ? (raw as Effort) : "medium";
}

function mediaBlock(media: Media): Anthropic.ContentBlockParam {
  if (media.media_type === "application/pdf") {
    return {
      type: "document",
      source: { type: "base64", media_type: "application/pdf", data: media.data },
    };
  }
  return {
    type: "image",
    source: {
      type: "base64",
      media_type: media.media_type as "image/jpeg" | "image/png" | "image/webp" | "image/gif",
      data: media.data,
    },
  };
}

/** Pulls the structured JSON out of the response, with the failure modes named. */
function extractLetter(message: Anthropic.Message): Letter {
  // Always before touching content: on a refusal `content` is empty or partial,
  // so indexing content[0] here would throw instead of showing a useful message.
  if (message.stop_reason === "refusal") {
    throw new ProviderError("refused", `refused: ${message.stop_details?.category ?? "unknown"}`);
  }
  if (message.stop_reason === "max_tokens") {
    throw new ProviderError("provider_failed", "response truncated at max_tokens");
  }

  const text = message.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("");

  if (!text.trim()) throw new ProviderError("provider_failed", "empty response");

  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch {
    throw new ProviderError("provider_failed", "response was not valid JSON");
  }

  const letter = parseLetter(raw);
  if (!letter) throw new ProviderError("provider_failed", "response did not match the schema");
  return letter;
}

function client(): Anthropic {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new ProviderError("not_configured", "ANTHROPIC_API_KEY is not set");
  return new Anthropic({ apiKey, maxRetries: 1 });
}

export function anthropicProvider(): Provider {
  const model = process.env.ANTHROPIC_MODEL || DEFAULT_MODEL;

  return {
    id: "anthropic",

    async simplify({ media, level }) {
      // Streaming here is not for the browser — the route still returns one JSON
      // response. It keeps the connection to the API alive so a slow letter
      // doesn't trip the SDK's HTTP timeout at this max_tokens.
      const stream = client().messages.stream({
        model,
        max_tokens: MAX_TOKENS,
        system: [
          {
            type: "text",
            text: systemPrompt(level),
            // Stable across every request at this level — worth caching, and
            // comfortably over Opus 5's 512-token minimum.
            cache_control: { type: "ephemeral" },
          },
        ],
        thinking: { type: "adaptive" },
        output_config: {
          effort: effort(),
          format: { type: "json_schema", schema: LETTER_SCHEMA as Record<string, unknown> },
        },
        messages: [
          { role: "user", content: [mediaBlock(media), { type: "text", text: USER_PROMPT }] },
        ],
      });

      return extractLetter(await stream.finalMessage());
    },

    async translate({ letter, target, level }) {
      const stream = client().messages.stream({
        model,
        max_tokens: MAX_TOKENS,
        system: [{ type: "text", text: translateSystemPrompt(target, level) }],
        thinking: { type: "adaptive" },
        output_config: {
          // Translation of already-simplified text needs far less deliberation
          // than reading a photographed letter.
          effort: "low",
          format: { type: "json_schema", schema: LETTER_SCHEMA as Record<string, unknown> },
        },
        messages: [
          { role: "user", content: TRANSLATE_USER_PROMPT(JSON.stringify(letter, null, 2)) },
        ],
      });

      const translated = extractLetter(await stream.finalMessage());

      // The model translates prose; it has no business changing the numbers.
      // Carry the machine-readable fields over from the German original.
      return {
        ...translated,
        art: letter.art,
        frist: letter.frist,
        betrag: letter.betrag,
        hilfe_empfohlen: letter.hilfe_empfohlen,
      } satisfies Letter;
    },
  };
}

/** Re-exported so routes can type their inputs without importing the SDK. */
export type { Level, OutLang };
