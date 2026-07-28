# Setting up Papkram

Start to finish, roughly 30 minutes. Nothing here needs a domain — Papkram runs
on the free `*.vercel.app` URL Vercel gives you, and a custom domain can come later.

After every step there is a way to check it worked. Open **`/api/status`** on your
deployment at any point: it returns a checklist of what is and isn't configured.
It only ever reports yes/no — never a key, token or address.

---

## 1. Get an Anthropic API key

1. Go to <https://console.anthropic.com> and sign in.
2. **Settings → API keys → Create key.** Name it `papkram`.
3. Copy it now — the console shows it once.
4. **Add billing** under Settings → Billing. Without a payment method the key
   returns errors on the first real request.

Measured cost at the defaults (`claude-sonnet-5`, `effort: medium`):

| | |
|---|---|
| One-page letter | **~$0.032** |
| Three-page letter | ~$0.052 |
| One translation | ~$0.026 |

So **$20 of credit is roughly 600 letters**. Every request writes its real token
counts and a cost estimate to the logs (`"kind":"usage"`), so you never have to
guess — see *Watching what it costs* below.

## 2. Create the Vercel project

1. Go to <https://vercel.com/new> and import `hokanx/fpmc-platform`.
2. **This is the step people get wrong:** set **Root Directory** to `papkram`.
   Click *Edit* next to Root Directory and pick the `papkram` folder. If you skip
   this, Vercel builds the FPMC site instead.
3. Framework Preset should auto-detect as **Vite**. Leave the build and output
   settings alone — `papkram/vercel.json` already sets them.
4. Under **Environment Variables**, add:

   | Name | Value |
   |---|---|
   | `ANTHROPIC_API_KEY` | the key from step 1 |

5. **Deploy.**

**Check it worked:** open `https://<your-project>.vercel.app/api/status`. You want
`"runnable": true`. Then open the site, photograph any letter, and confirm you get
a summary back. This is also the first time the model has ever run for this app,
so look closely at whether the deadline and the amount are right.

## 3. Fill in the Impressum

Required by § 5 DDG before the site is publicly reachable. Operating a public
German site without one is *abmahnfähig* — a real and expensive risk.

In **Vercel → Settings → Environment Variables**, add:

| Name | Example |
|---|---|
| `IMPRESSUM_NAME` | `Hakan Muster` or the company/GbR name |
| `IMPRESSUM_STRASSE` | `Musterstraße 14` |
| `IMPRESSUM_ORT` | `51063 Köln` |
| `IMPRESSUM_EMAIL` | `kontakt@…` |

Optional: `IMPRESSUM_VERTRETEN` (representative), `IMPRESSUM_USTID` (VAT ID, only
if you have one), `IMPRESSUM_LAND` (defaults to `Deutschland`).

**Redeploy** after adding them — Vercel only picks up new variables on a new
deployment (Deployments → ⋯ → Redeploy).

> If you are unsure which legal entity should be named — you personally, or the
> FPMC GbR — that is worth 10 minutes with whoever handles your paperwork. The
> named entity carries liability for the site.

**Check it worked:** `/impressum` no longer shows the red warning box, and
`/api/status` reports `"publishable": true`.

## 4. Verify the help links

Open all five links in `papkram/src/lib/hilfe.ts` and confirm each still lands on
a page where someone can actually find free advice:

- Verbraucherzentrale — <https://www.verbraucherzentrale.de/beratung>
- Schuldnerberatung — <https://www.meine-schulden.de/schuldnerberatung-finden/>
- Sozialverband VdK — <https://www.vdk.de/deutschland/pages/beratung>
- BMG Bürgertelefon — <https://www.bundesgesundheitsministerium.de/service/buergertelefon>
- Deutscher Mieterbund — <https://www.mieterbund.de/mieterverein-vor-ort.html>

I could not check these from the build environment — its network policy blocks
those hosts. Deep links rot, and sending a worried person to a 404, or to a paid
service where free advice exists, is the most damaging thing this app can do.
Re-check them every few months.

