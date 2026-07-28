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

1. **Photo or PDF in.** Camera capture on a phone, file picker everywhere else.
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

A separate Vercel project with **Root Directory = `papkram`**. Required environment variable:
`ANTHROPIC_API_KEY`. Everything else has a working default — see `.env.example`.

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

## Known gaps

- **Read-aloud is not built.** `zusammenfassung` is an array of sentences specifically so a
  `SpeechSynthesis` control is a drop-in later, at no API cost.
- **The Mistral path is unexercised.** It is written against the SDK's verified wire types but has
  never run against the live API. Smoke-test it before trusting `AI_PROVIDER=mistral`.
- **The rate limiter is per serverless instance.** It stops accidental abuse, not a determined
  attacker. Upstash Redis if that ever matters.
- **`src/pages/Impressum.tsx` is a placeholder** and must be filled in before launch.

## Test fixtures

`test/fixtures/make-letter.py` renders a realistic Jobcenter Bewilligungsbescheid (DIN 5008
layout, passive voice, a Rechtsbehelfsbelehrung, a deadline stated two ways) so the flow can be
exercised without putting a real letter — and real personal data — in the repository.

```bash
pip install Pillow
python3 test/fixtures/make-letter.py
python3 tools/make-icons.py       # regenerate the PWA icons
```
