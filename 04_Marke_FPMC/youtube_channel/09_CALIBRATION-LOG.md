# Calibration Log — EP01 hook test run

First real production run: EP01 blocks 1–3 (the 30-second opening hook),
generated end to end to validate the pipeline and pin down real costs and
settings. Findings here override estimates elsewhere.

## Confirmed prices (via `get_cost` preflight — free, use it before every batch)

| Item | Config | Credits |
|---|---|---|
| Still image | `nano_banana_pro` → routes to `nano_banana_2`, 1k, 16:9 | **2** |
| Clip | `kling3_0`, 10s, `mode:pro`, `sound:off`, 16:9 → 1920×1080 | **17.5** |
| Voice take | `seed_audio`, ~22 words | **0.6** |
| Subtitles | per voiced block | 0.05 |

**Per block: 2 + 17.5 + 0.6 = ~20.1 credits.**
5-minute episode (30 blocks): **~605 credits.** 3-minute (18 blocks): ~365.

`nano_banana_pro`'s earlier 0-credit entries were a promotion that has ended —
stills now cost 2. Use `get_cost: true` to preflight; it costs nothing.

## Settings that are now locked

```
CLIP:  model kling3_0 · duration 10 · mode pro · sound off · aspect 16:9
       medias: [{value: <block still job id>, role: "start_image"}]
       → outputs 1920×1080, silent
STILL: model nano_banana_pro · aspect 16:9
       medias: [{value: <style key job id>, role: "image"}]
VOICE: model seed_audio · voice_type preset
       voice_id dc382508-c8bd-443c-8cb2-46e57b8d2e6f  (Sterling, male)
ASSEMBLY: explainer_video · width 1920 · height 1080 · subtitles {font: anton}
```

**Style key job id (reuse on every episode): `c5c16d5b-e11d-4134-a5cc-be561ba4feb1`**

## The big surprise: `speech_rate` is unreliable and must be tuned per block

Seed Audio's default pace is far too slow for a 10-second block, and the
`speech_rate` parameter does not respond consistently. Measured, same voice,
same ~22-word line length:

| Block | rate 0 | rate 30 | rate 45 | rate 60 | rate 70 |
|---|---|---|---|---|---|
| 1 ("Nineteen eighty-three…") | 16.60 s | — | **8.47 s** ✅ | 6.00 s | — |
| 2 ("Millions of cartridges…") | 12.88 s | — | 12.81 s ❌ | — | pending |
| 3 ("But this collapse…") | 16.10 s | **8.89 s** ✅ | 6.13 s | — | — |

Block 2 came back at 12.81 s on rate 45 — essentially unchanged from rate 0,
while the identical setting cut block 1 nearly in half. The parameter is
applied inconsistently per generation.

**Production rule:** never trust one rate across an episode. Generate each
take, **read `results.durationSec`**, and re-take any block outside
**8.0–9.5 s**. Start at `speech_rate: 45`; if a take comes back long, step up
(70, then 90); if short, step down (30, then 20). Each re-take costs 0.6
credits, so a 30-block episode with a 30% re-take rate adds only ~5 credits —
budget it and don't skip the check.

Do **not** rely on the assembler to fix overruns: it speeds long takes up
pitch-safely, but a 12.8 s take squeezed into 10 s is a 1.28× speed-up that
audibly rushes the narration and undercuts documentary gravitas.

## Other operational notes

- **Decline the preset recommendation.** Submitting a Kling clip returns a
  `preset_recommendation` notice (it matched our prompt to the viral "IN THE
  DARK" preset) and **does not submit the job**. Re-submit with
  `declined_preset_id: "<that preset id>"` to generate the prompt literally.
  Presets are wrong for documentary work.
- **`generate_image` routes `nano_banana_pro` → `nano_banana_2`** server-side.
  The style reference is still honoured (it appears as `reference_images`).
- **Assets cannot be downloaded in this environment.** The network policy
  blocks the Higgsfield CDN (`d8j0ntlcm91z4.cloudfront.net`), so clips and
  stills cannot be pulled to disk or inspected here — review them in the
  Higgsfield widget / web app. Plan the final upload to YouTube from a machine
  with normal network access.
- **Poll with `job_display`** (there is no `job_status` tool exposed);
  completed jobs return `results.rawUrl` and, for audio, `durationSec`.
- Stills finish in ~30–90 s; Kling 10 s `pro` clips take several minutes.
  Submit stills for all blocks first, QC them, then batch the clips.

## Job ids from this run

| Asset | Job id | Note |
|---|---|---|
| Style key | `c5c16d5b-e11d-4134-a5cc-be561ba4feb1` | reuse forever |
| Still B1 (electronics store) | `5be364bf-5045-44ce-9753-e9690fefa11b` | |
| Still B2 (desert landfill) | `6ddfae05-09b3-4717-830e-d2f0a56fe254` | |
| Still B3 (cartridge tower) | `0e55d713-3ff3-4385-bc5e-4768f2a0b7e7` | |
| Clip B1 | `cb10d0be-828f-4296-86d1-752df2df4970` | |
| Clip B2 | `979c21b6-075f-4df7-84d4-c46b4eb514d6` | |
| Clip B3 | `0226ae07-5668-4058-be7b-e9b6f4b518ad` | |
| Voice B1 | `fd875163-c5ea-40ed-8480-090598b04b3e` | rate 45, 8.47 s |
| Voice B3 | `ed12d476-9aa8-4897-b6e5-78efe605228a` | rate 30, 8.89 s |
