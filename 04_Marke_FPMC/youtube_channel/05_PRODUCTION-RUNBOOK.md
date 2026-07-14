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
| 1 Style key | one reference image locking the look | ~2–6 cr |
| 4 Clips | N × 10-second clips (`gemini_omni`, 720p) | ~20–40 cr × N |
| 5 Voice | N takes, same voice_id (`seed_audio`) | ~1–5 cr × N |
| 6 Assembly | final MP4 (server-side `explainer_video`) | included |

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
   Keep the **job id** — it's attached to every clip. EP02+ may reuse EP01's
   key job id (same channel look) — reuse is free and locks consistency.
3. **CALIBRATION GATE (first episode only):** generate Block 1's clip and
   voice take only → check `transactions` → compute the full-batch cost →
   proceed / shorten / postpone (see `04_CREDIT-BUDGET.md`).
4. **Clips (Phase 4):** for each block, `generate_video` with
   `model: gemini_omni`, `duration: 10`, `resolution: "720p"`, the block's
   prompt, and `medias: [{value: <style key job id>, role: "image"}]`.
   Do NOT pass aspect_ratio (the key sets framing). Submit in batches,
   record every job id, re-submit only failures. Review every clip against
   the style; two identical failures = rewrite the prompt, don't re-roll.
5. **Voice (Phase 5):** call `list_voices` **once at EP01** — pick the
   channel narrator (calm, low, documentary — see `03_CHANNEL-IDENTITY.md`)
   and record its `voice_id` + `voice_type` below. Then one `generate_audio`
   per block (`model: seed_audio`, same voice every time, plain text, no
   cues). Each take ≤ ~9.5 s; too long → shorten the line or raise
   `speech_rate`, and re-take.
6. **Assemble (Phase 6):** call `explainer_video` with width 1280, height
   720, `subtitles: {font: "anton"}`, and the ordered
   `{video: <clip job id>, audio: <voice job id>}` pairs. Poll, download MP4.
7. **QC pass (human, mandatory):** watch end-to-end. Check: style drift,
   audio/video sync, factual accuracy vs. the Sources list, any accidental
   on-screen text, subtitle timing. Fix single blocks by regenerating them
   and re-assembling — assembly re-runs are the cheap part.
8. **Package:** generate 3 thumbnails + pick title/description/tags from
   `07_UPLOAD-PACKAGE-TEMPLATES.md`.
9. **Upload:** YouTube Studio → upload → paste metadata → **check "Altered
   or synthetic content"** → 3 thumbnails into Test & Compare → NOT made
   for kids → add chapters → schedule per calendar.

## Channel constants (fill in at EP01 production, then never change)

```
STYLE_KEY_JOB_ID = ________________
NARRATOR_VOICE_ID = ________________
NARRATOR_VOICE_TYPE = preset | element
```

## Shorts variant

Shorts use the same pipeline at N=3–6 blocks with a **9:16 style key**
(generate once, reuse). Script formula in `06_CONTENT-CALENDAR.md`.
Cost per Short ≈ 3–6 clips → calibrate the same way.
