# Credit Budget & Cost Control

**Balance at planning time: 1,000.83 credits** (Creator plan, 2026-07-14).
Yesterday's experiments burned ~1,200 credits — this doc exists so that
never happens blind again.

## Observed real costs (from this account's transaction history)

| Item | Credits | Source |
|---|---|---|
| Seedance 2.0 clip (1080p tier) | **176** | 5× observed 2026-07-13 |
| Seedance 2.0 clip (lower tier/720p) | **72** | 1× observed |
| Kling v3.0 clip | **60** | 8× observed |
| Cinematic Studio image | **2** | many observed |
| Subtitles (Whisper, per voiced block) | **0.05** | workflow docs |

## Estimated (must calibrate before batch production)

| Item | Estimate | Basis |
|---|---|---|
| `gemini_omni` 10s @720p clip | **~20–40** | ≈$1.00/10s per public pricing reports; not yet observed on this account |
| `seed_audio` voice take (~9s) | **~1–5** | typical TTS pricing tier |
| `nano_banana_pro` image | **~2–6** | comparable to observed image costs |

## Per-episode scenarios (5 min = 30 blocks; 3 min = 18 blocks)

| Scenario | Clips | Voice | Key+thumbs | **Total** | Verdict with 1,000 cr |
|---|---|---|---|---|---|
| Tutorial's exact recipe (Seedance 1080p, 5 min) | 5,280 | ~90 | ~10 | **~5,400** | ❌ impossible |
| Seedance 720p, 5 min | 2,160 | ~90 | ~10 | **~2,300** | ❌ needs top-up |
| Kling v3.0, 5 min | 1,800 | ~90 | ~10 | **~1,900** | ❌ needs top-up |
| **gemini_omni, 5 min** | ~600–1,200 | ~90 | ~10 | **~700–1,300** | ⚠️ only after calibration |
| **gemini_omni, 3 min** ← launch plan | ~360–720 | ~54 | ~10 | **~450–800** | ✅ fits |

## The plan

1. **Calibrate first (≤ ~65 credits):** generate the EP01 style key
   (`nano_banana_pro`, ~2–6 cr) + **one** EP01 clip (`gemini_omni`, 10s,
   720p) + **one** voice take. Then call the Higgsfield `transactions` tool
   and read the *exact* per-item cost. Multiply by block count before
   committing to the batch. **No batch generation before this step.**
2. **EP01 as a 3-minute launch cut (18 blocks)** if gemini_omni lands above
   ~30 cr/clip; full 5-minute (30 blocks) if it lands below. EP01's script
   is written so blocks 1–18 form a complete arc and 19–30 extend it
   (see `episodes/EP01…`, "3-minute cut" markers).
3. **Never regenerate blindly.** A failed/off-style clip → fix the prompt
   (two identical failures = wrong prompt, per workflow docs), regenerate
   only that block. Budget a **15% retry reserve**.
4. **Upgrade path:** once monetized or topped up, re-render flagship
   episodes with Seedance 2.0 @1080p for quality; scripts and prompts are
   model-agnostic.
5. **Free work is unlimited:** research, scripts, block prompts, titles,
   descriptions, tags, calendar — everything in this package costs zero.
   Only Phases 1/4/5/6 of the pipeline (key image, clips, voice, assembly)
   spend credits.

## Monthly cadence math (after calibration)

At ~25 cr/clip: one 5-min episode ≈ 850 cr incl. voice, thumbs, retries.
Creator-plan monthly credits + one 2,000-pack ≈ 2–3 episodes + 4–8 Shorts
per month — matching the calendar in `06_CONTENT-CALENDAR.md`. Scale only
after the first RPM data arrives.
