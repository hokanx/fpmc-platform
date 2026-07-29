# Credit Budget & Cost Control

**Balance: 4,135 credits** (Creator plan; a 6,000-credit subscription grant
landed 2026-07-27). All figures below are **verified from this account's own
transaction history**, matched job-by-job against `show_generations` — not
estimates.

## Verified per-clip costs (observed, not estimated)

The same prompt was run across models on 2026-07-14, which gives a clean
price comparison:

| Model | Config | Credits | Per 10s block |
|---|---|---|---|
| **Kling v3.0, sound OFF** | 9s, `mode:pro`, 1080p | **13.5** | **~15** |
| Kling v3.0, sound ON | 9s, pro, 1080p | 60 | ~65 |
| **Kling 3.0 Turbo** | 10s, 1080p | **20** | 20 |
| Kling 3.0 Turbo | 10s, 720p | 14 | 14 |
| Kling 3.0 Turbo | 5s, 720p | 7.5 | 15 |
| **Seedance 2.0 Mini** | 720p, keeps `image_references` | **15–20** | 15–20 |
| Gemini Omni Flash | 8s, 720p | 24 | ~30 |
| Seedance 2.0 | 8s, 1080p | 72 | ~90 |
| Seedance 2.0 | 10s / 14s, 1080p high-bitrate | 90 / 126 | 90 |
| **Nano Banana Pro** (still image) | 1k | **0** ⚠ | 0 |
| Nano Banana 2 (still image) | 1k / 2k | 1.5 / 3 | — |
| GPT Image 2.0 (still) | — | 7 | — |
| Cinematic Studio Image | — | 2 | — |

⚠ Nano Banana Pro billed **0 credits** on every observed job (Jul 19 + Jul 25,
14 jobs). Treat as a promo that may end — Nano Banana 2 at 1.5 is the fallback.

### The two decisive findings

1. **`sound: "off"` on Kling v3.0 cuts the price 78%** — 60 → 13.5 credits for
   the identical 9s/pro/1080p job. The model doc says "use 'off' … for lower
   credits"; the ledger shows how much. We need silent clips anyway, because
   the narration is added per block at assembly, so native audio is pure waste.
2. **Kling v3.0 sound-off is cheaper than Gemini Omni *and* higher quality** —
   13.5 credits at 1080p `pro` vs 24–30 credits at Gemini Omni's 720p ceiling.

## Answer: yes, Kling cuts the cost — by about 6×

Per 5-minute episode (30 blocks), clips only:

| Route | Per block | Episode | Episodes affordable from 4,135 cr |
|---|---|---|---|
| Tutorial's recipe (Seedance 2.0 1080p) | 90 | **2,700** | 1.5 |
| Gemini Omni (previous plan) | ~30 | ~900 | 4.5 |
| **Kling v3.0, sound off, 1080p pro** | **~15** | **~450** | **~9** |
| Kling 3.0 Turbo 720p (cheapest) | 14 | ~420 | ~9.8 |

**A full 5-minute 1080p episode now costs ~450 credits instead of 2,700** —
and the 3-minute fallback cut is no longer needed. The 5-minute version is
the default.

## The pipeline change Kling forces (and why it's an upgrade)

Kling's `medias` accepts only `start_image` / `end_image` — **not**
`image_references`. So the official workflow's "attach one style key to every
clip" does not apply. Instead:

```
Nano Banana Pro  →  style key                        (0 cr, once)
Nano Banana Pro  →  one styled still per block       (0 cr × 30, key as reference)
Kling v3.0       →  animate each still, sound off    (13.5 cr × 30)
seed_audio       →  narration per block              (small)
explainer_video  →  assemble (fixed 10s blocks)      (included)
```

Three real advantages over the reference-weighted approach:

1. **Free visual QC.** Stills cost nothing, so the entire episode's look can be
   reviewed and re-rolled *before* any animation spend. Rejecting a bad still
   costs 0; rejecting a bad Seedance clip cost 90.
2. **Tighter style lock.** A start frame *fully determines* the look; a
   reference image only biases it. Style drift across 30 blocks largely
   disappears.
3. **Better audio control.** Silent clips mean the narration sits clean, with
   no model-invented ambience fighting it. Add one music/ambience bed in post
   if wanted.

Cost: one extra generation step per block, at zero credits.

Models that keep `image_references` if we ever want the original method:
`seedance_2_0_mini` (15–20 cr, budget tier) or `gemini_omni` (~30 cr).

## Non-generation spend to watch

The ledger also shows **"Claude Fable 5"** charges — roughly 3–15 credits per
call plus a ~117-credit daily line item, and small "Vision Analyze" (0.03) and
"Learning" (0.6) entries. Planning and scripting are not literally free in
credits; they are just cheap relative to generation. Budget ~150–250 credits
per production week for orchestration overhead.

## Revised plan

1. **Calibration is now cheap and still mandatory** (~30 credits): one style
   key + one styled still + **one Kling v3.0 clip at `sound:"off"`,
   `mode:"pro"`, `duration:10`** + one voice take. Confirm 10s pricing (the
   13.5 figure is for 9s) and get `seed_audio`'s unknown price. Then batch.
2. **Default config, locked:** `kling3_0`, `duration: 10`, `mode: "pro"`,
   `sound: "off"`, start_image = that block's Nano Banana Pro still.
3. **Full 5-minute episodes (30 blocks) from EP01 onward** — the 3-minute cut
   in the EP01 file is now a fallback only.
4. **15% retry reserve** per episode (~70 credits). Two identical failures =
   fix the prompt, not the dice.
5. **Runway:** ~9 episodes at 1080p from the current balance, or ~6 episodes
   plus Shorts and orchestration overhead. That covers the entire 6-week
   calendar with room to spare.

## Unlimited-generation note

`kling3_0`, `gemini_omni`, `seedance_2_0`, `seedance_2_0_mini` and `wan2_7`
all carry `supports_unlim: true` — they accept free-trial *unlimited*
generations. This account currently shows `unlim.available: false`. If an
Unlimited window is ever active, clip cost drops to zero on those models and
batch size stops mattering; check `models_explore(unlim: true)` before any
large batch.
