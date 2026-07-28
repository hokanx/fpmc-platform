import { ProviderError, type Provider } from "./provider";
import { LETTER_SCHEMA, parseLetter, type Letter, type Media } from "./schema";
import {
  pageLabel,
  systemPrompt,
  translateSystemPrompt,
  TRANSLATE_USER_PROMPT,
  userPrompt,
} from "./prompts";

/**
 * Mistral — the EU-data-residency alternative to the Anthropic path.
 *
 * Plain `fetch` rather than @mistralai/mistralai: the SDK pulls in zod and a
 * large runtime for what is one POST, and function cold-start time is user-
 * visible here. The field names below are the SDK's `$Outbound` wire types
 * (jsonschema.d.ts, imageurlchunk.d.ts, documenturlchunk.d.ts), not guesses.
 *
 * Caveat worth knowing before you flip AI_PROVIDER: this path has been written
 * against those verified shapes but not exercised against the live API — there
 * is no Mistral key in this environment. Expect to smoke-test it once before
 * trusting it in production.
 */

const ENDPOINT = "https://api.mistral.ai/v1/chat/completions";
const DEFAULT_MODEL = "mistral-medium-latest";

type MistralContent =
  | { type: "text"; text: string }
  | { type: "image_url"; image_url: string }
  | { type: "document_url"; document_url: string };

type MistralResponse = {
  choices?: { message?: { content?: string | null } }[];
};

function apiKey(): string {
  const key = process.env.MISTRAL_API_KEY;
  if (!key) throw new ProviderError("not_configured", "MISTRAL_API_KEY is not set");
  return key;
}

function mediaChunk(media: Media): MistralContent {
  const dataUrl = `data:${media.media_type};base64,${media.data}`;
  return media.media_type === "application/pdf"
    ? { type: "document_url", document_url: dataUrl }
    : { type: "image_url", image_url: dataUrl };
}

async function complete(system: string, userContent: string | MistralContent[]): Promise<Letter> {
  let res: Response;
  try {
    res = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        authorization: `Bearer ${apiKey()}`,
        "content-type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify({
        model: process.env.MISTRAL_MODEL || DEFAULT_MODEL,
        messages: [
          { role: "system", content: system },
          { role: "user", content: userContent },
        ],
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "brief",
            schema: LETTER_SCHEMA,
            // Left off deliberately. Strict mode follows the OpenAI subset,
            // which drops `format: "date"` and can reject the `anyOf` nullables
            // this schema uses. parseLetter() re-validates everything that
            // matters anyway, so a lenient schema plus a strict parser is the
            // more robust combination here.
            strict: false,
          },
        },
      }),
    });
  } catch (err) {
    throw new ProviderError("provider_failed", `network error: ${(err as Error).message}`);
  }

  if (!res.ok) {
    // Status only — the body could echo parts of the letter back into a log.
    throw new ProviderError("provider_failed", `mistral returned ${res.status}`);
  }

  let body: MistralResponse;
  try {
    body = (await res.json()) as MistralResponse;
  } catch {
    throw new ProviderError("provider_failed", "response was not valid JSON");
  }

  const text = body.choices?.[0]?.message?.content;
  if (!text?.trim()) throw new ProviderError("provider_failed", "empty response");

  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch {
    throw new ProviderError("provider_failed", "model output was not valid JSON");
  }

  const letter = parseLetter(raw);
  if (!letter) throw new ProviderError("provider_failed", "response did not match the schema");
  return letter;
}

export function mistralProvider(): Provider {
  return {
    id: "mistral",

    simplify: ({ pages, level }) =>
      complete(systemPrompt(level), [
        // Same page-labelling as the Anthropic path: order is stated, not inferred.
        ...pages.flatMap((page, i): MistralContent[] => [
          { type: "text", text: pageLabel(i, pages.length) },
          mediaChunk(page),
        ]),
        { type: "text", text: userPrompt(pages.length) },
      ]),

    async translate({ letter, target, level }) {
      const translated = await complete(
        translateSystemPrompt(target, level),
        TRANSLATE_USER_PROMPT(JSON.stringify(letter, null, 2)),
      );

      // Same rule as the Anthropic path: translation may rewrite prose, never numbers.
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
