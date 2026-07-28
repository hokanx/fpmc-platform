# Papkram

**Schwerer Brief? Foto machen. Papkram erklärt ihn.**

A German counterpart to [leessimpel.nl](https://www.leessimpel.nl/): photograph an official
letter and get back what it says in plain German — plus what you have to do, and by when.
Free, no account, nothing stored.

It exists because the LEO-Studie counts roughly **6.2 million** German adults who struggle with
reading, and Behördendeutsch is not written for them.

> This app is completely separate from the FPMC storefront in the repository root. It has its own
> `package.json`, its own build and its own Vercel project. Nothing outside `papkram/` is touched,
> and the root `tsconfig.app.json` only includes `src/`, so the FPMC build never sees this folder.

## What it does

1. **Photos or a PDF in.** Camera capture on a phone, file picker everywhere else. Up to
   **12 pages** — a German Bescheid routinely runs to six, and the Frist is as often on page four
   as page one.
2. **Optional redaction.** Drag black boxes over your name and address — or tap *Adress·feld
   abdecken*, which covers the DIN 5008 address window in one go. The boxes are burned into the
   pixels before upload, so what leaves the device is a flattened image.
3. **Plain German out**, at one of two levels:
   - **Einfache Sprache** (~B1) — short main clauses, active voice, no Amtsdeutsch.
   - **Leichte Sprache** (DIN SPEC 33429) — one statement per sentence, no Konjunktiv, compound
     words split with a Mediopunkt (`Kranken·kasse`).
4. **An action box** above the summary: sender, what you have to do, the deadline with a day
   countdown, and the amount with its direction (pay vs. receive).
5. **Translation** of the summary into English, Turkish, Arabic, Ukrainian or Russian, on demand.
6. **Keep a copy** — print (which is "save as PDF" in every print dialogue), copy the text, or use
   the system share sheet. All on the device; nothing is uploaded and no account exists.

## Running it

```bash
npm install
cp .env.example .env      # add ANTHROPIC_API_KEY
npm run dev               # http://localhost:5173
```

`npm run dev` serves `api/*.ts` from the Vite dev server (see the `apiDev` plugin in
`vite.config.ts`), so the full flow works locally without the Vercel CLI.

```bash
npm test         # unit tests (vitest)
npm run typecheck
npm run build
```

## Deploying

**Step-by-step instructions are in [SETUP.md](./SETUP.md).** The short version:

A separate Vercel project with **Root Directory = `papkram`**. It works on the Vercel-provided
`*.vercel.app` URL; a custom domain is optional. Open **`/api/status`** on the deployment for a
live checklist of what is and isn't configured — it reports yes/no only, never a value.

**To run at all**

| Variable | |
|---|---|
| `ANTHROPIC_API_KEY` | The only hard requirement. |

**Before it is publicly reachable**

| Variable | |
|---|---|
| `IMPRESSUM_NAME`, `IMPRESSUM_STRASSE`, `IMPRESSUM_ORT`, `IMPRESSUM_EMAIL` | Required by § 5 DDG. `/impressum` shows a visible warning naming the missing variables until all four are set. |

**Before real traffic**

| Variable | |
|---|---|
| `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` | Without these, rate limiting is per serverless instance and resets on cold starts — a speed bump, not a control. |
| `DAILY_REQUEST_CAP` | Spend guard; defaults to 2000/day (~$20 at the Sonnet 5 default). |
| `ERROR_WEBHOOK_URL` | Optional. Errors otherwise go to stderr, which Vercel collects. |

Also verify the five help-organisation links in `src/lib/hilfe.ts` — see *Known gaps*.

Full list with commentary: `.env.example`.

## How it is put together

```
api/                    Vercel serverless functions
  vereinfachen.ts       image/PDF → structured plain German
  uebersetzen.ts        summary → another language (text only, no vision)
  info.ts               which provider is live, read by /datenschutz
  _lib/
    schema.ts           the contract: types, JSON schema, parseLetter()
    prompts.ts          the system prompts — the actual product
    provider.ts         Provider interface + AI_PROVIDER selection
    anthropic.ts        Claude implementation (default)
    mistral.ts          Mistral EU implementation
    ratelimit.ts        per-IP token bucket
src/
  pages/Start.tsx       the whole letter flow, as one state machine
  components/           ActionBox, Summary, Redact, Capture, …
  lib/media.ts          downscale, redact, encode
  lib/frist.ts          deadline arithmetic
  i18n/labels.ts        UI chrome in all six languages
```

### Decisions worth knowing before you change something

**Swapping the AI provider is an env var, not a rewrite.** `AI_PROVIDER=mistral` moves processing
into the EU. Both implementations satisfy the same `Provider` interface and return the same
`Letter`, so no UI or route code knows which ran. `/datenschutz` reads the live value from
`/api/info` rather than hard-coding a name, so the privacy page cannot drift from reality.

**The model never does arithmetic.** It is told to read a deadline off the page and never to
compute one — "within 4 weeks" goes into `frist_text`, and `frist` stays null. The day countdown
is computed in `lib/frist.ts`, where it can be unit-tested instead of hallucinated.

**`parseLetter()` re-validates everything the action box shows.** Structured outputs make a
malformed response unlikely, not impossible, and the failure modes are expensive: a wrong
`betrag.richtung` would tell someone they owe money when they are owed it. Anything that does not
validate is dropped rather than displayed.

**Help organisations are hand-curated** in `lib/hilfe.ts`, keyed by letter type. The model only
decides *whether* to offer help, never which number to call — a hallucinated advice line sends a
worried person to a dead end.

**Nothing is stored.** No database, no request-body logging, and `sw.js` skips `/api/` entirely so
no letter can land in the Cache API. The flow lives in component state on one route precisely so
there is nowhere for a letter to persist.

**Accessibility is load-bearing, not a pass at the end.** Atkinson Hyperlegible, an 18px floor,
56px touch targets, AAA body contrast, and no all-caps labels (they slow down exactly the readers
this is for). Colour never carries meaning alone — an urgent deadline is red *and* says
"Noch 3 Tage".

## Measured behaviour

From live runs against `test/fixtures/bescheid.png` (a Jobcenter Bewilligungsbescheid) and
`bescheid-foto.jpg` (the same letter as a realistic phone photo), on `claude-sonnet-5` at
`effort: high`:

| | |
|---|---|
| Extraction accuracy | Absender, Frist (`2026-08-21`), Betrag (563 EUR, `erhalten`) and the required action correct on every run, identically from the clean scan and the phone photo — and at every effort level. |
| Cost | ~$0.032 per one-page letter, ~$0.052 for three pages, ~$0.026 per translation. Output tokens dominate, so effort matters more than page count. |
| Latency | ~13 s for one page; ~4 s to reject a non-letter. |
| Effort | `low` / `medium` / `high` were equally accurate here; `high` cost 50% more and took twice as long, so the default is `medium`. |
| Einfache Sprache | ~11 words/sentence. |
| Leichte Sprache | ~8.5 words/sentence, Mediopunkte applied consistently. |
| Multi-page | Two pages produce one summary, not two. It also spotted a duplicated page unprompted and reported it in `unklar`. |
| Honesty | Correctly reported that the fixture cuts off the Rechtsbehelfsbelehrung rather than inventing its contents. |
| Advice boundary | Held on every run — describes what the letter says, never what to do about it. |

Known soft spot: roughly one run in three contains a single sentence over the stated length cap
(16–19 words). Averages are well within range; it's the tail that drifts.

## Known gaps

- **The help-organisation links are unverified.** The build environment's network policy blocked
  those hosts. Open all five in `src/lib/hilfe.ts` before launch — sending a worried person to a
  404, or to a paid service where free advice exists, is the worst thing this app could do.
- **Read-aloud is not built.** `zusammenfassung` is an array of sentences specifically so a
  `SpeechSynthesis` control is a drop-in later, at no API cost. It is probably the largest
  remaining gap for the actual audience.
- **The Mistral path is unexercised.** Written against the SDK's verified wire types, never run
  against the live API. Smoke-test before trusting `AI_PROVIDER=mistral`.
- **PDF input is untested** end to end. The code path exists on both providers.

## Limits worth knowing

| | |
|---|---|
| Pages per letter | 12 |
| Total upload | 3 MB of image, ~4.1 MB of JSON |
| Why | Vercel caps serverless request bodies at 4.5 MB. `media.encodeAll()` steps quality down (0.8 → 0.55) across the whole letter to fit rather than failing the upload. Measured: 12 realistic phone photos land at 2.95 MB. |
| Per-IP rate limit | 20 units/hour, one unit per page |
| Daily cap | 2000 units |

## Test fixtures

`test/fixtures/make-letter.py` renders a realistic Jobcenter Bewilligungsbescheid (DIN 5008
layout, passive voice, a Rechtsbehelfsbelehrung, a deadline stated two ways) so the flow can be
exercised without putting a real letter — and real personal data — in the repository.

```bash
pip install Pillow
python3 test/fixtures/make-letter.py
python3 tools/make-icons.py       # regenerate the PWA icons
```
