import Anthropic from "@anthropic-ai/sdk";
import { ProviderError, type Provider } from "./provider";
import { reportUsage } from "./report";
import { LETTER_SCHEMA, parseLetter, type Letter, type Level, type Media, type OutLang } from "./schema";
import {
  pageLabel,
  systemPrompt,
  translateSystemPrompt,
  TRANSLATE_USER_PROMPT,
  userPrompt,
} from "./prompts";

const DEFAULT_MODEL = "claude-sonnet-5";

/**
 * `max_tokens` caps thinking AND response text together, and adaptive thinking
 * is on by default — so this needs real headroom above the ~1.5k tokens the JSON
 * itself costs. A letter that truncates mid-JSON is a total loss, and the cap
 * costs nothing unless it is actually used.
 */
const MAX_TOKENS = 12000;

type Effort = "low" | "medium" | "high" | "xhigh" | "max";

function effort(): Effort {
  const raw = process.env.ANTHROPIC_EFFORT;
  const allowed: Effort[] = ["low", "medium", "high", "xhigh", "max"];
  // Measured, not assumed. Three runs each against the Bewilligungsbescheid
  // fixture (clean scan and phone photo):
  //
  //   low     11s   $0.029/letter   Frist, Betrag, Aktion all correct
  //   medium  13s   $0.032/letter   all correct
  //   high    22s   $0.044/letter   all correct
  //
  // `high` bought nothing here while costing 50% more and taking twice as long,
  // and latency is not a footnote when someone is standing in their hallway
  // holding the letter. `medium` rather than `low` keeps a step of headroom for
  // the cases the fixture doesn't cover — faded thermal paper, cramped Inkasso
  // letters, handwriting — since one fixture is thin evidence for going lower.
  // Re-run the comparison against real letters before changing this again.
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

    async simplify({ pages, level }) {
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
            // Stable across every request at this level, so worth caching.
            // Caveat: this prompt is ~1.1k tokens and Sonnet 5's minimum
            // cacheable prefix is 1024 — comfortable on Opus 5 (512), marginal
            // here. Below the minimum it silently does not cache rather than
            // erroring, so confirm with messages.count_tokens() once a key is in
            // place, and watch usage.cache_read_input_tokens on the second
            // request of a burst.
            cache_control: { type: "ephemeral" },
          },
        ],
        thinking: { type: "adaptive" },
        output_config: {
          effort: effort(),
          format: { type: "json_schema", schema: LETTER_SCHEMA as Record<string, unknown> },
        },
        messages: [
          {
            role: "user",
            content: [
              // Each page is labelled in text immediately before its image, so
              // page order is stated rather than inferred. Without this the
              // model has to guess which scan came first, and on a Bescheid the
              // Frist is often on a later page.
              ...pages.flatMap((page, i): Anthropic.ContentBlockParam[] => [
                { type: "text", text: pageLabel(i, pages.length) },
                mediaBlock(page),
              ]),
              { type: "text", text: userPrompt(pages.length) },
            ],
          },
        ],
      });

      const message = await stream.finalMessage();
      reportUsage("vereinfachen", model, message.usage, { pages: pages.length, level });
      return extractLetter(message);
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

      const message = await stream.finalMessage();
      reportUsage("uebersetzen", model, message.usage, { target });
      const translated = extractLetter(message);

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