## 5. Before you tell anyone about it

Everything above makes the site work. These make it survive other people using it.

### Real rate limiting (10 minutes, free)

Without this, the limit is counted per serverless instance and resets on cold
starts — it stops accidents, not anyone determined.

1. <https://upstash.com> → sign up → **Create Database** → Redis.
2. Pick a **region in Europe** (Frankfurt) to keep latency down and stay in the EU.
3. On the database page, copy **`UPSTASH_REDIS_REST_URL`** and
   **`UPSTASH_REDIS_REST_TOKEN`** from the *REST API* section.
4. Add both in Vercel, redeploy.

The free tier is far more than Papkram needs.

### Spend cap

`DAILY_REQUEST_CAP` counts **pages**, not letters, and defaults to **500** —
about **$16/day**. Adjust to taste:

| Value | Roughly |
|---|---|
| `100` | $3/day — sensible while testing |
| `500` | $16/day (default) |
| `2000` | $64/day |
| `0` | no cap — not recommended |

Also set a hard backstop in the Anthropic console under **Billing → Limits**. The
app's cap protects you from traffic; the console's cap protects you from the app.

### Watching what it costs

Every model call logs its real usage. In **Vercel → your project → Logs**, filter
for `usage`:

```json
{"kind":"usage","route":"vereinfachen","model":"claude-sonnet-5",
 "input_tokens":2888,"output_tokens":1170,"cache_read_tokens":3968,
 "est_usd":0.032,"pages":1,"level":"einfach"}
```

Counts only — never any part of a letter. `cache_read_tokens` above zero means
the system prompt is being cached, which is where a chunk of the saving comes
from. If `est_usd` starts climbing, the usual cause is `ANTHROPIC_EFFORT` or a
model change, not traffic.

**Two keys is a good habit:** make a second API key named `papkram-test` with a
low spend limit for local work, and keep the production key in Vercel only. Then a
runaway loop on your laptop can't touch the live budget.

### Error alerts (optional)

Set `ERROR_WEBHOOK_URL` to a Slack incoming webhook and you get a message when the
model starts failing. Without it, errors only land in Vercel's logs, which nobody
reads until someone complains. Reports contain a route name, an error code and
counts — never any part of a letter.

**Check it worked:** `/api/status` shows all `recommended` items as `ok`.

---

## A custom domain, when you want one

1. Buy the domain (`papkram.de` is the obvious one).
2. **Vercel → Settings → Domains → Add**, enter it.
3. Vercel shows the DNS records to create; add them at your registrar.
4. Wait for propagation — usually minutes, sometimes hours.

Nothing in the code needs changing.

---

## Running it on your own machine

```bash
cd papkram
npm install
cp .env.example .env      # put your ANTHROPIC_API_KEY in it
npm run dev               # http://localhost:5173
```

`npm run dev` also serves the `api/` functions, so the whole flow works locally
without the Vercel CLI.

```bash
npm test          # unit tests
npm run typecheck
npm run build
```

---

## If something is wrong

| What you see | Almost always |
|---|---|
| Vercel built the wrong site | Root Directory isn't set to `papkram` (step 2.2) |
| `Papkram ist gerade nicht bereit` | `ANTHROPIC_API_KEY` missing, or set but not redeployed |
| Errors on every letter | No billing on the Anthropic account |
| Red box on `/impressum` | `IMPRESSUM_*` variables missing, or added without redeploying |
| `Papkram ist für heute ausgelastet` | Daily cap hit — raise `DAILY_REQUEST_CAP` or wait for UTC midnight |
| Summaries miss things on real letters | Try `ANTHROPIC_MODEL=claude-opus-5` — ~3× the cost, better at dense Behördendeutsch |
| Env var changed but nothing happened | Vercel needs a redeploy to pick it up |

`/api/status` answers most of these directly.
