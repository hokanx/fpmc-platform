# Calibration Log — EP01 hook test run

First real production run: EP01 blocks 1–3 (the 30-second opening hook),
generated end to end to validate the pipeline and pin down real costs and
settings. Findings here override estimates elsewhere.

## RESULT: the hook is built ✅

Final assembled video — EP01 blocks 1–3, 30 s, 1920×1080, burned `anton`
subtitles: job `5a8b0398-e862-45e2-a693-d087473e173e`.
View it in the Higgsfield web app / widget (the CDN is unreachable from this
environment).

## Confirmed prices — preflight vs. actually billed

`get_cost` preflight is free and worth calling, but it **overstates** the
Kling price. Trust the ledger:

| Item | Config | Preflight | **Actually billed** |
|---|---|---|---|
| Still image | `nano_banana_pro` → routes to `nano_banana_2`, 1k, 16:9 | 2 | **2** |
| Clip | `kling3_0`, 10s, `mode:pro`, `sound:off` → 1920×1080 | 17.5 | **15** |
| Clip (fallback) | `kling3_0_turbo`, 10s, 1080p | 20 | 20 |
| Voice take | `seed_audio`, ~22 words | 0.6 | **0.8–1.0** |
| Assembly + subtitles | `explainer_video`, per voiced block | — | **0.05** |

**Per block: 2 + 15 + ~1 = ~18 credits.**
5-minute episode (30 blocks): **~540 credits + ~1.5 assembly.**
3-minute (18 blocks): ~325.

Note `kling3_0` with `sound:"off"` (15) is **cheaper than `kling3_0_turbo`**
(20) *and* higher quality — turbo is not the budget option here, the sound
flag is.

`nano_banana_pro`'s earlier 0-credit entries were a promotion that has ended —
stills now cost 2.

## Actual spend for this 3-block test

**89.65 credits** (4,135.36 → 4,045.71). About 35 of that was wasted on
duplicate block-1 clips — see the timing lesson below. A clean 3-block run is
~55 credits.

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
- Stills finish in ~30–90 s. **Kling clip times vary wildly: 4 to 16 minutes
  for identical settings.** Two clips landed in ~4 min; a third, same model and
  parameters, took **16 minutes** while sitting at `in_progress` the whole time.

### Timing lesson (cost me ~35 credits)

I read the 16-minute clip as a stuck job and resubmitted it twice — once on
`kling3_0`, once on `kling3_0_turbo`. Then the original completed normally.
Both duplicates were billed and neither was needed.

**Rule: give a Kling job at least 20 minutes before assuming it is dead.**
`in_progress` is not a failure signal, and there is no partial-progress
indicator to distinguish "slow" from "hung". A genuinely failed job returns a
terminal status. Never resubmit a video job that is still `in_progress` —
resubmission is charged immediately and does not cancel the original.

Because clip time is unpredictable, submit the whole batch, then poll; do not
serialise block-by-block waiting for each one.

## Job ids from this run

| Asset | Job id | Note |
|---|---|---|
| Style key | `c5c16d5b-e11d-4134-a5cc-be561ba4feb1` | reuse forever |
| Still B1 (electronics store) | `5be364bf-5045-44ce-9753-e9690fefa11b` | |
| Still B2 (desert landfill) | `6ddfae05-09b3-4717-830e-d2f0a56fe254` | |
| Still B3 (cartridge tower) | `0e55d713-3ff3-4385-bc5e-4768f2a0b7e7` | |
| Clip B1 | `cb10d0be-828f-4296-86d1-752df2df4970` | took 16 min |
| Clip B2 | `979c21b6-075f-4df7-84d4-c46b4eb514d6` | ~4 min |
| Clip B3 | `0226ae07-5668-4058-be7b-e9b6f4b518ad` | ~4 min |
| Voice B1 | `fd875163-c5ea-40ed-8480-090598b04b3e` | rate 45 → 8.47 s |
| Voice B2 | `0383d64f-416d-4bed-b346-5b6117cae44c` | rate 70 → 8.06 s |
| Voice B3 | `ed12d476-9aa8-4897-b6e5-78efe605228a` | rate 30 → 8.89 s |
| **Final assembly** | `5a8b0398-e862-45e2-a693-d087473e173e` | 30 s, 1080p, subtitles |

Three near-identical 22-word lines needed three different speech rates
(45 / 70 / 30) to land in the same window — the clearest evidence that this
must be checked per block.

## Still open / next steps

- [ ] **Watch the hook** in the Higgsfield app and judge: style consistency
      across the three shots, whether the painterly look survived animation,
      subtitle legibility, and Sterling's fit as narrator.
- [ ] If Sterling is wrong, re-voice from `list_voices` (~1 cr per take) —
      other documentary-leaning male presets: Arthur, Alistair, Caspian,
      Gideon, Harrison.
- [ ] Blocks 4–30 of EP01: ~27 × 18 ≈ **490 credits** to finish the episode.
- [ ] Final upload must happen from a machine with normal network access —
      assets cannot be downloaded here.
