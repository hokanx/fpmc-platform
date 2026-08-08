# Production Runbook — one episode, start to finish

Based on the Higgsfield **video-explainer workflow** (the official MCP
workflow behind the tutorial's "one prompt" demo). Run everything from a
Claude session with the Higgsfield MCP connected — like this repo's session.

**Golden rule: Phases 0–3 are free. Credits are spent only in Phases 1/4/5/6
— and only after the calibration step in `04_CREDIT-BUDGET.md`.**

## Pipeline overview

| Phase | Output | Cost |
|---|---|---|
| 0 Decisions | style, duration, language, character, aspect, subtitles | free |
| R Research | verified facts + sources | free |
| 2 Narration | N blocks of ~20–24 words (N = minutes × 6) | free |
| 3 Block prompts | N structured video prompts | free |
| 1 Style key | one reference image locking the look (`nano_banana_pro`) | 0 cr |
| 1b Block stills | N styled start frames (`nano_banana_pro` + style key) | 0 cr |
| 4 Clips | N × 10s clips (`kling3_0`, pro, 1080p, **sound off**) | ~15 cr × N |
| 5 Voice | N takes, same voice_id (`seed_audio`) | small |
| 6 Assembly | final MP4 (server-side `explainer_video`) | included |

**Model choice is settled by verified pricing** (`04_CREDIT-BUDGET.md`):
Kling v3.0 with `sound:"off"` costs ~15 credits per 10s block at 1080p `pro`
— about 6× cheaper than the tutorial's Seedance 2.0 route and cheaper than
Gemini Omni while being higher resolution. Because Kling takes a
**start_image** rather than an image reference, each block gets its own free
Nano Banana Pro still (Phase 1b), which also lets us QC the whole episode's
look before spending anything on animation.

Phases 0, R, 2, 3 are **already done** for EP01–EP03 (this package).

## Phase 0 decisions (locked for the channel)

- **Style:** custom descriptor (see episode files) — cinematic painterly
  documentary illustration. At production, when Claude shows the style
  gallery, answer with our own description instead of a preset.
- **Duration:** EP01 3 or 5 min depending on calibration; later episodes 5 min.
- **Language:** English. **Character:** faceless (no mascot).
- **Aspect:** 16:9. **Subtitles:** ON, font `anton` (documentary weight)
  — 0.05 cr/block, worth it for retention + accessibility.

## Per-episode procedure

1. **Open the episode file** (`episodes/EPxx…`) — narration blocks and block
   prompts are final; re-verify any fact marked ⚠ if time has passed.
2. **Style key (Phase 1):** submit the episode's STYLE KEY prompt via
   `generate_image` (model `nano_banana_pro`, aspect 16:9). Poll `job_status`.
   Keep the **job id**. EP02+ reuse EP01's key job id (same channel look) —
   reuse is free and locks consistency.
3. **Block stills (Phase 1b):** for each block, `generate_image` with
   `model: nano_banana_pro`, aspect 16:9, the block's SCENE text rewritten as
   a still description, and `medias: [{value: <style key job id>, role:
   "image"}]`. These are free — review all N stills as a contact sheet and
   re-roll any that drift **before** spending a credit on animation. Keep each
   still's job id.
4. **CALIBRATION GATE (first episode only):** animate Block 1 only → check
   `transactions` for the exact 10s price and `seed_audio`'s cost → compute
   the full-batch total → proceed (see `04_CREDIT-BUDGET.md`).
5. **Clips (Phase 4):** for each block, `generate_video` with
   `model: kling3_0`, `duration: 10`, `mode: "pro"`, **`sound: "off"`**, the
   block's MOTION/SCENE prompt, and
   `medias: [{value: <that block's still job id>, role: "start_image"}]`.
   `sound: "off"` is not optional — it cuts the price 78% and the narration
   replaces clip audio anyway. Submit in batches, record every job id,
   re-submit only failures. Two identical failures = rewrite the prompt,
   don't re-roll.
6. **Voice (Phase 5):** call `list_voices` **once at EP01** — pick the
   channel narrator (calm, low, documentary — see `03_CHANNEL-IDENTITY.md`)
   and record its `voice_id` + `voice_type` below. Then one `generate_audio`
   per block (`model: seed_audio`, same voice every time, plain text, no
   cues). Each take ≤ ~9.5 s; too long → shorten the line or raise
   `speech_rate`, and re-take.
7. **Assemble (Phase 6):** call `explainer_video` with the clips' resolution
   as `width`/`height` (**1920 × 1080** on the Kling 1080p route),
   `subtitles: {font: "anton"}`, and the ordered
   `{video: <clip job id>, audio: <voice job id>}` pairs. Poll, download MP4.
8. **QC pass (human, mandatory):** watch end-to-end. Check: style drift,
   audio/video sync, factual accuracy vs. the Sources list, any accidental
   on-screen text, subtitle timing. Fix single blocks by regenerating them
   and re-assembling — assembly re-runs are the cheap part.
9. **Package:** generate 3 thumbnails + pick title/description/tags from
   `07_UPLOAD-PACKAGE-TEMPLATES.md`.
10. **Upload:** YouTube Studio → upload → paste metadata → **check "Altered
   or synthetic content"** → 3 thumbnails into Test & Compare → NOT made
   for kids → add chapters → schedule per calendar.

## Channel constants (fill in at EP01 production, then never change)

```
STYLE_KEY_JOB_ID = ________________
NARRATOR_VOICE_ID = ________________
NARRATOR_VOICE_TYPE = preset | element
CLIP_CONFIG = kling3_0 · duration 10 · mode pro · sound off · start_image
```

## Shorts variant

Shorts use the same pipeline at N=3–6 blocks with a **9:16 style key**
(generate once, reuse). Script formula in `06_CONTENT-CALENDAR.md`.
Cost per Short ≈ 3–6 clips → calibrate the same way.
